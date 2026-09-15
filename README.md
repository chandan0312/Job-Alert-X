# JobAlertX — Government Jobs Portal

A modern portal for government job notifications, admit cards, results, answer keys and
syllabus updates — inspired by Sarkari Result and Free Job Alert, rebuilt with a clean,
dashboard-style UI and a light/dark theme.

> **Status:** Phase 1 (polished React frontend) is **complete and runnable** on mock/seed
> data. Phase 2 (the Node/Express + MariaDB REST API) is **built and runnable** in
> [`server/`](server/README.md). The two are not wired together yet — the frontend still
> talks to its mock API layer, which is a drop-in replacement for real HTTP calls.

---

## Screens & features (Phase 1 — done)

- **Discover / Home** — "Trending This Week" hero carousel, "Recently Posted Jobs" cards,
  "Most Popular" course cards, and a right rail with quick search, top categories, top
  recruiters (follow), and a "Now Playing" widget — matching the design mockup.
- **Job details** — overview, important dates, application fee, age limit, vacancy table,
  eligibility, and an important-links panel.
- **Category & "Latest" pages** — browse by department (SSC, UPSC, Banking, Railway,
  Defence, Teaching, Police) or by post type (jobs, admit cards, results, answer keys,
  syllabus), with facet filter chips.
- **Search** — keyword search across all posts.
- **Admin dashboard** — create/edit/delete demo posts (in-memory).
- **Light / dark theme** — functional theme toggle persisted to `localStorage`.
- **Responsive** — mobile drawer sidebar, adaptive grid, keyboard-focus states.

---

## Tech stack

| Layer | Phase 1 (frontend) | Phase 2 (backend) |
|-------|--------------------|-------------------|
| UI | React 18 + Vite 5 | — |
| Styling | Tailwind CSS 3.4 (CSS-variable design tokens) | — |
| Routing | React Router DOM 6 | — |
| Icons | lucide-react | — |
| Data | Mock API over seed data | Node + Express + **MariaDB** (Sequelize) |
| Auth | — | JWT (admin) |

---

## Project structure

```
SarkariFynx/
├── client/                 # React + Vite frontend (Phase 1 — built)
│   ├── public/
│   ├── src/
│   │   ├── components/      # Sidebar, Header, HeroBanner, JobCard, RightSidebar, …
│   │   ├── context/         # ThemeContext (light/dark)
│   │   ├── data/            # seed.js — realistic sample jobs/categories/recruiters
│   │   ├── layouts/         # MainLayout (sidebar + header + footer shell)
│   │   ├── pages/           # Home, JobDetails, CategoryPage, SearchPage, Admin, …
│   │   ├── services/        # api.js — mock service (swap for axios later)
│   │   ├── App.jsx          # routes
│   │   ├── main.jsx         # entry (BrowserRouter)
│   │   └── index.css        # Tailwind + theme tokens
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
└── server/                 # Node/Express API (Phase 2 — built)
    ├── src/
    │   ├── config/          # env.js, db.js (Sequelize + MariaDB)
    │   ├── models/          # Job, Category, Recruiter, Course, NowPlaying, User
    │   ├── controllers/     # jobs, reference data, auth
    │   ├── routes/          # /api router
    │   ├── middleware/      # JWT auth, asyncHandler, error handling
    │   ├── utils/           # serialize, slugify
    │   ├── seed/            # seedData.js + seed.js
    │   ├── app.js           # express app
    │   └── index.js         # entrypoint
    ├── .env.example
    └── package.json
```

---

## Run the frontend

> Requires Node.js 18+ and npm.

```bash
cd "SarkariFynx/client"
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

Production build:

```bash
npm run build     # outputs to client/dist
npm run preview   # serve the built bundle locally
```

See [`client/README.md`](client/README.md) for frontend-specific details.

---

## How the mock data layer works

The UI never imports seed data blindly for network-style reads — it calls
`src/services/api.js`, whose functions (`getJobs`, `getJobById`, `getJobsByCategory`,
`searchJobs`, …) return Promises with a small artificial delay, mirroring real HTTP calls.
The Phase 2 API returns these same shapes, so each function body swaps its seed lookup for
an `axios`/`fetch` call — component code stays unchanged.

---

## Phase 2 — the backend (built)

`server/` is a Node + Express + MariaDB (Sequelize) REST API:

- **Tables:** `jobs` (title, org, category, kind, dates, fee, eligibility, links, …),
  `categories`, `recruiters`, `popular_courses`, `now_playing`, `users` (admin).
- **REST endpoints:** `GET /api/jobs` (with `?category=`, `?kind=`, `?featured=`, `?q=`),
  `GET /api/jobs/:id`, `GET /api/jobs/trending`, `GET /api/jobs/recent`,
  `GET /api/search?q=`, `GET /api/categories`, `GET /api/recruiters`, `GET /api/courses`,
  `GET /api/now-playing`, plus authenticated `POST/PUT/DELETE /api/jobs` for admin.
- **Auth:** JWT-protected admin routes (`POST /api/auth/login`).

### Run the API

> Requires Node.js 18+ and a running MariaDB server.

```bash
cd server
npm install
cp .env.example .env    # then set DB_USER / DB_PASSWORD
npm run seed
npm run dev
```

The database and tables are created automatically — no manual SQL. See
[`server/README.md`](server/README.md) for the full endpoint reference and data model.

### Still to do — wire the two together

The frontend continues to use its mock layer. To go live, add
`VITE_API_URL=http://localhost:4000/api` to `client/.env` and replace the mock bodies in
`client/src/services/api.js` with HTTP calls (the response shapes already match, so no
component changes are needed). `server/README.md` has copy-paste examples.

---

## Notes

- Sample data is illustrative and not tied to any real recruitment notification.
- The "Now Playing" widget is a static UI element from the design mockup (no audio).
