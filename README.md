# Haven Chandigarh Parent Emails

Secure parent-contact management and individual Gmail delivery for Haven Chandigarh Parent Check-In calls. Admin APIs use a signed HTTP-only session. Every attempt is logged and successful call-recipient pairs are idempotent.

## Local setup

Copy `.env.example` to `.env.local`, fill in its placeholders, then run `npm install`, `npx prisma migrate dev --name init`, `npx prisma generate`, and `npm run dev`. Visit `/admin` and sign in with `ADMIN_SECRET`.

Required: `DATABASE_URL`, `ADMIN_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, and `GOOGLE_REFRESH_TOKEN`. Add `NEXT_PUBLIC_APP_URL`, `LUMA_WEBHOOK_SECRET`, and `CRON_SECRET` for production integrations.

## Google Gmail

Enable Gmail API in Google Cloud, authorize `https://www.googleapis.com/auth/gmail.send`, and add `http://localhost:3000/api/auth/google/callback` locally or `${NEXT_PUBLIC_APP_URL}/api/auth/google/callback` in production. Use the Workspace sender `chandigarh@haven.hackclub.com`. Store the resulting refresh token only in the deployment environment; this app never logs it or exposes it in an API response.

## Usage

Create the active call using `POST /api/admin/parent-call`, manage contacts through `/api/admin/parents`, preview at `/admin/preview`, and send one test using `POST /api/email/test`. Bulk send requires `{ "confirm": true }` at `POST /api/admin/send-parent-checkin`. Every parent is sent separately and never sees other recipient addresses.

## Luma and Vercel

Set Luma's URL to `${NEXT_PUBLIC_APP_URL}/api/webhooks/luma`. It verifies `x-luma-signature` as an HMAC-SHA256 hex signature of the raw body and only stores a verified parent email; it never emails participants automatically. Confirm Luma's actual payload/header and adapt `lib/luma/parser.ts` before enabling production delivery.

Add all `.env.example` values to Vercel and migrate the production database. `vercel.json` calls the cron every Monday at 09:00 UTC; adjust the schedule. Vercel supplies `CRON_SECRET` through its authorization header. The endpoint is repeat-safe.

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` before deployment.
