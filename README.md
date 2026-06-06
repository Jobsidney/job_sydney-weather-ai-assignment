# Sydney Weather Intelligence

A Weather-AI dashboard built for the technical assessment. It consumes live weather data from the [Weather-AI API](https://weather-ai.co/docs) and presents current conditions, forecasts, AI summaries, and Pro-gated features with graceful fallbacks on Free plans.

**Live demo:** https://job-sydney-weather-ai-assignment.vercel.app

**Repository:** https://github.com/Jobsidney/job_sydney-weather-ai-assignment

## What it does

- **Today** — current conditions, sun arc, four-period outlook, hero stats, AI summary (when returned by the API)
- **Hourly / 7-Day** — Apple-style segmented tabs, hourly scroll, expandable daily rows, and a Tonight outlook card
- **Insights** — calls `/v1/insights`; on Free plans shows forecast-based summary, risks, and recommendations plus a Pro upgrade prompt
- **Pro** — calls `/v1/forecast14`; on Free plans falls back to the 7-day forecast from `/v1/weather`
- **Location** — popular cities with live temps, shareable URLs (`?lat=&lon=&city=&country=`), IP geolocation (`/v1/weather-geo`), city search, and precise-location refresh

## Weather-AI endpoints used

| Endpoint | Purpose | UI surface |
|---|---|---|
| `GET /v1/weather` | Current conditions, hourly & daily forecast, AI summary | Hero, Today, Hourly, 7-Day, popular cities |
| `GET /v1/weather-geo` | Auto-detect location from IP | First visit, location picker, nav geo action |
| `GET /v1/insights` | AI risks and recommendations | Insights tab (Pro; Free shows forecast fallback) |
| `GET /v1/forecast14` | 14-day extended forecast | Pro tab (Pro; Free shows 7-day fallback) |
| `GET /v1/ip-lookup` | Search by IP address | Location picker IP search (Pro) |
| `GET /v1/usage` | API quota and plan info | Service wired; not shown in UI |

City name search uses `/api/v1/search`, proxied to Open-Meteo geocoding, to resolve coordinates before calling Weather-AI.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui
- TanStack Query + Zod
- Vercel (static SPA + serverless API proxy)

## Architecture

```
Components → hooks → services (Zod validation) → src/api/client → /api proxy → api.weather-ai.co
```

The API key never reaches the browser. Locally, Vite proxies `/api` to Weather-AI with `Authorization` injected from `.env`. In production, `api/[...path].ts` proxies requests on Vercel.

## Local setup

**Prerequisites:** Node.js 20+, npm, a Weather-AI API key (`wai_...`)

```bash
git clone https://github.com/Jobsidney/job_sydney-weather-ai-assignment.git
cd job_sydney-weather-ai-assignment
cp .env.example .env
```

Add your key to `.env`:

```
API_KEY=wai_your_key_here
```

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `API_KEY` | Yes | Weather-AI Bearer token. Server-side only — never use `VITE_*` |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with API proxy |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Deployment (Vercel)

This project is deployed at https://job-sydney-weather-ai-assignment.vercel.app.

To redeploy or fork:

1. Import the GitHub repo in [Vercel](https://vercel.com)
2. Set environment variable `API_KEY` to your `wai_...` key
3. Deploy — `vercel.json` handles SPA routing and `/api/*` proxy rewrites

No other env vars are required for production.

## Project structure

```
src/
  components/   # UI (weather, layout, shared)
  hooks/        # TanStack Query hooks
  services/     # API domain services + Zod parsing
  api/          # Typed fetch client and error types
  lib/          # Formatters, location helpers, utilities
api/            # Vercel serverless proxy + geocoding helper
```

## Author

Job Sydney — Weather-AI technical assessment submission.
