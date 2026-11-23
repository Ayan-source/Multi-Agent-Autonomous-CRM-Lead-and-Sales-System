# SalesGenie AI

A university project for a multi-agent B2B sales workflow. The repository is split into two apps: an **Express + TypeScript API** in `backend/` and a **React + TypeScript + Tailwind frontend** in `frontend/`. PostgreSQL, LangChain, and LangGraph are planned.

## Requirements

- Node.js 22.12 or newer
- npm

## Install and run

Install each app from the project root. For `npm install`, enter each app folder first so npm reads that folder's manifest ([npm install](https://docs.npmjs.com/cli/install/)).

```powershell
Push-Location .\backend
npm install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
Pop-Location

Push-Location .\frontend
npm install
Pop-Location
```

Run the backend and frontend in separate terminals:

```powershell
npm run dev --prefix backend
```

```powershell
npm run dev --prefix frontend
```

Open the frontend URL printed in its terminal (normally <http://127.0.0.1:5173>). The overview checks the Express health route through the Vite proxy. The API can also be checked directly at <http://127.0.0.1:3000/health>. `.env` contains local backend settings and is ignored by Git; commit only `backend/.env.example` with placeholders.

## Check the code

```powershell
npm run check --prefix backend
npm test --prefix backend
npm run build --prefix backend
npm run build --prefix frontend
```

`backend/src/server.ts` starts Express; `backend/src/app.ts` defines its routes and error handling. `backend/src/lead-mapping.ts` converts a parsed CSV row to validated input; it does not read the CSV file. `frontend/src/` contains the React interface. More feature screens will be added alongside the backend tasks so each can be tried in the browser.

The supplied contact CSV is ignored by Git and has not been imported into the application. Its license remains unconfirmed, so development uses synthetic examples.

See [product requirements](docs/PRD.md), [architecture](docs/ARCHITECTURE.md), [roadmap](docs/ROADMAP.md), [implementation checklist](docs/TASKS.md), and [progress log](progress.md).
