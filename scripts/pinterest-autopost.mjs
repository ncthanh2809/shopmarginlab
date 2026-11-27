/**
 * Pinterest API v5 OAuth & Automated Pin Publisher for ShopMarginLab
 *
 * Reads the 22 pre-rendered 1000x1500 PNG pins in products/dist/pins-png/
 * and metadata from products/dist/pins/pinterest-bulk-upload.csv.
 *
 * Commands:
 *   node scripts/pinterest-autopost.mjs auth         # Start local OAuth callback server & save tokens to .env
 *   node scripts/pinterest-autopost.mjs auth-url     # Print OAuth authorize URL only
 *   node scripts/pinterest-autopost.mjs refresh      # Refresh access_token using refresh_token & update .env
 *   node scripts/pinterest-autopost.mjs boards       # List existing Pinterest boards (--sync to create missing)
 *   node scripts/pinterest-autopost.mjs publish      # Publish next N unpublished pins (--limit 2, --dry-run, --pin <slug>)
 *   node scripts/pinterest-autopost.mjs status       # Show queue & environment readiness
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ENV_PATH = join(ROOT, '.env');
const CSV_PATH = join(ROOT, 'products', 'dist', 'pins', 'pinterest-bulk-upload.csv');
const PNG_DIR = join(ROOT, 'products', 'dist', 'pins-png');
const STATE_DIR = join(ROOT, '.tmp');
const STATE_PATH = join(STATE_DIR, 'pinterest-published.json');

const SCOPES = ['boards:read', 'boards:write', 'pins:read', 'pins:write'];

/** Load key=value pairs from .env without overriding existing environment variables. */
function loadDotEnv(filePath = ENV_PATH) {
  if (!existsSync(filePath)) return;
  const raw = readFileSync(filePath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = val;
    }
  }
}

/** Update or append key=value entries in .env while preserving comments and other keys. */
function upsertDotEnv(updates, filePath = ENV_PATH) {
  const existing = existsSync(filePath) ? readFileSync(filePath, 'utf8').split(/\r?\n/) : [];
  const remaining = new Map(Object.entries(updates));
  const nextLines = existing.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return line;
    const key = trimmed.slice(0, trimmed.indexOf('=')).trim();
    if (!remaining.has(key)) return line;
    const val = remaining.get(key);
    remaining.delete(key);
    return `${key}=${val}`;
  });
  for (const [key, val] of remaining.entries()) {
    nextLines.push(`${key}=${val}`);
  }
  writeFileSync(filePath, nextLines.join('\n').replace(/\n*$/, '\n'), 'utf8');
  for (const [key, val] of Object.entries(updates)) {
    process.env[key] = val;
  }
}

/** Parse RFC 4180 CSV text into an array of row objects keyed by header names. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\r') {
      if (text[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).filter((r) => r.some((c) => c !== '')).map((r) => {
    const obj = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = r[i] ?? '';
    }
    return obj;
  });
}

function truncateText(text, maxLen) {
  const s = String(text ?? '').trim();
  if (s.length <= maxLen) return s;
  const sliced = s.slice(0, maxLen - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  return (lastSpace > maxLen * 0.6 ? sliced.slice(0, lastSpace) : sliced).trimEnd() + '…';
}

function getApiBase() {
  const env = (process.env.PINTEREST_ENV || 'production').toLowerCase();
  if (env === 'sandbox') return 'https://api-sandbox.pinterest.com/v5';
  if (env === 'production') return 'https://api.pinterest.com/v5';
  throw new Error(`Invalid PINTEREST_ENV="${env}". Use "production" or "sandbox".`);
}

function getOAuthBasicHeader() {
  const appId = process.env.PINTEREST_APP_ID?.trim();
  const appSecret = process.env.PINTEREST_APP_SECRET?.trim();
  if (!appId || !appSecret) {
    throw new Error('Missing PINTEREST_APP_ID or PINTEREST_APP_SECRET in .env');
  }
  return 'Basic ' + Buffer.from(`${appId}:${appSecret}`).toString('base64');
}

function buildAuthorizeUrl(state) {
  const appId = process.env.PINTEREST_APP_ID?.trim();
  const redirectUri = (process.env.PINTEREST_REDIRECT_URI || 'http://localhost:8787/callback').trim();
  if (!appId) throw new Error('Missing PINTEREST_APP_ID in .env');
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES.join(','),
    state
  });
  return { url: `https://www.pinterest.com/oauth/?${params.toString()}`, redirectUri };
}

async function exchangeOAuthToken(bodyParams) {
  const res = await fetch(`${getApiBase()}/oauth/token`, {
    method: 'POST',
    headers: {
      Authorization: getOAuthBasicHeader(),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(bodyParams).toString()
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`OAuth token request failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

async function refreshAccessToken() {
  const refreshToken = process.env.PINTEREST_REFRESH_TOKEN?.trim();
  if (!refreshToken) {
    throw new Error('Missing PINTEREST_REFRESH_TOKEN in .env');
  }
  const data = await exchangeOAuthToken({
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  });
  const updates = { PINTEREST_ACCESS_TOKEN: data.access_token };
  if (data.refresh_token) {
    // Pinterest rotates refresh tokens on use; always persist the latest one.
    updates.PINTEREST_REFRESH_TOKEN = data.refresh_token;
  }
  upsertDotEnv(updates);
  return data.access_token;
}

async function pinterestFetch(path, options = {}, retryOn401 = true) {
  const token = process.env.PINTEREST_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new Error('Missing PINTEREST_ACCESS_TOKEN. Run "auth" or set it in .env first.');
  }
  const url = `${getApiBase()}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (res.status === 401 && retryOn401 && process.env.PINTEREST_REFRESH_TOKEN && process.env.PINTEREST_APP_ID && process.env.PINTEREST_APP_SECRET) {
    console.log('🔄 Access token expired (401). Refreshing token via OAuth...');
    await refreshAccessToken();
    return pinterestFetch(path, options, false);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Pinterest API ${options.method || 'GET'} ${path} failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

async function listAllBoards() {
  const boards = [];
  let bookmark = '';
  do {
    const qs = bookmark ? `?page_size=100&bookmark=${encodeURIComponent(bookmark)}` : '?page_size=100';
    const page = await pinterestFetch(`/boards${qs}`);
    boards.push(...(page.items || []));
    bookmark = page.bookmark || '';
  } while (bookmark);
  return boards;
}

async function ensureBoard(name, boardMap) {
  const normalized = truncateText(name, 50);
  const key = normalized.toLowerCase();
  if (boardMap.has(key)) return boardMap.get(key);

  const privacy = (process.env.PINTEREST_BOARD_PRIVACY || 'PUBLIC').toUpperCase();
  const created = await pinterestFetch('/boards', {
    method: 'POST',
    body: JSON.stringify({
      name: normalized,
      description: `2026 E-Commerce Seller Fee & Profit Calculators — ShopMarginLab`,
      privacy
    })
  });
  boardMap.set(key, created);
  console.log(`📌 Created board: "${created.name}" (${created.id})`);
  return created;
}

function loadPinsFromCsv() {
  if (!existsSync(CSV_PATH)) {
    throw new Error(`Missing CSV at ${CSV_PATH}. Run "npm run build:pins" first.`);
  }
  const rows = parseCsv(readFileSync(CSV_PATH, 'utf8'));
  return rows.map((r) => ({
    filename: r['Pin Filename'],
    board: r['Board'],
    title: truncateText(r['Title'], 100),
    link: r['Destination Link'],
    altText: truncateText(r['Alt Text'], 500),
    description: truncateText(r['Description'], 800)
  }));
}

function loadPublishedState() {
  if (!existsSync(STATE_PATH)) return { published: {} };
  return JSON.parse(readFileSync(STATE_PATH, 'utf8'));
}

function savePublishedState(state) {
  mkdirSync(STATE_DIR, { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

function parseFlags(args) {
  const flags = { limit: 2, dryRun: false, sync: false, pin: '' };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--dry-run') flags.dryRun = true;
    else if (a === '--sync') flags.sync = true;
    else if (a === '--limit' && args[i + 1]) flags.limit = Math.max(1, Number(args[++i]) || 2);
    else if (a === '--pin' && args[i + 1]) flags.pin = args[++i];
  }
  return flags;
}

async function cmdAuthUrl() {
  const state = randomBytes(12).toString('hex');
  const { url, redirectUri } = buildAuthorizeUrl(state);
  console.log('Open this URL in your browser to authorize Pinterest API v5:\n');
  console.log(url);
  console.log(`\nRedirect URI configured: ${redirectUri}`);
}

async function cmdAuth() {
  const expectedState = randomBytes(12).toString('hex');
  const { url, redirectUri } = buildAuthorizeUrl(expectedState);
  const parsed = new URL(redirectUri);
  const port = Number(parsed.port) || 8787;
  const host = parsed.hostname || 'localhost';
  const callbackPath = parsed.pathname || '/callback';

  console.log('1) Open this URL in your browser and click "Give access":\n');
  console.log(url);
  console.log(`\n2) Waiting for Pinterest callback on http://${host}:${port}${callbackPath} ...`);

  await new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const reqUrl = new URL(req.url || '/', `http://${host}:${port}`);
        if (reqUrl.pathname !== callbackPath) {
          res.writeHead(404).end('Not found');
          return;
        }
        const err = reqUrl.searchParams.get('error');
        if (err) {
          res.writeHead(400).end(`Pinterest OAuth error: ${err}`);
          server.close();
          reject(new Error(`Pinterest OAuth error: ${err}`));
          return;
        }
        const code = reqUrl.searchParams.get('code');
        const state = reqUrl.searchParams.get('state');
        if (!code || state !== expectedState) {
          res.writeHead(400).end('Missing code or invalid state');
          return;
        }
        const tokenData = await exchangeOAuthToken({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          continuous_refresh: 'true'
        });
        const updates = { PINTEREST_ACCESS_TOKEN: tokenData.access_token };
        if (tokenData.refresh_token) updates.PINTEREST_REFRESH_TOKEN = tokenData.refresh_token;
        upsertDotEnv(updates);

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h2>Pinterest OAuth connected!</h2><p>Tokens saved to .env. You can close this tab.</p>');
        console.log('\n✅ Pinterest OAuth tokens saved to .env!');
        server.close();
        resolve();
      } catch (e) {
        res.writeHead(500).end(String(e.message || e));
        server.close();
        reject(e);
      }
    });
    server.listen(port, host);
  });
}

async function cmdBoards(flags) {
  const boards = await listAllBoards();
  console.log(`Found ${boards.length} boards in Pinterest (${getApiBase()}):`);
  for (const b of boards) {
    console.log(`  - ${b.name} [id=${b.id}, privacy=${b.privacy}]`);
  }
  if (flags.sync) {
    const boardMap = new Map(boards.map((b) => [b.name.toLowerCase(), b]));
    const needed = [...new Set(loadPinsFromCsv().map((p) => p.board))];
    for (const name of needed) {
      await ensureBoard(name, boardMap);
    }
    console.log('✅ All CSV boards synced.');
  }
}

async function cmdPublish(flags) {
  const pins = loadPinsFromCsv();
  const state = loadPublishedState();

  let queue = pins.filter((p) => !state.published[p.filename]);
  if (flags.pin) {
    queue = pins.filter((p) => p.filename.includes(flags.pin));
  } else {
    queue = queue.slice(0, flags.limit);
  }

  if (queue.length === 0) {
    console.log('✅ No pending pins to publish.');
    return;
  }

  let boardMap = new Map();
  if (!flags.dryRun) {
    const boards = await listAllBoards();
    boardMap = new Map(boards.map((b) => [b.name.toLowerCase(), b]));
  }

  for (const pin of queue) {
    const pngPath = join(PNG_DIR, pin.filename);
    if (!existsSync(pngPath)) {
      throw new Error(`Missing PNG file: ${pngPath}. Run "npm run build:pins" first.`);
    }
    const imageBytes = readFileSync(pngPath);

    if (flags.dryRun) {
      console.log(`[DRY-RUN] Would publish ${pin.filename}`);
      console.log(`  Board: ${truncateText(pin.board, 50)}`);
      console.log(`  Title (${pin.title.length}/100): ${pin.title}`);
      console.log(`  Link: ${pin.link}`);
      console.log(`  Image: ${pngPath} (${Math.round(imageBytes.length / 1024)} KB)`);
      continue;
    }

    const board = await ensureBoard(pin.board, boardMap);
    const payload = {
      board_id: board.id,
      title: pin.title,
      description: pin.description,
      link: pin.link,
      alt_text: pin.altText,
      media_source: {
        source_type: 'image_base64',
        content_type: 'image/png',
        data: imageBytes.toString('base64')
      }
    };

    const created = await pinterestFetch('/pins', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    state.published[pin.filename] = {
      pinId: created.id,
      boardId: board.id,
      boardName: board.name,
      link: pin.link,
      publishedAt: new Date().toISOString()
    };
    savePublishedState(state);
    console.log(`✅ Published ${pin.filename} -> Pin ID ${created.id} (Board: ${board.name})`);
  }
}

function cmdStatus() {
  const pins = loadPinsFromCsv();
  const state = loadPublishedState();
  const doneCount = pins.filter((p) => Boolean(state.published[p.filename])).length;
  const missingPngs = pins.filter((p) => !existsSync(join(PNG_DIR, p.filename))).length;

  console.log(`Pinterest API Base : ${getApiBase()}`);
  console.log(`.env present       : ${existsSync(ENV_PATH) ? 'yes' : 'no (copy .env.example to .env)'}`);
  console.log(`Access Token       : ${process.env.PINTEREST_ACCESS_TOKEN ? 'configured' : 'missing'}`);
  console.log(`OAuth App + Refresh: ${process.env.PINTEREST_APP_ID && process.env.PINTEREST_APP_SECRET && process.env.PINTEREST_REFRESH_TOKEN ? 'configured' : 'incomplete'}`);
  console.log(`Pins in CSV        : ${pins.length} (missing PNGs: ${missingPngs})`);
  console.log(`Published / Queue  : ${doneCount} published, ${pins.length - doneCount} remaining`);
}

async function main() {
  loadDotEnv();
  const [cmd = 'status', ...rest] = process.argv.slice(2);
  const flags = parseFlags(rest);

  switch (cmd) {
    case 'auth-url':
      await cmdAuthUrl();
      break;
    case 'auth':
      await cmdAuth();
      break;
    case 'refresh':
      await refreshAccessToken();
      console.log('✅ Access token refreshed and saved to .env');
      break;
    case 'boards':
      await cmdBoards(flags);
      break;
    case 'publish':
      await cmdPublish(flags);
      break;
    case 'status':
      cmdStatus();
      break;
    default:
      console.error(`Unknown command: ${cmd}. Use: status | auth-url | auth | refresh | boards | publish`);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌', err.message || err);
  process.exit(1);
});
