# ShopMarginLab — Tổ Hợp Web Công Cụ Tính Toán SEO + Affiliate B2B + Sản Phẩm Số Excel

Dự án thực thi Ngách A (**Tài chính & Giá vốn cho Người bán hàng Online tại Mỹ — Etsy, Shopify, TikTok Shop US, Print-on-Demand**) kết hợp 2 nguồn thu trên cùng một lưu lượng khách tự nhiên:
1. **Hoa hồng Affiliate phần mềm cao cấp:** Shopify (**\$150/khách** qua Impact.com), Printify (**5% doanh số trong 12 tháng**), Link My Books (**20% trọn đời**).
2. **Bán trực tiếp Sản phẩm số `.xlsx` (Biên lợi nhuận >90%):** Bộ bảng tính Excel 5-Tab `Ultimate-Seller-Profit-Inventory-Tax-OS-2026.xlsx` (**\$24**) và `POD-Etsy-Launch-Pricing-Matrix-2026.xlsx` (**\$17**).

---

## Cấu trúc thư mục đã hoàn thiện

- `src/site-config.mjs`: **Tệp cấu hình trung tâm duy nhất** chứa Tên miền, Link Affiliate và Link mua file Excel trên Payhip/Gumroad.
- `src/calculators-data.mjs` & `src/build-site.mjs`: Bộ máy sinh 9 trang tĩnh chuẩn SEO (Trang chủ, 6 Công cụ tính toán 2026 kèm JSON-LD Schema, Trang cửa hàng Excel `/templates/`, Trang pháp lý FTC Affiliate `/legal/`, `sitemap.xml`, `robots.txt`).
- `products/dist/`:
  - `Ultimate-Seller-Profit-Inventory-Tax-OS-2026.xlsx` (File Excel thật có công thức tự động, mở ngay trên Excel / Google Sheets).
  - `POD-Etsy-Launch-Pricing-Matrix-2026.xlsx` (File Excel chuyên tính giá Print-on-Demand & chống lỗ Offsite Ads).
  - `payhip-gumroad-product-listings.md` + `cover-flagship-os.svg` (Tiêu đề, giá, ảnh bìa và mô tả tiếng Anh để đăng lên Payhip/Gumroad).
  - `pins/` + `pinterest-seo-descriptions.md` (6 ảnh dọc `1000x1500` và mô tả chuẩn SEO để đăng Pinterest).

## Các lệnh vận hành

```powershell
# Xuất lại toàn bộ Website + File Excel + Ảnh Pinterest
npm run build

# Chạy kiểm thử toàn diện
npm test

# Xem trực tiếp Website trên máy tại http://localhost:4000
npm start

# Đẩy thẳng lên Cloudflare Pages (sau khi kết nối tài khoản Cloudflare)
npx wrangler pages deploy dist --project-name=shopmarginlab
```
