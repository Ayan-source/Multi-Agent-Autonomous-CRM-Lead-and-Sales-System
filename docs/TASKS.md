# SalesGenie AI: implementation checklist

**Project:** A sales manager enters a business profile, reviews an AI-generated ideal customer profile (ICP), finds and qualifies leads, reviews outreach drafts, simulates replies, and sees the CRM record and dashboard update.

**Stack:** Node.js + Express + TypeScript API, PostgreSQL, React frontend (PERN). LangChain JS will handle model prompts, structured output, and retrieval tools. LangGraph JS will coordinate the multi-step workflow. Neither AI library is installed yet.

**Docker decision:** Run PostgreSQL with pgvector in Docker Compose. Run Express and React locally with npm. Docker configuration is planned in DB01; no container has been configured yet.

**Status:** `[x]` completed; `[ ]` still to do. Start with **F04**, after review of completed **F03**. The raw LeadsBlue CSV is ignored by Git and its license is unconfirmed. Use synthetic lead records until its permitted use is known.

## How to use this file

Each **ID is one review and commit checkpoint**. Complete its small checkboxes, run its acceptance check, update `progress.md`, commit that ID, and ask for review before starting the next ID. Do not mark a task complete merely because the code exists. Phase commands at the end of each phase are a final check after its IDs are complete. Commands marked **planned** need their npm scripts created in the named task; they cannot run yet.

**GitHub rule:** Commit each completed mini task locally. After its checks pass, its commit succeeds, and the user reviews it, say **"Ready to push to GitHub"**. The user pushes manually; also remind them at each completed phase. If a commit fails, report the blocker before calling it ready to push. Use `git status` and `git log -1 --oneline` to inspect the checkpoint, then `git push` on a branch with an upstream. For the first push, use `git push -u origin <branch-name>` after configuring the remote. Keep progress entries to one short result and any blocker.

Current commands (from the repository root):

```powershell
npm install
npm run dev       # Start Express on http://127.0.0.1:3000
npm test          # Build, then run tests
npm run check     # TypeScript type check
npm run build     # Compile to dist/
npm start         # Start compiled API after build
```

The `npm run dev` script uses `tsx watch`; this workspace's Node runtime currently cannot provide `os.userInfo()`, so this particular script needs checking in the user's own terminal. The build and compiled HTTP test pass here.

## Phase 0: Project and dataset audit

**Goal:** Know what was supplied and which data can be used.

### A01: Inspect the starting project [x]

- [x] Read the proposal and project instructions.
- [x] List existing files, runtime, and missing services.
- [x] Record a practical implementation order.

**Acceptance:** A short project audit identifies the current code and gaps.

### D01: Inspect the supplied dataset [x]

- [x] Record the actual CSV header, row count, missing values, and duplicate counts.
- [x] Record privacy and license limits without copying contacts into documentation.
- [x] Ignore the raw CSV in Git.

**Acceptance:** `docs/DATASET_AUDIT.md` contains the observations and the unresolved license.

### D02: Map one lead row [x]

- [x] Define `LeadInput` from the five observed fields.
- [x] Trim values, normalize email, and keep missing industry as unknown.
- [x] Return field-level errors for unusable data.
- [x] Test with synthetic valid and invalid rows.

**Acceptance:** The mapper does not invent company or domain data; its tests pass.

**Phase check (available now):**

```powershell
npm test
git check-ignore globalb2bdataset.csv
```

## Phase 1: Express foundation

**Goal:** A normal npm-based Express API starts, builds, and can be checked.

### F01: Minimal API [x]

- [x] Create `src/app.ts` and `src/server.ts`.
- [x] Add `GET /health` returning `{"status":"ok"}`.
- [x] Add an HTTP route test.

**Acceptance:** The health request returns HTTP 200 and the expected JSON.

### F02: Project documents [x]

- [x] Add product requirements, architecture, roadmap, task list, and progress log.
- [x] Link them from the README.

**Acceptance:** A new developer can find the goal, stack, tasks, and current status.

### F03: Express and TypeScript setup [x]

- [x] Add Express and TypeScript dependencies and `package-lock.json`.
- [x] Configure `tsconfig.json` and npm scripts.
- [x] Replace the temporary native HTTP server with `express()` and `app.listen()`.
- [x] Compile and run the route and mapper tests.

**Acceptance:** `npm run check`, `npm run build`, and `npm test` pass (4 tests).

### F04: Configuration validation [ ]

- [ ] Add `.env.example` with placeholder names for the first service used.
- [ ] Parse `PORT` safely and report an invalid value at startup.
- [ ] Keep actual credentials outside Git; add a focused valid/invalid config check.

**Acceptance:** Valid settings start the API; invalid settings give a clear error.

### F05: Request parsing and API errors [ ]

- [ ] Add bounded JSON body parsing and a consistent validation/error response shape.
- [ ] Handle unknown routes and unexpected errors without returning stack traces.
- [ ] Test malformed JSON, an oversized body, and an unknown route.

**Acceptance:** Invalid requests return clear 4xx responses; unexpected errors return a safe 500 response.

**Phase check (available now except F04's new test):**

```powershell
npm run check
npm test
npm run build
npm start
# In another terminal: Invoke-RestMethod http://127.0.0.1:3000/health
```

## Phase 2: PostgreSQL, leads, and authentication

**Goal:** A manager can sign in and work with stored demo leads.

**Order:** DB01 -> D03 -> D04 -> D05 -> DB02 -> AU01-AU06 -> D06-D10. Authentication is ready before lead routes are exposed; AU06 installs the guard that each lead route must use.

### DB01: Docker database [ ]

- [ ] Confirm Docker Desktop and Docker Compose are available on the user's machine.
- [ ] Add `compose.yaml` with a `db` service using an explicitly versioned pgvector/PostgreSQL image.
- [ ] Configure placeholder environment settings, a localhost database port, a named data volume, and a database health check.
- [ ] Document start, status, logs, and stop commands; stop without deleting the volume.

**Acceptance:** Container becomes healthy and a test record survives a stop/start cycle.

### D03: Connect PostgreSQL [ ]

- [ ] Install the PostgreSQL client dependency and add `DATABASE_URL` to `.env.example`.
- [ ] Create a connection pool in one backend module.
- [ ] Add a read-only `db:check` script and a clear error for a bad URL.

**Acceptance:** The check connects to a local database and rejects an invalid URL.

### D04: Create the leads table [ ]

- [ ] Add a SQL migration for ID, source key, name, email, country, industry, job title, and timestamps.
- [ ] Add a uniqueness rule based on the real source key or normalized email.
- [ ] Add a `db:migrate` script and test a duplicate insert.

**Acceptance:** Migration succeeds on an empty database and duplicate handling is clear.

### D05: Seed safe demo leads [ ]

- [ ] Make a tiny synthetic or anonymized fixture.
- [ ] Pass each row through `mapLeadRow` before writing it.
- [ ] Add `db:seed`; report inserted and rejected counts; make reruns safe.

**Acceptance:** Seeded leads can be queried and rerunning does not duplicate them.

### DB02: Database integration test setup [ ]

- [ ] Configure a separate test database and a `test:db` script.
- [ ] Apply migrations and seed synthetic fixtures in that database only.
- [ ] Test migration reruns and cleanup without touching development data.

**Acceptance:** Database tests are repeatable and cannot reset the development database.

### D06: List leads [ ]

- [ ] Add `GET /api/leads` with a small bounded `limit` and pagination cursor/offset.
- [ ] Return stable IDs and only intended public fields.
- [ ] Test empty, populated, and excessive-limit requests.

**Acceptance:** Results are paginated and the maximum page size is enforced.

### D07: Read one lead [ ]

- [ ] Add `GET /api/leads/:leadId`.
- [ ] Return 404 for an unknown ID.
- [ ] Test a known and unknown ID.

**Acceptance:** The route returns exactly one lead or 404.

### D08: Create one lead [ ]

- [ ] Add `POST /api/leads` for manual demo entry.
- [ ] Validate the body and handle duplicate email/source key.
- [ ] Test valid, invalid, and duplicate requests.

**Acceptance:** Valid input persists; invalid input returns 400.

### D09: Edit one lead [ ]

- [ ] Add `PATCH /api/leads/:leadId` for approved editable fields.
- [ ] Validate changes and update `updated_at`.
- [ ] Test saved changes, invalid input, and an unknown ID.

**Acceptance:** Allowed edits persist and other fields cannot be changed.

### D10: Record a CRM activity [ ]

- [ ] Migrate an `activities` table with lead ID, type, details, time, and idempotency key.
- [ ] Add one write function for later agents and routes.
- [ ] Test repeating the same action.

**Acceptance:** A retry creates one activity row.

### AU01: User and session tables [ ]

- [ ] Migrate `users` and `sessions` tables.
- [ ] Store password hashes and session token hashes, never plaintext values.
- [ ] Test create, lookup, expiration, and deletion at the repository layer.

**Acceptance:** Expired and deleted sessions cannot identify a user.

### AU02: Seed one manager [ ]

- [ ] Add `auth:seed` reading the initial password from an environment variable.
- [ ] Hash the password and insert one manager email.
- [ ] Make reruns safe and keep the password out of logs/Git.

**Acceptance:** One manager exists after repeated seed runs.

### AU03: Login [ ]

- [ ] Add `POST /api/auth/login` accepting email and password.
- [ ] Verify the hash and create a server-side session.
- [ ] Set an HTTP-only session cookie; return a generic error for invalid credentials.
- [ ] Test success, wrong password, missing fields, and cookie properties.

**Acceptance:** Correct credentials produce a usable session; other requests do not.

### AU04: Current session [ ]

- [ ] Add `GET /api/auth/me`.
- [ ] Look up the session from the cookie and return safe manager fields.
- [ ] Test valid, missing, expired, and deleted sessions.

**Acceptance:** Invalid sessions return 401.

### AU05: Logout [ ]

- [ ] Add `POST /api/auth/logout`.
- [ ] Delete the server-side session and clear the cookie.
- [ ] Test that the old cookie fails on `/api/auth/me`.

**Acceptance:** Logout immediately revokes access.

### AU06: Protect CRM routes [ ]

- [ ] Add an Express session middleware for `/api/leads` and future CRM routes.
- [ ] Keep `/health` public; register the guard before adding D06-D10 routes.
- [ ] Add login attempt limiting and cookie settings for local versus hosted use; validate request origin for cookie-authenticated writes.
- [ ] Test anonymous and authenticated calls.

**Acceptance:** Anonymous CRM requests return 401.

**Phase check (scripts added by D03-D05 and AU02):**

```powershell
docker compose up -d db  # planned in DB01
docker compose ps
npm run db:check       # planned in D03
npm run db:migrate     # planned in D04
npm run db:seed        # planned in D05
npm run auth:seed      # planned in AU02
npm run test:db        # planned in DB02
npm run check
npm test
npm run build
# Manually: login -> /api/auth/me -> list a lead -> logout -> /api/auth/me returns 401
# When finished: docker compose stop db (keeps the data volume)
```

## Phase 3: Business profile, LangChain, and ICP

**Goal:** Turn a manager's business description into a validated ICP.

### I01: Validate business profiles [ ]

- [ ] Define description, target industries, regions, company size, and notes.
- [ ] Reject empty/invalid fields with field-specific errors.
- [ ] Test valid and incomplete examples.

**Acceptance:** Invalid profiles cannot enter the database.

### I02: Save and read profiles [ ]

- [ ] Migrate `business_profiles` with owner ID and timestamps.
- [ ] Add `POST /api/business-profiles` and `GET /api/business-profiles/:profileId`.
- [ ] Test owner access, validation, and unknown ID.

**Acceptance:** A signed-in manager can revisit a saved profile.

### I03: LangChain model adapter [ ]

- [ ] Install LangChain JS and the chosen provider adapter; document required environment variables.
- [ ] Create one model-calling function behind an interface.
- [ ] Inject a fake model for tests; do not call a paid API during tests.
- [ ] Set timeout and a bounded output size.

**Acceptance:** A fixed fake response can be returned without provider credentials.

### I04: ICP prompt [ ]

- [ ] Build a prompt from a validated profile.
- [ ] Ask for target industries, regions, size, job roles, rationale, and unknowns.
- [ ] Instruct the model to use supplied facts and mark uncertainty.
- [ ] Test that the prompt contains profile facts and no secrets.

**Acceptance:** The prompt does not invent company facts before the model is called.

### I05: Structured ICP output [ ]

- [ ] Define and validate the model's JSON output schema.
- [ ] Reject malformed output and unsupported traits.
- [ ] Save the prompt/model version with each result.

**Acceptance:** Bad model output cannot enter CRM state.

### I06: Generate and manage ICP versions [ ]

- [ ] Migrate `icps` linked to a profile.
- [ ] Add `POST /api/business-profiles/:profileId/icps` using I03-I05.
- [ ] Add `GET /api/business-profiles/:profileId/icps` and a selection action.
- [ ] Define the selection route as `PATCH /api/business-profiles/:profileId/selected-icp` with an `icpId`; verify that the ICP belongs to that profile.
- [ ] Test version order, selected version, and model failure.

**Acceptance:** Downstream matching uses the selected validated version.

**Phase check:**

```powershell
npm run db:migrate
npm run check
npm test
npm run build
# Manually: login -> create profile -> generate ICP with configured model -> read/select ICP
```

## Phase 4: Lead discovery and qualification

**Goal:** Show candidate leads with explainable fit scores and uncertainty.

### L01: Match leads to ICP [ ]

- [ ] Compare only fields actually present in the stored lead and ICP.
- [ ] Return matched and excluded IDs with reasons.
- [ ] Test missing industry and region mismatches.

**Acceptance:** A lead with unknown data is not treated as a confirmed match.

### L02: Candidate route [ ]

- [ ] Add `GET /api/icps/:icpId/candidates` with a limit.
- [ ] Return lead IDs, evidence, and exclusion reasons where useful.
- [ ] Test unknown ICP and bounded results.

**Acceptance:** Manager can inspect why a lead was suggested.

### L03: Rule score and category [ ]

- [ ] Define score factors and weights separately from prompts.
- [ ] Convert score to High, Medium, or Low Fit; mark borderline results.
- [ ] Test each factor, missing data, and exact threshold boundaries.

**Acceptance:** The same inputs always give the same score and factors.

### L04: Optional LangChain explanation [ ]

- [ ] Give the model only known evidence for an uncertain score.
- [ ] Validate its explanation and reject invented lead facts.
- [ ] Keep the rule score authoritative.

**Acceptance:** Model failure cannot silently change the numeric score.

### L05: Save qualification and review item [ ]

- [ ] Migrate qualifications and review items.
- [ ] Add `POST /api/leads/:leadId/qualifications` with ICP ID.
- [ ] Save score, category, factors, source run, and uncertain status.
- [ ] Test retry deduplication and review gating.

**Acceptance:** Borderline leads cannot proceed to outreach until reviewed.

### L06: Review uncertain leads [ ]

- [ ] Add authenticated `GET /api/review-items` and `PATCH /api/review-items/:reviewId` for approve/reject with a reason.
- [ ] Store reviewer, decision time, and qualification reference; reject invalid or conflicting decisions.
- [ ] Test that rejection blocks outreach and approval permits the next step once.

**Acceptance:** A manager can resolve an uncertain lead through the API with a traceable decision.

**Phase check:**

```powershell
npm run db:migrate
npm run check
npm test
npm run build
# Manually: selected ICP -> candidate route -> qualification -> inspect review item
```

## Phase 5: Knowledge retrieval (RAG)

**Goal:** Give outreach drafting source-backed product information.

### R01: Add authorized knowledge documents [ ]

- [ ] Add small demo product facts or guidelines with source names.
- [ ] Exclude raw contact lists and private secrets.
- [ ] Record document version and location.

**Acceptance:** Every fact used for drafting can be traced to a source.

### R02: Split and store chunks [ ]

- [ ] Make deterministic chunk IDs, text, document ID, and location.
- [ ] Migrate document and chunk tables.
- [ ] Test that chunk text maps back to its document.

**Acceptance:** Re-ingestion does not create duplicate chunks.

### R03: pgvector and embeddings [ ]

- [ ] Enable pgvector in the chosen PostgreSQL environment.
- [ ] Add an embeddings table and a LangChain-compatible embedding adapter.
- [ ] Add `knowledge:ingest` using fake embeddings in tests.
- [ ] Test dimension errors and retry-safe ingestion.

**Acceptance:** The same document can be ingested twice without duplicates.

### R04: Retrieval tool [ ]

- [ ] Implement `retrieveKnowledge(question, limit)` against vector search.
- [ ] Return text, source ID, location, and similarity score.
- [ ] Test relevant, unrelated, and no-match fixtures.

**Acceptance:** A relevant chunk ranks above an unrelated chunk.

### R05: Grounding check [ ]

- [ ] Supply retrieved passages and source IDs to the draft prompt.
- [ ] Flag claims with no supporting passage.
- [ ] Test an invented product claim.

**Acceptance:** Unsupported claims are held for review, not treated as facts.

**Phase check (ingest script planned in R03):**

```powershell
npm run db:migrate
npm run knowledge:ingest
npm run check
npm test
npm run build
```

## Phase 6: LangGraph workflow and tools

**Goal:** Coordinate tested services in one resumable sales run.

### G01: Shared graph state [ ]

- [ ] Install LangGraph JS and define typed state for profile, ICP, leads, scores, reviews, drafts, replies, and errors.
- [ ] Keep IDs and compact facts in state; durable CRM records stay in PostgreSQL.
- [ ] Test valid initial and updated state.

**Acceptance:** Every node receives only the fields it needs and returns a valid update.

### G02: ICP and lead-finding nodes [ ]

- [ ] Wrap the tested ICP service in an `icp` node.
- [ ] Wrap candidate search in a `find_leads` node.
- [ ] Test their state updates with fake services.

**Acceptance:** Fixed input produces an ICP ID and candidate lead IDs.

### G03: Qualification node and branches [ ]

- [ ] Wrap rule scoring in a `qualify` node.
- [ ] Add conditional edges: high fit -> draft ready; low fit -> finish; uncertain -> review.
- [ ] Test all three paths.

**Acceptance:** Uncertain leads never bypass review.

### G04: Agent tools [ ]

- [ ] Expose validated `findLeads`, `scoreLead`, `retrieveKnowledge`, and `saveCrmActivity` tools.
- [ ] Give each tool a small input/output schema.
- [ ] Test malformed inputs, normal outputs, and repeated CRM writes.

**Acceptance:** The model cannot invoke an unvalidated database action.

### G05: Failure and pause/resume [ ]

- [ ] Bound model/tool timeouts and retries.
- [ ] Add per-run limits for graph steps, processed leads, and model calls; stop with a visible reason when exceeded.
- [ ] Persist graph checkpoints before human review.
- [ ] Resume once after a decision; test a process restart and duplicate retry.

**Acceptance:** A resumed run does not repeat a CRM activity.

### G06: Workflow API [ ]

- [ ] Add `POST /api/workflows` returning a run ID.
- [ ] Add `GET /api/workflows/:runId` returning stage, status, and safe event history.
- [ ] Test invalid input, progress, failure, and unknown ID.

**Acceptance:** Manager can see where a run stopped and why.

### G07: Resume route and run execution [ ]

- [ ] Add `POST /api/workflows/:runId/resume` referencing a stored review decision.
- [ ] Execute runs outside the HTTP response lifecycle and persist run status and errors.
- [ ] Test invalid decision/run combinations, repeated resume, and restart recovery.

**Acceptance:** Start returns promptly; an approved paused run resumes once after restart.

**Phase check:**

```powershell
npm run db:migrate
npm run check
npm test
npm run build
# Manually: start workflow -> inspect run -> review uncertain lead -> inspect resumed run
```

## Phase 7: Outreach drafts and simulated replies

**Goal:** Review a sourced draft, simulate contact, and enforce opt-outs.

### O01: Generate a draft [ ]

- [ ] Build a LangChain prompt from approved lead facts, ICP, and retrieved knowledge.
- [ ] Validate subject, body, tone, and source references.
- [ ] Reject unsupported claims and save as `pending_review`.

**Acceptance:** No draft automatically sends a message.

### O02: Draft API and review [ ]

- [ ] Add `POST /api/leads/:leadId/outreach-drafts`.
- [ ] Add `GET /api/leads/:leadId/outreach-drafts` and `GET /api/outreach-drafts/:draftId`.
- [ ] Add `PATCH /api/outreach-drafts/:draftId/review` for approve/reject.
- [ ] Test authentication, unknown IDs, and repeated decisions.

**Acceptance:** Only an authenticated reviewer can approve a draft.

### O03: Simulate contact [ ]

- [ ] Add authenticated `POST /api/outreach-drafts/:draftId/simulate`.
- [ ] Record an approved draft as a simulated CRM contact activity.
- [ ] Block unapproved drafts and suppressed leads.
- [ ] Test that no email or SMS provider is called.

**Acceptance:** The activity clearly says `simulated`.

### O04: Submit and classify replies [ ]

- [ ] Add `POST /api/leads/:leadId/responses` for a simulated reply.
- [ ] Classify Interested, Not Interested, Follow-up Required, Unsubscribe, or review needed.
- [ ] Test clear and ambiguous replies.

**Acceptance:** The reply remains attached to the correct lead and activity.

### O05: Suppress and follow up [ ]

- [ ] Store opt-out records before any later outreach decision.
- [ ] Block drafting and simulated contact for suppressed leads across runs.
- [ ] Create a human review item for eligible follow-up; never send automatically.

**Acceptance:** An Unsubscribe reply prevents future outreach actions.

### O06: Connect outreach to LangGraph [ ]

- [ ] Add an OutreachAgent node that calls the draft service when a qualified lead reaches `draft_ready`.
- [ ] Pause for draft approval and resume to the simulated-contact service.
- [ ] Test approval, rejection, and suppression branches with fake models.

**Acceptance:** A workflow reaches an approved simulated contact without bypassing review.

### O07: Connect response handling to LangGraph [ ]

- [ ] Add a ResponseAgent node that classifies the submitted simulated reply.
- [ ] Route interested, uninterested, follow-up, opt-out, and uncertain responses explicitly.
- [ ] Test each branch and record its outcome in graph state.

**Acceptance:** Submitted replies move the corresponding run to the correct next stage.

### O08: CRM update node [ ]

- [ ] Add a CRMUpdateAgent node using validated, idempotent activity services.
- [ ] Persist lead stage and an opportunity record for an interested response; store suppression before any further outreach.
- [ ] Test retries and confirm the timeline/dashboard inputs match persisted outcomes.

**Acceptance:** A complete multi-agent run updates CRM once per action.

**Phase check:**

```powershell
npm run db:migrate
npm run check
npm test
npm run build
# Manually: generate -> review -> simulate -> submit Unsubscribe -> verify new draft blocked
```

## Phase 8: React dashboard and CRM views

**Goal:** A manager can complete and inspect the demo flow in a browser.

### C01: CRM timeline and summary API [ ]

- [ ] Add `GET /api/leads/:leadId/activities` in time order.
- [ ] Add `GET /api/dashboard/summary` for leads, qualified, contacted, replies, opportunities, and review queue.
- [ ] Test counts against seeded records and simulated activity labels.

**Acceptance:** API counts match stored CRM events.

### C02: React client setup [ ]

- [ ] Create a `client/` React + TypeScript app with its own `package.json`.
- [ ] Add routing, API client, shared layout, and development proxy/CORS plan.
- [ ] Show loading, empty, and error states.

**Acceptance:** Client starts locally and reaches the Express health route.

### C03: Login, session, and logout UI [ ]

- [ ] Build a login form calling `POST /api/auth/login`.
- [ ] Restore login with `GET /api/auth/me` on refresh.
- [ ] Add logout calling `POST /api/auth/logout` and clear client state.
- [ ] Protect browser routes while relying on server authorization for data.

**Acceptance:** Refresh keeps a valid session; logout returns to login.

### C04: Profile and ICP UI [ ]

- [ ] Build a profile form and validation messages.
- [ ] Show generated ICP versions, unknowns, and selected version.
- [ ] Let the manager select an ICP.

**Acceptance:** Saved profile and ICP can be revisited after refresh.

### C05: Lead and review UI [ ]

- [ ] Show lead table, filters, fit score, factors, and lead detail.
- [ ] Show timeline, uncertain lead queue, and draft approve/reject actions.
- [ ] Refresh the correct item after a review decision.

**Acceptance:** Reviewer can understand why each lead or draft needs attention.

### C06: Dashboard and workflow UI [ ]

- [ ] Show funnel counts, simulated labels, current workflow stage, and errors.
- [ ] Link each summary item to the matching run, lead, or review item.
- [ ] Test browser flow with a seeded demo.

**Acceptance:** One demo run is understandable without database access.

**Phase check (client scripts created in C02):**

```powershell
npm run check
npm test
npm run build
npm install --prefix client
npm run build --prefix client
# In separate terminals: npm run dev ; npm run dev --prefix client
# Manually: login -> profile -> ICP -> leads -> draft review -> dashboard -> logout
```

## Phase 9: Evaluation, security, and final demo

**Goal:** A repeatable demo and honest report of quality, cost, and limitations.

### E01: Label and measure lead fit [ ]

- [ ] Label a small synthetic or permitted lead sample; separate development and test labels.
- [ ] Add an `eval:leads` script calculating precision, recall, F1, and accuracy.
- [ ] Compare rule-only and full flow on the same held-out set.

**Acceptance:** The report includes sample counts behind each metric.

### E02: Evaluate drafts and failures [ ]

- [ ] Score relevance, personalization, source support, tone, and call to action with a human rubric.
- [ ] Exercise bad model output, missing fields, database failure, retry, ambiguous reply, and unsubscribe.
- [ ] Record duration, model calls, estimated cost, and failures.

**Acceptance:** Observed results and simulated conversion outcomes are clearly labeled.

### E03: Security and privacy review [ ]

- [ ] Verify protected routes, session expiry, validation, secret handling, and safe logs.
- [ ] Check raw dataset handling and permitted use before any import.
- [ ] Fix issues or document a concrete limitation.

**Acceptance:** Sensitive endpoints and personal data have an explicit review result.

### E04: GitHub automated checks [ ]

- [ ] Add a GitHub Actions workflow for lockfile-based installation, type checking, tests, and build.
- [ ] Run database integration checks against an isolated pgvector database service.
- [ ] Add the client build once the React app exists; keep model credentials out of test jobs.

**Acceptance:** A pushed commit shows passing automated checks without paid model access.

### P01: Repeatable demo seed [ ]

- [ ] Add `demo:seed` for one business, knowledge documents, and safe leads.
- [ ] Make reset/reseed deterministic without importing unlicensed contacts.
- [ ] Record the demo account setup steps without storing the password.

**Acceptance:** Two fresh setups produce the same starting state.

### P02: End-to-end rehearsal [ ]

- [ ] Login, enter profile, generate/select ICP, find and score leads.
- [ ] Review uncertain lead and outreach draft, simulate reply, inspect CRM/dashboard.
- [ ] Record exact steps and observed output in the final report.

**Acceptance:** A course evaluator can repeat the flow with the README.

### P03: Final report and deployment decision [ ]

- [ ] Write evaluation method, measured results, baseline, cost, and limits.
- [ ] Decide whether the course needs hosting or a local demo.
- [ ] Verify and document the chosen setup.

**Acceptance:** Every reported number has a source or is marked simulated.

**Phase check (scripts created in E01 and P01):**

```powershell
npm run check
npm test
npm run build
npm run build --prefix client
npm run eval:leads
npm run demo:seed
# Manually repeat the full flow in P02 and compare results with the report
```

## Definition of done for every task

- [ ] Its listed checkboxes and acceptance check are satisfied.
- [ ] Relevant tests and type/build checks pass; record exact commands in `progress.md`.
- [ ] Documentation and task status match the code that exists.
- [ ] Commit only that task's files using its ID in the message.
- [ ] Stop and ask the user to review before the next task.
