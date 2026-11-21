# SalesGenie AI

This is the beginning of a university project for a multi-agent B2B sales workflow. The current implementation is a small **Express + TypeScript** API. PostgreSQL and React are planned, so this is the backend foundation for a PERN-style application.

## Requirements

- Node.js 22 or newer
- npm

## Run locally

```powershell
npm install
npm run dev
```

`npm install` creates `node_modules` and installs Express, TypeScript, and the development tools listed in `package.json`. `npm run dev` starts the Express server and restarts it when source files change. Open <http://127.0.0.1:3000/health>; the expected response is `{"status":"ok"}`. Set `PORT` to use another local port.

`src/server.ts` starts the server. `src/app.ts` defines the Express app and its routes. `src/lead-mapping.ts` is an ordinary helper that validates a lead row; it is not an AI agent.

## Check the code

```powershell
npm test
npm run check
npm run build
npm start
```

`npm test` compiles the project and runs the route and mapping tests with Node's test runner. `npm run check` checks TypeScript types. `npm run build` compiles TypeScript to `dist/`; `npm start` runs that compiled server. Stop it with Ctrl+C.

The pure `mapLeadRow` function in `src/lead-mapping.ts` converts the five observed CSV columns to a validated lead input. Its tests use synthetic rows; the supplied contact CSV is ignored by Git and is not imported into the application.

The project proposal and working instructions are in the root documents. See [product requirements](docs/PRD.md), [architecture](docs/ARCHITECTURE.md), [roadmap](docs/ROADMAP.md), [small task plan](docs/TASKS.md), and [progress log](progress.md). Later tasks will add the CRM database, AI workflow, and dashboard one small step at a time.
