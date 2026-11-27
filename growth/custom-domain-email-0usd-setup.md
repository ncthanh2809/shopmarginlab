# Triển Khai Email Tên Miền Riêng `thanh@shopmarginlab.com` ($0/tháng — Nhận Thư + Newsletter Opt-In + Gửi 1-1 Chuẩn DKIM)

> **Trạng thái hiện tại (đã cập nhật 27/11/2026 trên Cloudflare Account `digitalnomadstep@gmail.com`):**
> - **Domain `shopmarginlab.com`:** **ĐÃ MUA & ACTIVE** trên Cloudflare Registrar, đã gắn Custom Domain vào Cloudflare Pages (`https://shopmarginlab.com/` — 45/45 routes HTTP 200).
> - **Cloudflare Email Routing:** **ĐÃ BẬT & READY** (`thanh@`, `founder@`, `support@shopmarginlab.com` → chuyển tiếp về `digitalnomadstep@gmail.com`).
> - **Chiều gửi SMTP (Brevo + Resend):** Đã nạp đủ DNS SPF/DKIM/DMARC cho cả Brevo & Resend (Resend `shopmarginlab.com` đã Verified và gắn vào Gmail Send-As, đang chờ bấm xác nhận mã gửi về `digitalnomadstep@gmail.com`).

---

## Câu Trả Lời Ngắn: Khách Có Thấy Người Gửi Là `thanh@shopmarginlab.com` Không?

- **CÓ — nếu bạn gắn Brevo Free SMTP (hoặc MailerLite/SMTP2GO)** vào phần xác thực domain trên Cloudflare DNS. Lúc đó:
  1. **Khi gửi Newsletter / 5-Email Opt-In tự động (Brevo / MailerLite):** Khách thấy người gửi là **`Thanh Nguyen <thanh@shopmarginlab.com>`**, vượt chuẩn **SPF + DKIM + DMARC**, không bị gắn nhãn *"via ..."*.
  2. **Khi gửi 1-1 trực tiếp trong Gmail (`digitalnomadstep@gmail.com` hoặc `chithanhisme@gmail.com`):** Nếu chọn *"Send mail as `thanh@shopmarginlab.com`"* và điền SMTP của Brevo (`smtp-relay.brevo.com:587`) hoặc Resend (`smtp.resend.com:587`), khách sẽ thấy **`Thanh Nguyen <thanh@shopmarginlab.com>`** (không dính `via gmail.com`).
  3. **Khi khách bấm Reply hoặc gửi thư tới `thanh@shopmarginlab.com` / `founder@shopmarginlab.com`:** Cloudflare Email Routing (miễn phí 100%) chuyển tiếp thẳng vào hộp thư `digitalnomadstep@gmail.com` của bạn.

> **Lưu ý quan trọng:** Nếu bạn CHỈ bật Cloudflare Email Routing (chỉ làm chiều nhận) mà dùng SMTP miễn phí của `@gmail.com` để gửi ra ngoài, Gmail sẽ kẹp thông tin `chithanhisme@gmail.com` vào header ("via gmail.com") và **DKIM không khớp `shopmarginlab.com`**. Vì vậy **bắt buộc phải ghép thêm Brevo Free SMTP (hoặc Zoho/Workspace)** cho chiều gửi đi!

---

## Quy Trình Triển Khai 4 Bước

### Bước 1: Đăng ký domain `shopmarginlab.com` trên Cloudflare Registrar (~$11.17/năm)
1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com/) bằng tài khoản `digitalnomadstep@gmail.com`.
2. Vào **Domain Registration -> Register Domains** -> tìm **`shopmarginlab.com`** -> thanh toán ($11.17/năm, không markup, miễn phí WHOIS privacy).
3. Báo lại cho AI ngay sau khi mua xong — AI có thể dùng kết nối Cloudflare MCP để làm tự động các bước cấu hình kỹ thuật còn lại (Pages custom domain, Email Routing, DNS records).

### Bước 2: Bật Cloudflare Email Routing ($0/tháng — Chiều NHẬN)
1. Trong Zone `shopmarginlab.com` -> **Email -> Email Routing -> Get Started**.
2. Thêm **Destination address:** `digitalnomadstep@gmail.com` -> mở Gmail bấm link xác nhận.
3. Tạo 3 **Custom addresses** trỏ về `digitalnomadstep@gmail.com`:
   - `thanh@shopmarginlab.com` *(địa chỉ chính gửi/nhận với khách & đối tác)*
   - `founder@shopmarginlab.com` *(alias đại diện nhà sáng lập)*
   - `support@shopmarginlab.com` *(alias hỗ trợ đặt ở chân trang website & hồ sơ Affiliate)*
4. Cloudflare tự động tạo các bản ghi **MX** và **TXT (SPF)** cho chiều nhận.

### Bước 3: Kết nối Brevo Free ($0/tháng, tối đa 300 email/ngày — Chiều GỬI + Newsletter Opt-In)
1. Tạo tài khoản miễn phí tại [Brevo](https://www.brevo.com/).
2. Vào **Settings -> Senders, Domains & Dedicated IPs -> Domains -> Add a domain**: nhập `shopmarginlab.com`.
3. Copy các bản ghi DNS Brevo cung cấp (thường gồm **Brevo code TXT**, **DKIM TXT/CNAME**, và **DMARC TXT**) dán vào Cloudflare DNS.
   - **Lưu ý gộp SPF (tối đa 1 bản ghi `v=spf1` duy nhất cho 1 domain):**
     ```text
     v=spf1 include:_spf.mx.cloudflare.net include:spf.brevo.com ~all
     ```
   - **DMARC khuyến nghị:**
     ```text
     Name: _dmarc
     Type: TXT
     Value: v=DMARC1; p=quarantine; rua=mailto:thanh@shopmarginlab.com
     ```
4. Tạo **Sender** mới trên Brevo: Name = `Thanh Nguyen`, Email = `thanh@shopmarginlab.com` (xác nhận qua mail chuyển tiếp về Gmail).
5. **Gắn vào Gmail để gửi 1-1 dưới tên `thanh@shopmarginlab.com`:**
   - Trong Gmail (`digitalnomadstep@gmail.com` — hoặc `chithanhisme@gmail.com` nếu thao tác qua CLI) -> **Settings -> See all settings -> Accounts and Import -> Send mail as -> Add another email address**.
   - Nhập Name: `Thanh Nguyen`, Email: `thanh@shopmarginlab.com` *(bỏ tick "Treat as an alias" hoặc để mặc định tùy thói quen Reply)*.
   - Ở bước **SMTP Server**:
     - **SMTP Server:** `smtp-relay.brevo.com`
     - **Port:** `587` (TLS)
     - **Username:** Email đăng nhập Brevo của bạn (lấy trong *SMTP & API -> SMTP*)
     - **Password:** **SMTP Key** tạo trong Brevo *(không phải mật khẩu đăng nhập web)*
   - Nhập mã xác nhận 6 số Gmail gửi về `thanh@shopmarginlab.com` (đã route về Gmail).

### Bước 4: Cập nhật Code & Redeploy lên `https://shopmarginlab.com`
Sau khi gắn Custom Domain `shopmarginlab.com` vào Cloudflare Pages project `shopmarginlab` và xác thực xong email:
1. Build lại site với domain & email mới:
   ```powershell
   $env:PUBLIC_SITE_URL="https://shopmarginlab.com"
   $env:SUPPORT_EMAIL="thanh@shopmarginlab.com"
   npm run build:site
   npm test
   ```
2. Sinh lại toàn bộ mẫu thư gửi từ `thanh@shopmarginlab.com`:
   ```powershell
   node scripts/lead-outreach-generator.mjs scripts/verified-prospects-batch1.csv --url=https://shopmarginlab.com --from-email=thanh@shopmarginlab.com --out=outreach/verified-campaigns.md
   ```
3. Kích hoạt **5-Email Welcome Automation** trong Brevo (nội dung sẵn tại [social-distribution-pack.md](./social-distribution-pack.md)) cho những người tải `$0` Cheat Sheet.

---

## Lịch Warm-Up An Toàn Cho Domain Mới (Tránh Vào Spam)
- **Ngày 1–7:** Gửi 3–5 thư/ngày (test qua lại giữa Gmail, hộp thư phụ, đối tác/bạn bè thật, có mở thư & trả lời).
- **Ngày 8–14:** Tăng lên 5–10 thư/ngày (ưu tiên người nhận chất lượng cao từ Batch 1, theo dõi bounce = 0%).
- **Từ tuần 3:** Có thể giữ nhịp đều **10–15 thư 1-1/ngày** + gửi chuỗi newsletter opt-in tự động cho người tải `$0` Cheat Sheet. Tuyệt đối **không dùng Brevo/MailerLite để bắn cold list hàng loạt** (chỉ gửi 1-1 cá nhân hóa hoặc opt-in).
