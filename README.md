# Stock Dashboard

A private, single-user portfolio dashboard. Built with Next.js (App Router), gated behind Google sign-in via Auth.js, deployed on Vercel.

## Why it's a real app now

This started as a single self-contained static HTML file. It was rebuilt into a Next.js app for two reasons:

1. **The static file was publicly reachable at its custom domain.** Vercel's built-in login gate ("Vercel Authentication") only protects `*.vercel.app` URLs, never custom domains, on the free Hobby plan. A static file has no way to check who's asking before serving its contents.
2. **Real stock prices.** Prices are now fetched live from [Finnhub](https://finnhub.io) instead of being hardcoded sample numbers.

## Where things live

- `lib/portfolio-data.ts` — the actual holdings: ticker, name, sector, shares owned, cost basis (EUR), target allocation %. This is real portfolio data, not editable via the UI in this version — edit this file directly to add/change a position.
- `lib/news-data.ts` — static per-ticker news headlines, same as before: update this file by hand (or via a Cowork/Claude prompt) when you want fresh headlines.
- `lib/ticker-symbols.ts` — maps each ticker to its Finnhub symbol + currency. European exchange tickers (IWDA, VUSA, ASML, NOVO, AIR) are flagged `knownUnreliable` since Finnhub's free tier doesn't reliably cover non-US exchanges — those show a "Live-Daten nicht verfügbar" badge and fall back to cost-basis value instead of crashing.
- `lib/finnhub.ts` / `lib/fx.ts` — live quote + currency conversion, fetched server-side only (the API key never reaches the browser).
- `lib/suggestions.ts` — the rebalancing suggestions (overweight/underweight/sector concentration/big mover) are computed live from current data, not hardcoded text.
- Historical sparkline charts remain **synthetic** (generated, not real price history) — same as the original design; a real historical feed is a possible future addition, not built here.

## Auth

Only one Google account may ever sign in — set via the `ALLOWED_EMAIL` env var, enforced in `auth.ts`'s `signIn` callback. This is the actual security boundary (not Vercel's platform protection), so it works identically on the custom domain and the `.vercel.app` URL.

## Local development

```
npm install
cp .env.local.example .env.local   # fill in real values
npm run dev
```

You need real Google OAuth credentials to test sign-in locally — add `http://localhost:3000/api/auth/callback/google` as an extra authorized redirect URI on the same Google Cloud OAuth client used in production.

## Required environment variables (set in Vercel, and in `.env.local` for local dev)

| Variable | Where to get it |
|---|---|
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console → APIs & Services → Credentials → OAuth Client ID (Web application) |
| `ALLOWED_EMAIL` | The one Google account allowed to sign in |
| `FINNHUB_API_KEY` | Free account at finnhub.io |
