# Analyst — Multi-Agent AI Investment Research Platform
A production-grade, multi-agent AI Investment Research platform. Enter a public company name and a
LangGraph-orchestrated pipeline of six specialized agents researches the company, analyzes financials and
news, assesses risk, and returns a final BUY / HOLD / PASS recommendation with a transparent confidence
score and AI reasoning.

Submitted for the InsideIIM × Altuni AI Labs — AI Product Development Engineer Internship Assignment.

## Overview

Analyst is a full-stack, multi-agent investment research platform. A user searches for any public company,
and a LangGraph-orchestrated pipeline of six specialized AI agents researches the company profile, analyzes
financials, scans recent news, assesses risk, and produces a final BUY / HOLD / PASS recommendation with a
confidence score and AI-generated reasoning. Every report is saved to the user's research history.

## Deployment

- Live Frontend: https://ai-investment-research-agent-for-in.vercel.app/
- Live Backend: https://ai-investment-research-agent-for-inside.onrender.com
- GitHub Repository: https://github.com/Anugill05/AI-Investment-Research-Agent-for-Inside-IIM
- Demo Video: https://drive.google.com/file/d/1jYeFC1HFvgJNz7n25TQJaJq7VarqzYD0/view?usp=sharing

## Features

- Authentication — register/login with JWT + bcrypt, httpOnly cookies
- Company search — research any public company by name or ticker
- Six-agent LangGraph pipeline — company research, financials, news, sentiment, decision, persistence
- Real financial data via Yahoo Finance
- Real news data via GNews API
- Market sentiment via the Fear & Greed Index
- BUY / HOLD / PASS recommendation with a numeric confidence score
- AI-generated reasoning for every recommendation
- Research history — every report saved and retrievable per user
- Resilient agents — retry-with-backoff and graceful fallback on API failure

## Tech Stack

| Layer      |  Technology                                         |   
|------------|-----------------------------------------------------|                             
| Frontend   | React (Vite), React Router, Axios, plain CSS        |
| Backend    | Node.js, Express.js, ES Modules                     |
| Database   | PostgreSQL (Neon) + Prisma ORM                      |
| AI         | LangChain.js, LangGraph.js, OpenAI API(gpt-4o-mini) |
| Auth       | JWT + bcrypt, httpOnly cookie + bearer token        |
| Deployment | Vercel (frontend), Render (backend), Neon (DB)      |

## Architecture

```
┌────────────┐   ┌───────────────────┐   ┌────────────────────┐   ┌───────────────┐
│ Supervisor │ → │ Company Research  │ → │ Financial Analysis │ → │ News Analysis │
└────────────┘   └───────────────────┘   └────────────────────┘   └───────┬───────┘
                                                                          ↓
┌────────────┐   ┌─────────────────────┐   ┌──────────────────┐   ┌───────────────┐
│    END     │ ← │ Persistence Agent   │ ← │Investment Decision ← │Risk Assessment│
└────────────┘   └─────────────────────┘   └──────────────────┘   └───────────────┘
```

Built with **LangGraph.js** (`StateGraph`, shared state, conditional edges, per-node error boundaries) and
**LangChain.js** tools backed by free APIs:

- **Yahoo Finance** (`yahoo-finance2`) — company profile & financial statements
- **GNews API** (free tier) — latest news headlines
- **Fear & Greed Index** (`alternative.me`, free, no key) — market sentiment
- **OpenAI** (`@langchain/openai`) — all narrative analysis and the final decision

Every agent reads from and writes to a single `StateGraph` annotation (company name, profile, financials,
news, sentiment, risk notes, decision, errors), so no agent needs to know the internal shape of another
agent's output beyond the shared state contract. Conditional edges let the graph route to an error-handling
node if a critical upstream step fails, instead of running the remaining agents against empty data.

LangGraph was chosen over a plain function chain because it gives shared state instead of passed
parameters, conditional routing based on state, and per-node error boundaries — one flaky API (e.g. GNews
rate-limited) degrades that node's output without crashing the whole run.

Every external call is wrapped in retry-with-backoff and graceful fallback — the pipeline never fabricates
financial data; if a source is unavailable it says so explicitly instead of guessing.

## Folder Structure

Submission layout:

```
InsideIIMProject 2/
├── frontend/
├── backend/
├── README.md
├── LLM-Chats/
│   ├── Claude-Conversation.pdf
│   ├── ChatGPT-Learning.pdf
│   └── ChatGPT-Debugging.pdf
└── screenshots/
    ├── Home.png
    ├── Report.png
    ├── History.png
    └── Architecture.png
```

`frontend/` and `backend/` structure:

```
InsideIIMProject 2/
├── backend/
│   ├── prisma/                 # schema.prisma, seed.js
│   └── src/
│       ├── config/             # env, logger
│       ├── controllers/        # auth, research, history
│       ├── routes/
│       ├── middlewares/        # auth, error, validation
│       ├── services/           # business logic (no logic in routes)
│       ├── utils/              # ApiError, ApiResponse, jwt, retry, validators
│       ├── database/           # prisma client singleton
│       └── langgraph/
│           ├── state/          # shared graph state annotation
│           ├── tools/          # company research, financial, news, sentiment, save-report
│           ├── nodes/          # one file per agent
│           ├── prompts/        # OpenAI prompt templates
│           ├── llm.js
│           └── graph.js        # StateGraph wiring
└── frontend/
    └── src/
        ├── api/                 # axios clients
        ├── context/             # AuthContext
        ├── components/          # Sidebar, ProgressTimeline, ReportViewer, ConfidenceGauge...
        ├── pages/               # Landing, Login, Register, Research, History, Report
        └── styles/              # plain CSS, one file per page/concern
```

## Installation

### 1. Database (Neon)

1. Create a free project at [neon.tech](https://neon.tech).
2. Copy the pooled connection string.

### 2. Backend

```bash
cd backend
# Fill in DATABASE_URL, JWT_SECRET, OPENAI_API_KEY, GNEWS_API_KEY in .env
npm install
npx prisma migrate dev --name init
npx prisma db seed        # optional: creates demo@analyst.ai / Demo@123
npm run dev
```

Backend runs on `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
# Fill in VITE_API_BASE_URL in .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

### Getting API keys

- **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys) — it's pay-as-you-go, not free tier.
- **GNews**: [gnews.io](https://gnews.io) — free tier (100 requests/day). If omitted, the News Analysis
  agent gracefully falls back to an empty article set instead of failing the whole pipeline.
- **Fear & Greed Index**: no key required (`api.alternative.me`).

## Environment Variables

Backend (`backend/.env`):

| Variable         | Description                               |
|------------------|-------------------------------------------|
| `DATABASE_URL`   | Neon PostgreSQL pooled connection string  |
| `JWT_SECRET`     | Secret used to sign/verify JWTs           |
| `OPENAI_API_KEY` | OpenAI API key for all agent reasoning    |
| `GNEWS_API_KEY`  | GNews API key for the News Analysis agent |
| `CLIENT_URL`     | Deployed frontend origin, used for CORS   |
| `PORT`           | Port the Express server listens on        |

Frontend (`frontend/.env`):

| Variable            | Description                          |
|---------------------|--------------------------------------|
| `VITE_API_BASE_URL` | Base URL of the deployed backend API |

## How It Works

```
Frontend (React)
       │  Axios request
       ▼
Express API Layer
       │  auth middleware → controller → service
       ▼
LangGraph Supervisor
       │  initializes shared state
       ▼
Company Research → Financial → News → Sentiment → Risk → Decision Agents
       │  each agent calls a tool (Yahoo Finance / GNews / Fear & Greed) and/or OpenAI
       ▼
OpenAI 
       │  narrative analysis + final recommendation & confidence score
       ▼
Persistence Agent → Prisma → PostgreSQL (Neon)
       │  report saved
       ▼
Frontend UI
       renders report, timeline, and confidence gauge
```

## API Endpoints

| Method | Endpoint             | Auth | Description                           |
|--------|----------------------|------|---------------------------------------|
| POST   | `/api/auth/register` | No   | Create account                        |
| POST   | `/api/auth/login`    | No   | Log in                                |
| POST   | `/api/auth/logout`   | No   | Log out                               |
| GET    | `/api/auth/profile`  | Yes  | Current user profile                  |
| POST   | `/api/research`      | Yes  | Run the multi-agent research pipeline |
| GET    | `/api/history`       | Yes  | List the current user's reports       |
| GET    | `/api/history/:id`   | Yes  | Get one full report                   |
| DELETE | `/api/history/:id`   | Yes  | Delete a report                       |

All research and history endpoints are scoped to `req.user.id` — a user can only see or delete their own
reports.

## AI Workflow

| Agent                     | Responsibility                                                                                     |
|---------------------------|----------------------------------------------------------------------------------------------------|
| Supervisor                | Initializes shared state and kicks off the graph run                                               |
| Company Research Agent    | Resolves the company, pulls profile data via Yahoo Finance                                         |
| Financial Analysis Agent  | Analyzes financial statements and key ratios, generates narrative summary via OpenAI               |
| News Analysis Agent       | Fetches recent headlines via GNews, summarizes themes and tone via OpenAI                          |
| Risk Assessment Agent     | Combines financial and news signals with Fear & Greed sentiment to flag risk factors               |
| Investment Decision Agent | Synthesizes all upstream state into a BUY / HOLD / PASS call with a confidence score and reasoning |
| Persistence Agent         | Writes the completed report to PostgreSQL via Prisma, scoped to the requesting user                |

## Design Decisions

| Decision                             | Reasoning                                                                                                        |
|--------------------------------------|------------------------------------------------------------------------------------------------------------------|
| LangGraph over simple function calls | Shared state, conditional routing, and per-node error boundaries                                                 |
| Prisma                               | Type-safe queries, migration tooling, and a schema-first workflow that keeps the DB and code in sync             |
| Neon                                 | Serverless Postgres with a generous free tier and instant branching, well suited to a project deployed on Render |
| Render (backend)                     | Simple Node deployment with free-tier web services and shell access for running migrations                       |
| Vercel (frontend)                    | Zero-config Vite deployments with fast global CDN delivery                                                       |
| OpenAI                               | pay-as-you-go, not free tier with strong reasoning quality for structured financial/news analysis                |
| PostgreSQL                           | Relational integrity for users, reports, and history — a good fit for structured research data                   |

## Trade-offs

- Free-tier APIs over paid data providers — Yahoo Finance and GNews are unofficial/free-tier sources, which
  means occasional rate limits or missing fields, traded off against zero cost.
- Sequential agent execution over parallel — agents run one after another rather than concurrently, which
  is simpler to reason about and debug but slower than a parallelized graph.
- No caching layer — every research run hits live APIs, keeping the system simple at the cost of repeated
  calls for the same company.
- Plain CSS over a component library — faster to customize for this project's scope, at the cost of some
  boilerplate compared to a design system.

## Challenges Faced

- Yahoo Finance instability — the unofficial API occasionally returns incomplete data or rate-limits;
  handled with retry-with-backoff and explicit "data unavailable" states rather than fabricated numbers.
- CORS in production — cookie-based auth across the Vercel/Render domain split required careful
  `CLIENT_URL` and `credentials: true` configuration on both ends.
- Prisma migrations against Neon — coordinating `migrate dev` locally with `migrate deploy` on Render's
  shell during first deploy.
- Environment variable management — keeping local `.env`, Render, and Vercel environment variables in sync
  without leaking secrets into the repo.
- Agent orchestration — designing a state annotation that every agent could read/write to without tightly
  coupling agents to each other's internals.
- API failures mid-pipeline — ensuring one failed external call (e.g. GNews rate limit) degrades gracefully
  instead of failing the entire research run.
- Retry handling — implementing backoff that's aggressive enough to recover from transient failures without
  noticeably slowing down a successful run.

## Example Runs

| Company          | Expected Output                                                                                               |
|------------------|---------------------------------------------------------------------------------------------------------------|
| Apple (AAPL)     | Strong financials, high news volume, typically a BUY/HOLD with high confidence                                |
| Microsoft (MSFT) | Stable fundamentals, moderate news flow, typically a BUY with high confidence                                 |
| Tesla (TSLA)     | Strong fundamentals but high volatility/news sentiment swings, often a HOLD with moderate confidence          |
| NVIDIA (NVDA)    | High growth signals, high news volume around AI demand, typically a BUY with reasoning citing sector momentum |

Each run returns the full agent trail, the final recommendation, a confidence score, and the reasoning
behind it — visible in the report view and saved to history.

### Database — Neon

Already provisioned in Installation step 1. Use the same `DATABASE_URL` in Render.

### Backend — Render

1. Push this repo to GitHub.
2. New Web Service on [render.com](https://render.com), root directory `backend`.
3. Build command: `npm install && npx prisma generate`
4. Start command: `npm start`
5. Add environment variables from `backend/.env.example` (real Neon URL, OpenAI/GNews keys, and
   `CLIENT_URL` set to the deployed Vercel URL).
6. After first deploy, run `npx prisma migrate deploy` from the Render shell to apply migrations against
   Neon.

### Frontend — Vercel

1. New Project on [vercel.com](https://vercel.com), root directory `frontend`.
2. Framework preset: Vite.
3. Environment variable: `VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api`
4. Deploy, then update the backend's `CLIENT_URL` to match the final Vercel domain and redeploy.

## Future Improvements

- Streaming agent responses to the frontend in real time
- Caching layer (Redis) for repeated company lookups
- Additional financial data providers for redundancy
- Vector database + RAG for grounding analysis in filings/reports
- PDF export of research reports
- Interactive charts for financial trends
- Watchlists and email alerts for saved companies
- Multi-model support (swap/compare OpenAI with other LLM providers)
- Parallel agent execution where dependencies allow
- Observability/tracing for pipeline runs
- Unit and integration test coverage
- Docker containerization
- CI/CD pipeline for automated deploys

## AI Usage

AI tools — Claude, ChatGPT, and Gemini — were used responsibly throughout development to:

- Learn LangChain.js and LangGraph.js concepts and APIs
- Understand `StateGraph` design patterns and shared-state architecture
- Debug integration issues (CORS, Prisma migrations, auth flows)
- Discuss architecture trade-offs before implementation
- Generate initial code scaffolding
- Refactor and clean up implementation details
- Draft and polish documentation
- Troubleshoot deployment issues on Render and Vercel

All AI-generated code and suggestions were reviewed, understood, modified, and manually integrated — no
code was copied without comprehension of what it does and why.

## LLM Conversation Logs

The `LLM-Chats/` folder in this submission contains chat transcripts documenting the development process:

| File                      | Contents                                                 |
|---------------------------|----------------------------------------------------------|
| `Claude-Conversation.pdf` | Architecture discussions and AI-assisted code generation |
| `ChatGPT-Learning.pdf`    | Learning LangChain.js / LangGraph.js concepts            |
| `ChatGPT-Debugging.pdf`   | Debugging and deployment troubleshooting sessions        |

## Screenshots

Screenshots of the running application are in `screenshots/`:

| File               | Screen                           |
|--------------------|----------------------------------|
| `Home.png`         | Landing / search screen          |
| `Report.png`       | Generated research report view   |
| `History.png`      | Research history view            |
| `Architecture.png` | Multi-agent architecture diagram |

## Assignment Checklist

- [x] React frontend
- [x] Node.js / Express backend
- [x] LangChain.js integration
- [x] LangGraph.js multi-agent orchestration
- [x] Authentication (JWT + bcrypt)
- [x] Database (PostgreSQL + Prisma)
- [x] Multi-agent AI pipeline
- [x] Deployment (Vercel + Render + Neon)
- [x] README documentation
- [x] Demo video
- [x] LLM conversation logs

## Notes

- No mock data, no placeholder logic — every endpoint is wired to a real database, a real LLM, and real
  free financial/news APIs.
- If OpenAI or GNews rate-limit or fail, the corresponding agent falls back gracefully rather than crashing
  the whole research run; failures are recorded on the `Research.status`/`errorMessage` fields.