# ShopMarginLab — Playbook Tìm Nguồn Email & Mời Khách Hàng Bền Vững (2026)

> **Nguyên tắc vàng:** Không mua danh sách email trôi nổi, không gửi thư rác hàng loạt (bulk cold blast) để tránh rơi vào mục Spam và hỏng uy tín hộp thư. Tập trung **15–20 email cá nhân hóa 1-1 mỗi ngày** vào đúng những người **cần công cụ miễn phí ngay lập tức** hoặc **nắm giữ hàng trăm–hàng nghìn người bán hàng mục tiêu**.

---

## 1. Phân Tích 4 Nguồn Email Tỷ Lệ Chuyển Đổi Cao Nhất Cho ShopMarginLab

| Nhóm nguồn | Đối tượng cụ thể | Vì sao họ cần ShopMarginLab? | Cách tìm thêm mỗi ngày |
| :--- | :--- | :--- | :--- |
| **1. Inbound Opt-In (Tự động thu email)** | Người bán tải phễu `$0 Cheat Sheet` (`shopmarginlab.gumroad.com/l/free-2026-fee-cheat-sheet`) | Đã có nhu cầu thật về tính phí Etsy/Shopify/Thuế 1099-K -> tỷ lệ mở mail > 45% | Kéo traffic từ Pinterest, Reddit, YouTube Shorts, SEO về trang chủ & `/templates/` -> Gumroad tự lưu email người tải `$0` để chạy chuỗi 5 email tự động trong `growth/social-distribution-pack.md`. |
| **2. Educators, Podcasts & Blogs (Nhân rộng traffic)** | Coach bán Etsy, blogger POD, host podcast Shopify/Reseller | Họ thường xuyên gắn link *"Free Tools / Resources"* hoặc nhúng widget `?embed=1` miễn phí vào bài hướng dẫn cho học viên/độc giả | Tìm trên Apple Podcasts / Substack / Google: `"etsy seller podcast"`, `"print on demand blog" "resources"`, `"poshmark reseller podcast"`, kiểm tra mục **About / Contact / Show Notes**. |
| **3. Agencies, Cross-Listers & Kế toán E-Commerce (B2B)** | Hãng kế toán Etsy/Shopify/Amazon FBA, studio chuyển shop Etsy sang Shopify, agency TikTok Shop US | Khách hàng của họ liên tục hỏi *"nên sang Shopify lúc nào?"*, *"để dành bao nhiêu tiền thuế 1040-ES?"*, *"cắt bao nhiêu % hoa hồng Creator TikTok?"* | Tìm trên QuickBooks Find-a-ProAdvisor (`ecommerce` / `Shopify` / `Etsy`), Shopify Experts Directory, danh bạ đối tác A2X / Link My Books. |
| **4. Direct Etsy-to-Shopify Independent Brands** | Chủ shop thủ công / POD / nến / trang sức từng bắt đầu từ Etsy và đã mở website Shopify riêng | Trực tiếp dùng máy tính `Shopify vs. Etsy`, `Bundle & BOGO`, `Offsite Ads` và bảng tính Excel `$0–$24` | Tìm Google công khai: `"powered by shopify" "started on etsy" "hello@"`, hoặc xem link website riêng trong bio Instagram/TikTok của các shop Etsy Mỹ. |

---

## 2. Danh Sách Đã Xác Minh Sẵn Trong Repo

- **File dữ liệu nguồn (30 liên hệ đã xác minh công khai):** [`scripts/verified-prospects-batch1.csv`](../scripts/verified-prospects-batch1.csv)
  - **Batch 1 (15 liên hệ ưu tiên cao nhất):** Đã được tạo sẵn thành **Drafts trong Gmail** để bạn kiểm tra và bấm gửi ngay.
  - **Batch 2 (15 liên hệ tiếp theo):** Đã tạo sẵn nội dung chi tiết trong [`outreach/verified-campaigns.md`](../outreach/verified-campaigns.md) để gửi vào ngày tiếp theo (giữ nhịp an toàn 15 email/ngày).

---

## 3. Cách Chạy Lại Generator Khi Bổ Sung Khách Hàng Mới

1. Thêm dòng mới vào [`scripts/verified-prospects-batch1.csv`](../scripts/verified-prospects-batch1.csv) (hoặc tạo `scripts/verified-prospects-batch2.csv`) với đúng cột:
   `BrandOrFirm,ContactName,Email,Segment,Batch,TargetCalcSlug,TargetGuideSlug,PersonalHook,Website`
   - Các giá trị `Segment` hợp lệ: `etsy-educator`, `reseller-tiktok-shopify`, `ecommerce-cpa`, `direct-seller`.
   - `TargetCalcSlug`: `compare` hoặc slug của bất kỳ máy tính nào trong `src/calculators-data.mjs` (ví dụ `etsy-fee-calculator`, `shopify-vs-etsy-calculator`, `tiktok-shop-fee-calculator`, `depop-fee-calculator`, `ecommerce-tax-calculator`...).
2. Chạy lệnh sinh toàn bộ email Ngày 1 + Follow-up Ngày 4:
   ```powershell
   node scripts/lead-outreach-generator.mjs scripts/verified-prospects-batch1.csv --out=outreach/verified-campaigns.md
   ```
3. Mở [`outreach/verified-campaigns.md`](../outreach/verified-campaigns.md) hoặc vào **Gmail -> Drafts** để rà soát và gửi 15–20 email/ngày vào khung giờ **20:00–23:00 giờ VN** (tức **8:00–11:00 sáng giờ bờ Đông Mỹ EST** — tỷ lệ mở email cao nhất!).

---

## 4. Nâng Cấp Khuyên Làm Tiếp Để Tự Động Hóa Thu Email Khách Hàng (Opt-In)

Hiện tại website `https://shopmarginlab.com/` đang dẫn link thẳng sang Gumroad (`https://shopmarginlab.gumroad.com/l/free-2026-fee-cheat-sheet`) cho phễu `$0`. Bạn có thể giữ luồng này (Gumroad tự thu email người tải miễn phí), và khi lượng truy cập tăng lên:
- Tạo tài khoản miễn phí **MailerLite / Brevo / ConvertKit (Kit)** để gắn form nhận **2026 Seller Fee & Tax Cheat Sheet** trực tiếp dưới mỗi máy tính.
- Kích hoạt **5-Email Welcome Automation** đã viết sẵn trong [`growth/social-distribution-pack.md`](./social-distribution-pack.md) để tự động chuyển đổi người tải miễn phí sang bản `$17 / $24` và các link Affiliate (Shopify, Printify, Link My Books).
