# SalesGenie AI

This is the beginning of a university project for a multi-agent B2B sales workflow. The current implementation is only a small TypeScript API foundation. It uses Node's built-in HTTP server and test runner so it works without downloaded packages.

## Requirements

- Node.js 22 or newer
- npm

## Run locally

```powershell
npm run dev
```

Open <http://127.0.0.1:3000/health>. The expected response is `{"status":"ok"}`. Set `PORT` to use another local port.

## Check the code

```powershell
npm test
npm run check
```

`npm test` calls the health endpoint on a temporary local port. `npm run check` checks syntax. Node 22 strips TypeScript syntax at runtime; static type checking and a compiled build are not configured yet.

The pure `mapLeadRow` function in `src/lead-mapping.ts` converts the five observed CSV columns to a validated lead input. Its tests use synthetic rows; the supplied contact CSV is ignored by Git and is not imported into the application.

The project proposal and working instructions are in the root documents. See [product requirements](docs/PRD.md), [architecture](docs/ARCHITECTURE.md), [roadmap](docs/ROADMAP.md), [small task plan](docs/TASKS.md), and [progress log](progress.md). Later tasks will add the CRM database, AI workflow, and dashboard one small step at a time.
