# Interaction Tracker

A full-stack analytics tool that tracks page views and clicks on a webpage and visualizes them through a dashboard with session journeys, a click heatmap, and a top-pages ranking.

The project has two parts: `backend/` (Express API + MongoDB + a static demo site for generating test data) and `frontend/` (Next.js dashboard that reads from the API).

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Atlas), Mongoose, CORS, dotenv, nodemon for local development.

**Frontend:** Next.js (App Router) with TypeScript, Tailwind CSS v4, lucide-react for icons. No state management library — local component state and `fetch` are enough at this scale.

**Tracker:** A dependency-free vanilla JS file served as a static asset, designed to drop into any HTML page with one `<script>` tag.

---

## Project Structure

```
interaction-tracker/
├── backend/
│   ├── models/Event.js
│   ├── routes/eventRoutes.js
│   ├── public/ (demo.html, about.html, pricing.html, tracker.js)
│   ├── server.js
│   └── .env
└── frontend/
    ├── app/ (layout, sessions/, heatmap/, top-pages/)
    ├── components/ (Navbar, ThemeProvider, StatsOverview, SessionsTable,
    │                 SessionJourney, HeatmapView, TopPagesList)
    ├── lib/ (api.ts, csv.ts)
    └── .env.local
```

---

## Setup Steps

**1. Prerequisites:** Node.js 18+, and a free MongoDB Atlas account.

**2. Database:** Create a free M0 cluster, add a database user, allow your IP (or `0.0.0.0/0` for local dev) under Network Access, and copy the connection string.

**3. Backend:**

```bash
cd backend
npm install
```

Create `.env`:

```
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/interaction_tracker?retryWrites=true&w=majority
```

Run with `npm run dev`. Visit `http://localhost:5000` to confirm it's live.

**4. Frontend:**

```bash
cd frontend
npm install
npm install lucide-react
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run with `npm run dev` and open `http://localhost:3000`.

**5. Generate test data:** With the backend running, open `http://localhost:5000/demo.html`, `/about.html`, and `/pricing.html` and click around — each page links to the others via a nav bar. Events appear in the dashboard automatically.

**6. Reset data:** Delete the `events` collection's documents via the Atlas web UI (Browse Collections) or `db.events.deleteMany({})` in `mongosh`. It's recreated automatically on the next insert.

---

## API Reference

| Method | Endpoint                   | Purpose                                              |
|--------|------------------------------|-------------------------------------------------------|
| POST   | `/api/events`                | Records a page_view or click event                   |
| GET    | `/api/sessions`              | Sessions with event counts and first/last seen        |
| GET    | `/api/sessions/:sessionId`   | All events for one session, in order                  |
| GET    | `/api/heatmap?page=<url>`    | Click coordinates for a given page                    |
| GET    | `/api/pages`                 | Distinct tracked page URLs                            |
| GET    | `/api/top-pages`             | Pages ranked by total events and unique sessions      |

---

## Assumptions and Trade-offs

**Session identification** is a UUID in `localStorage`, generated on first visit and reused across page loads. A session expires after 30 minutes of inactivity — the standard definition used by most analytics tools — at which point a new UUID is generated on the next visit. Sessions are still tied to a browser profile rather than a person, so clearing storage or switching browsers always starts a new session regardless of timing.

**Click coordinates are page-relative** (scroll offset included), so the same element gives consistent coordinates regardless of scroll position. They don't account for different browser window or screen widths, so aggregating clicks across very different viewport sizes can skew the heatmap. Accurate for a single consistent viewport.

**Heatmap dots use a soft radial gradient with a screen blend** rather than solid markers, so overlapping clicks visually brighten into denser "hot zones" the way a real heatmap does. The trade-off is that individual clicks read as soft glows rather than sharp points — chosen deliberately over a crisper alternative because it better represents click density, which is the actual purpose of a heatmap.

**No authentication** on the dashboard or API. Fine for local development and evaluation, but the event-ingestion endpoint should not be deployed publicly without rate limiting at minimum.

**Search and CSV export run client-side** against already-fetched data rather than as backend queries. Fast at this scale, but wouldn't hold up at a much larger volume of sessions without server-side pagination.

**Most dashboard stats are computed client-side** from data already loaded. The exception is Top Pages, which uses a real MongoDB aggregation since it requires data the dashboard doesn't otherwise have.

**Single MongoDB collection** for all events; sessions and page lists are derived at query time via aggregation rather than stored as separate records. Simpler write path, slightly heavier reads — the right trade-off at this scale.

**No automated tests.** Testing was done manually through the demo pages given the project's scope.