# TKT Design

Website công ty tư vấn, thiết kế kiến trúc và thi công nhà phố Việt Nam.

Live (Workers):

- Site: https://tktdesign-web.voviettue-dn.workers.dev
- Admin: https://tktdesign-web.voviettue-dn.workers.dev/admin
- API: https://tktdesign-api.voviettue-dn.workers.dev

- Trang chủ `/`
- Dự án `/du-an`
- Liên hệ `/lien-he`
- Quản trị `/admin`

Stack: SvelteKit (Workers) + API Hono (Workers) + D1 + R2. API dùng Drizzle ORM trên D1. Toàn bộ giao diện tiếng Việt.

Schema Drizzle: `apps/api/src/db/schema.ts` (khớp bảng trong `apps/api/migrations/0001_init.sql`, đã apply). JSON public vẫn snake_case. Schema mới: `pnpm --filter api db:generate` rồi `db:migrate:local` / `db:migrate:remote`.

## Chạy local

```bash
pnpm install
pnpm --filter api secret:generate   # tạo mật khẩu admin, ghi .env
pnpm --filter api db:seed:local
pnpm dev
```

- Web: http://localhost:5173
- API: http://127.0.0.1:8787

Mật khẩu admin nằm trong `.env` và `apps/api/.dev.vars` (không commit). Chỉ hash PBKDF2 được dùng khi kiểm tra đăng nhập. Sai 5 lần thì khóa IP 15 phút.

## Cloudflare

D1 `tktdesign` đã tạo. **R2 phải bật một lần trên dashboard** (gói miễn phí, cần thẻ nếu Cloudflare yêu cầu):

https://dash.cloudflare.com/170dd4fc7c86d07c8a635ac7b78c1e5f/r2

Sau khi bật:

```bash
wrangler r2 bucket create tktdesign-media
pnpm --filter api db:migrate:remote
pnpm --filter api db:seed:remote
# dán ADMIN_SECRET_HASH từ apps/api/.dev.vars
pnpm exec wrangler secret put ADMIN_SECRET_HASH --name tktdesign-api
pnpm deploy
```

Deploy API trước, web sau (web gọi API qua service binding).
