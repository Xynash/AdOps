<div align="center">

# AdSquadOps

**Catch broken campaigns before they go live.**

A small QA and SLA console for ad operations teams.

**Live demo:** [adsquadops.vercel.app](https://adsquadops.vercel.app)

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logoColor=white)](https://groq.com)

</div>

---

## What is this?

Ad campaigns usually break in boring ways: a dead link, a missing tracking tag, or ad copy that promises something the page doesn't. Ad ops teams often catch these by hand, in spreadsheets and Slack threads.

AdSquadOps puts it all in one place: **check the campaign, track the support ticket, log the handoff.**

---

## What it does

| Feature | In plain words |
|---|---|
| **Campaign QA** | Create a campaign and hit Validate. Three checks run: is the URL reachable, is the tracking tag a valid UTM, and does the ad copy fit the destination (AI). |
| **SLA Tickets** | Open a ticket against a campaign. High priority gets a 2h clock, standard gets 4h, with a live countdown. |
| **Escalation Log** | Hand a ticket to another team. Every step is timestamped: Reported, then In progress, then Fixed. |
| **Overview** | Campaigns, QA pass rate, average SLA response, open tickets, open escalations, all in one view. |

---

## How a campaign flows

```
  Create campaign ──► Validate ──► Passed or Flagged
                         │
                         ├─ 1. Is the URL reachable?
                         ├─ 2. Is the tracking tag a valid UTM?
                         └─ 3. Does the ad copy fit the page? (AI)

  Something wrong? ──► Open a ticket (2h or 4h SLA clock)
                          └─► Escalate to another team
                              Reported ──► In progress ──► Fixed
```

---

## How it's built

```
  Browser ──► React app (Vercel) ──► FastAPI (Render) ──► SQLite
                                          │
                                          ├──► the campaign's URL (public sites only)
                                          └──► Groq (AI ad-copy check)
```

A few decisions worth knowing:

- **URL check is guarded.** The backend only fetches public `http(s)` URLs. Private, loopback and cloud-metadata addresses are blocked, and redirects are re-checked at every hop. Without this, anyone could make the server call its own internal network.
- **Escalations follow an order.** The backend only accepts `reported → in_progress → fixed`. Skipping or going backwards returns a `400`.
- **The AI check never blocks.** If Groq fails or returns nothing, that check is marked as skipped and the other two still run.

---

## Tech stack

| Part | Tools |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 4, lucide-react |
| Backend | FastAPI, Python `sqlite3`, `requests` |
| AI check | Groq (`openai/gpt-oss-120b`) |
| Hosting | Vercel (frontend), Render (backend) |

---

## Project structure

```
AdSquadOps/
├── backend/
│   ├── main.py            # FastAPI app, all routes
│   ├── database.py        # SQLite connection and tables
│   ├── qa_engine.py       # The 3 QA checks and the URL guard
│   ├── auth.py            # Password hashing (used by /register and /login)
│   └── requirements.txt
│
├── src/
│   ├── App.jsx            # Switches between landing, auth, persona and dashboard
│   ├── sections/          # Landing page sections, Dashboard.jsx (the working product)
│   ├── components/        # Reusable pieces: panels, onboarding tour, mockups
│   └── lib/               # api.js (all backend calls), constants, page data
│
├── vercel.json            # Makes direct URLs like /dashboard load the app
└── package.json
```

---

## API

| Method | Route | What it does |
|---|---|---|
| POST | `/campaigns` | Create a campaign |
| GET | `/campaigns` | List campaigns |
| POST | `/campaigns/{id}/validate` | Run the 3 QA checks |
| POST | `/tickets` | Open a ticket (`high` or `standard`) |
| GET | `/tickets` | List tickets |
| POST | `/tickets/{id}/resolve` | Resolve a ticket |
| POST | `/escalations` | Escalate a ticket to a team |
| GET | `/escalations` | List escalations with their timeline |
| POST | `/escalations/{id}/advance` | Move to the next stage |
| GET | `/overview` | Dashboard numbers |
| POST | `/register`, `/login` | Account endpoints (not wired to the UI yet, see limitations) |

When the backend is running locally, interactive docs are at `http://127.0.0.1:8000/docs`.

---

## Run it yourself

You need Node.js, Python 3, and a [Groq API key](https://console.groq.com).

**1. Backend**

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:

```
GROQ_API_KEY=your_key_here
```

Start it:

```bash
uvicorn main:app --reload --port 8000
```

**2. Frontend** (in a second terminal, from the project root)

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

The frontend talks to `http://127.0.0.1:8000` by default. Set `VITE_API_URL` to point it somewhere else.

### Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `GROQ_API_KEY` | `backend/.env` locally, Render dashboard in production | AI ad-copy check |
| `VITE_API_URL` | Vercel dashboard (production) | URL of the live backend |

Never commit `.env` files. `.gitignore` already excludes them.

---

## Try the demo

Open the dashboard and load one of the three sample campaigns. They all point at this site on purpose, so you can see both sides of QA:

| Sample | Expected result |
|---|---|
| AdSquadOps Launch | All three checks pass |
| Broken Tracking Tag | Fails on the tracking tag |
| Mismatched Ad Copy | The AI check should flag the copy |

---

## Deployment

- **Frontend (Vercel):** connected to this repo and redeploys automatically when `main` changes.
- **Backend (Render):** root directory is `backend`, start command is `uvicorn main:app --host 0.0.0.0 --port $PORT`. Auto-deploy is off, so new backend code goes live from the Render dashboard (Manual Deploy).
- CORS only allows the production Vercel URL and `localhost:5173`.

---

## Known limitations

Being upfront about what is and isn't real yet:

- **Data resets on backend redeploy.** SQLite lives on Render's free-tier disk, which isn't persistent.
- **Login is a demo.** `/register` and `/login` exist on the backend with hashed passwords, but the sign-in pages don't call them yet. The signed-in user is only stored in the browser.
- **The daily limit is client-side.** New visitors get 4 campaign creations per day, tracked in `localStorage`. It is not a server-side rate limit.
- **The AI check is shallow.** It sees the ad copy and the URL text, not the actual page content.
- **Cold starts.** Render's free tier sleeps when idle, so the first request can take 30 to 60 seconds.

---

## What's next

- A persistent database (Postgres)
- Real authentication wired to the frontend
- Server-side rate limiting
- Tests for the QA checks and the URL guard

---

<div align="center">

*Built by **Ansh Sharma***

</div>
