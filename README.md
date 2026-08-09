# AdSquadOps

**Catch broken campaigns before they go live.**

AdSquadOps is a QA and SLA console for ad operations teams — validate campaigns automatically, track support tickets against a real SLA clock, log escalations between teams, and see it all rolled up in one dashboard.

🔗 **Live demo**: https://adsquadops.vercel.app

---

## What it does

| Feature | What it means |
|---|---|
| **Campaign QA** | Create a campaign (name, URL, tracking tag, ad copy) and validate it — checks the URL is reachable, the tracking tag has valid UTM format, and an AI check flags if the ad copy doesn't match the destination |
| **SLA Tickets** | Open a support ticket against a campaign, pick High (2h) or Standard (4h) priority, watch a live countdown timer |
| **Escalation Log** | Route a ticket to another team with a reason — tracked as a timestamped trail: Reported → Team → Fixed |
| **Overview** | Live stats: total campaigns, QA pass rate, average SLA response time, open tickets, open escalations |

---

## Tech stack

**Frontend**
- React + Vite
- Tailwind CSS (utility classes only, no compiler plugins)
- [lucide-react](https://lucide.dev/) for icons

**Backend**
- FastAPI (Python)
- SQLite (via Python's built-in `sqlite3`)
- [Groq](https://groq.com/) API for the AI ad-copy alignment check

**Hosting**
- Frontend → [Vercel](https://vercel.com)
- Backend → [Render](https://render.com)

---

## Project structure

```
AdSquadOps/
├── backend/
│   ├── main.py              # FastAPI app — all API routes live here
│   ├── database.py          # SQLite connection + table setup
│   ├── qa_engine.py         # The 3 QA checks (URL, tracking tag, AI copy check)
│   ├── auth.py              # Password hashing for real user accounts
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # GROQ_API_KEY (never committed — see below)
│   └── adsquadops.db        # SQLite database file (created automatically on first run)
│
├── src/
│   ├── App.jsx               # Top-level view router (landing / login / signup / persona / dashboard)
│   │
│   ├── sections/             # Full-width page sections
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── AdOpsOverview.jsx     # "Why AdOps?" — stats strip + pipeline diagram
│   │   ├── ProblemStrip.jsx
│   │   ├── CampaignNews.jsx
│   │   ├── ProductWalkthrough.jsx # "Lifecycle" — 5-step scroll narrative
│   │   ├── HowItWorks.jsx         # Tabbed persona-based walkthrough
│   │   ├── FinalCTA.jsx
│   │   ├── Footer.jsx
│   │   ├── PersonaSelect.jsx      # "Individual or Team?" gate before entering the demo
│   │   ├── AuthPage.jsx           # Shared login/signup page
│   │   └── Dashboard.jsx          # The actual working product (4 tabs)
│   │
│   ├── components/            # Smaller reusable pieces
│   │   ├── Button.jsx
│   │   ├── EscalationsPanel.jsx   # Escalations tab content
│   │   ├── OverviewPanel.jsx      # Overview tab content
│   │   ├── OnboardingTour.jsx     # First-visit modal walkthrough
│   │   ├── DemoCampaignPicker.jsx # One-click sample campaigns for empty state
│   │   ├── FirstTimeHint.jsx      # Small dismissible per-tab tip banner
│   │   ├── StatBlock.jsx
│   │   └── mockups/               # Illustrative UI mockups used in marketing sections
│   │
│   └── lib/                   # Data + helper functions (no UI)
│       ├── api.js             # All backend fetch calls
│       ├── constants.js       # Nav links, company name
│       ├── smoothScroll.js    # Eased scroll-to-section
│       ├── adOpsData.js
│       ├── howItWorks.js
│       ├── solutions.js
│       └── footerLinks.js
│
├── .env                       # (frontend) not currently used, reserved for future
├── .gitignore
└── package.json
```

---

## Running it locally

You need **two terminals** open at once — the backend and frontend run separately.

### 1. Backend

```powershell
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:
```
GROQ_API_KEY=your_groq_api_key_here
```

Start the server:
```powershell
uvicorn main:app --reload --port 8000
```

Backend is now running at `http://127.0.0.1:8000`.

### 2. Frontend

In a **second terminal**:
```powershell
cd AdSquadOps
npm install
npm run dev
```

Frontend is now running at `http://localhost:5173`.

> The frontend talks to `http://127.0.0.1:8000` by default in local dev (set via `VITE_API_URL`, falls back to localhost if unset).

---

## Environment variables

| Variable | Where it lives | What it's for |
|---|---|---|
| `GROQ_API_KEY` | `backend/.env` (local) / Render dashboard (production) | Powers the AI ad-copy alignment check |
| `VITE_API_URL` | Vercel dashboard (production only) | Tells the frontend where the live backend is (`https://adops.onrender.com`) |

**Never commit `.env` files** — `.gitignore` already excludes them, keep it that way.

---

## Deployment

- **Backend (Render)**: connected to this GitHub repo, root directory set to `backend`, auto-deploys on every push to `main`
- **Frontend (Vercel)**: connected to the same repo, root directory `./`, auto-deploys on every push to `main`
- CORS on the backend is locked to the production Vercel URL and localhost — no other origin can call the API

---

## Known limitations (as of now)

- **Database resets on backend redeploy.** Render's free tier uses an ephemeral filesystem — SQLite data doesn't survive a restart or redeploy. A migration to a persistent Postgres database (via Neon) is in progress but not yet complete.
- **Authentication is partially real.** Password hashing and real `/register`/`/login` endpoints exist on the backend, but the frontend may still be using the simpler local sign-in flow rather than calling them — worth confirming/finishing.
- **Daily campaign creation limit (4/day)** is enforced client-side via `localStorage`, with an admin email allowlist that bypasses it — not a real server-side rate limit.
- **Render free tier cold starts.** The backend spins down after inactivity; the first request after idle time can take 30–60 seconds.

---

## Demo passes

New visitors get **4 campaign creations per day** (tracked per browser). This resets automatically at midnight. There's also a one-click "load a sample campaign" option for anyone who doesn't want to fill in the form manually.
