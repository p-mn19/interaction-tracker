# Interaction Tracker

A full-stack analytics tool that tracks page views and clicks on a webpage and visualizes them through a dashboard with session journeys, a click heatmap, and a top-pages ranking.

The project has two parts: `backend/` (Express API + MongoDB + a static demo site for generating test data) and `frontend/` (Next.js dashboard that reads from the API).

---

## Live Demo

- Dashboard: `https://interaction-tracker-theta.vercel.app/sessions`
- Backend API: `https://interaction-tracker-n7mm.onrender.com`
- Demo pages (for generating test data): `https://interaction-tracker-n7mm.onrender.com/demo.html`, `/about.html`, `/pricing.html`


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

## Deployment

**Backend (Render):** New Web Service → connect the GitHub repo → Root Directory `backend` → Build Command `npm install` → Start Command `npm start` → add environment variable `MONGODB_URI`. Render assigns `PORT` automatically.

**Frontend (Vercel):** Import the same repo → Root Directory `frontend` → add environment variable `NEXT_PUBLIC_API_URL` set to the Render service URL → deploy.

**Database (MongoDB Atlas):** Network Access must allow `0.0.0.0/0`, since Render's free tier doesn't use a fixed outbound IP.

**Tracker script:** `tracker.js` calls the API via a relative path (`/api/events`) rather than a hardcoded URL, since it's served from the same origin as the backend on Render. No changes are needed to it across environments.

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
**Session identification** uses a UUID in `localStorage`, expiring after 30 minutes of inactivity (the standard analytics definition). Tied to a browser profile, not a person.

**Click coordinates are page-relative** (scroll included), so they're consistent regardless of scroll position, but not across different viewport widths — accurate for one consistent screen size, not aggregated across many.

**Heatmap dots use a soft gradient with a screen blend** rather than solid markers, so dense clusters visually brighten. Trade-off: individual clicks read as soft glows, chosen deliberately to represent density over per-click precision.

**No authentication** on the dashboard or API, and **CORS is fully open**. Fine for a demo; a production version would need rate limiting and access control.

**Render's free tier sleeps after 15 minutes idle**, so the first request after a quiet period takes 30-60 seconds — a hosting limitation, not a bug.

**Search, CSV export, and most stats run client-side** against already-fetched data. Fast at this scale; wouldn't hold up at much larger volume without server-side pagination. Top Pages is the exception, using a real MongoDB aggregation.

**Auto-refresh is 10-second polling**, not WebSockets — simple, and indistinguishable from real-time at this scale, but with a built-in delay and only while a tab is open.

**Single MongoDB collection** for all events; sessions and pages are derived via aggregation rather than stored separately. Simpler writes, slightly heavier reads.

**No automated tests** — testing was manual, given the project's scope.