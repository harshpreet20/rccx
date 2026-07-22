This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Store control panel (`/admin/store`)

`/admin/store` manages the RCC Store's (rccecom) orders, products, discounts,
and shipping/tax settings through internal API routes under `app/api/store/*`.
Those routes connect to the **RCC Store's own Supabase project** (a different
project than the one this app's own `NEXT_PUBLIC_SUPABASE_URL` points at) via
a service-role key, so set these two env vars to whatever rccecom's
`.env.local` has for `NEXT_PUBLIC_SUPABASE_URL` and its project's service
role key:

```
STORE_SUPABASE_URL=
STORE_SUPABASE_SERVICE_ROLE_KEY=
```

The routes are gated by `requireAdmin()` (`lib/api-auth.ts`), which checks
the caller's own Supabase session for `app_metadata.is_admin`, the same check
`useAdminAuth()` does for the rest of `/admin`.
