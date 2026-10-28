# KRIS DESIGN X STORE

Dark-premium digital storefront and PostgreSQL-backed admin dashboard built with Next.js.

## Requirements

- Node.js 20+
- PostgreSQL 13+

## Local setup

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to a PostgreSQL database you control. Keep the connection string private.
2. Install dependencies with `npm install`.
3. Create the tables and default store identity settings with `npm run db:init`.
4. Create the initial admin from an interactive terminal with `npm run admin:bootstrap`. The username is `KRISTIAN`; enter the initial password at the hidden prompt. It is never stored in this repository or echoed to the terminal. The command refuses to create another admin if one already exists.
5. Start the website with `npm run dev`, then open `/admin/login`. The first login is required to change the initial password.

The admin password is stored only as an Argon2id hash. Admin login uses HttpOnly, SameSite cookies and database-backed sessions; five failed attempts for the same username and client address trigger a 15-minute lockout. In production, deploy behind a trusted reverse proxy that replaces `x-forwarded-for` with the actual client address, and serve the site over HTTPS. Production session cookies are always Secure.

### Bootstrap the first admin on Vercel

If the site is already deployed and the first admin has not yet been created, add these two **Production** environment variables in Vercel and redeploy:

- `ADMIN_BOOTSTRAP_TOKEN`: a unique random secret of at least 32 characters.
- `ADMIN_INITIAL_PASSWORD`: the initial password you will use for the first login (12–128 characters).

Call `POST https://<your-domain>/api/auth/bootstrap-admin` with `Authorization: Bearer <ADMIN_BOOTSTRAP_TOKEN>` from your own terminal. The endpoint initializes the PostgreSQL schema and creates the `KRISTIAN` admin with an Argon2id password hash, only if no admin account exists. It never returns the password. After it responds with `201`, remove both environment variables from Vercel and redeploy; the one-time endpoint is disabled when the token is absent. Then sign in at `/admin/login` and change the initial password when prompted. Never place either secret in source code or send it in chat.

Store identity, contact channels, logo URL, footer copy, and SEO title/description are editable in **Admin → Pengaturan toko** and stored in PostgreSQL. Product creation, order review/status updates, and customer WhatsApp contact are available in the dashboard.

Checkout records orders in PostgreSQL but does not collect or process payment. The customer and admin WhatsApp buttons prepare a message using the official `wa.me` link; WhatsApp only sends it after the person confirms in WhatsApp. No WhatsApp Business Platform or payment gateway is configured.

## Checks

```sh
npm run typecheck
npm run lint
npm run build
```
