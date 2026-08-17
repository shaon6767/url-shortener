# URL Shortener + Click Analytics

Shorten long URLs, redirect fast via cache, and see click stats over time.

## Features
- Shorten a URL as a guest or a logged-in user
- Redis-cached redirects (Mongo is only hit on a cache miss)
- Rate-limited shortening endpoint (10 req/min/IP)
- Per-URL analytics: clicks by day, clicks by device
- Optional auth — logged-in users get a dashboard of their links

## Tech Stack
**Backend:** Node.js, Express, MongoDB, Mongoose, Redis (ioredis), express-rate-limit
**Frontend:** Next.js (App Router), Tailwind CSS v4, Recharts, Axios

## Architecture Notes
- Redirects check Redis first, falling back to MongoDB only on a cache miss
  (and re-populating the cache) — keeps the hot path fast under load.
- Click logging happens asynchronously after the redirect is sent, so
  analytics writes never add latency to the user-facing redirect.
- Analytics use MongoDB's aggregation pipeline ($match + $group +
  $dateToString) instead of pulling raw documents and reducing in JS.
- Short codes are generated with `crypto.randomBytes` (base64url), avoiding
  an external ID-generation dependency.
- Reserved-path caveat: the redirect route is mounted at the root (`/:code`),
  the same pattern real shorteners use — API routes are matched first, so
  this only becomes an issue for a short code that happens to collide with
  a reserved path segment (very unlikely with random 6-char codes).

## Deliberate scope decisions
- No custom-alias URLs (e.g. picking your own short code) — random codes only.
- No link expiration or deactivation feature.
- Device detection is a simple user-agent regex, not a full parsing library —
  fine for "mobile vs desktop," not meant to be precise.

## Known limitations
- No pagination on the "my URLs" dashboard list.
- Click logging is fire-and-forget — if it fails, the redirect still
  succeeds but that click won't appear in analytics (logged to console).

## Setup

### Server
\`\`\`bash
cd server
cp .env.example .env
npm install
npm run dev
\`\`\`
Needs a local or hosted Redis instance (Upstash has a free tier).

### Client
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

## API Overview
| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Log in |
| POST | /api/urls | Shorten a URL (guest or logged in) |
| GET | /api/urls/mine | My shortened URLs |
| GET | /api/urls/:id | URL detail (owner only) |
| GET | /api/urls/:id/analytics | Click stats by day/device (owner only) |
| GET | /:code | Redirect to original URL |
