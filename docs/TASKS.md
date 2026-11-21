# SalesGenie AI: implementation checklist

**Project:** A sales manager enters a business profile, reviews an AI-generated ideal customer profile (ICP), finds and qualifies leads, reviews outreach drafts, simulates replies, and sees the CRM record and dashboard update.

**Stack:** Node.js + Express + TypeScript API, PostgreSQL, React frontend (PERN). LangChain JS will handle model prompts, structured output, and retrieval tools. LangGraph JS will coordinate the multi-step workflow. Neither AI library is installed yet.

**Docker decision:** Run PostgreSQL with pgvector in Docker Compose. Run Express and React locally with npm. Docker configuration is planned in DB01; no container has been configured yet.

**Status:** `[x]` completed; `[ ]` still to do. Start with **F04**, after review of completed **F03**. The raw LeadsBlue CSV is ignored by Git and its license is unconfirmed. Use synthetic lead records until its permitted use is known.


**Frontend rule:** Build each screen alongside its backend feature. Each UI task below is a separate commit/review checkpoint. Follow the explicit order in each phase, and stop at **Your browser test** for the user's review. Backend-only tasks use automated/API checks; their dependent UI task is the browser checkpoint.

**Visual direction:** A compact CRM workspace with warm neutral backgrounds, dark readable text, one deep teal accent, clear typography, subtle borders, and generous spacing. Use practical tables, focused forms, and a simple sidebar. Keep login uncluttered. Avoid decorative gradients, glass effects, oversized cards, and invented analytics. Forms need labels, keyboard focus, responsive layouts, and useful loading/error/empty states. Establish these choices in C02 and reuse them throughout.

**Browser commands (planned in C02):** Run `npm run dev` in the root and `npm run dev --prefix client` in another terminal. Open the client URL printed by its terminal. Use `npm run build --prefix client` to check each frontend task before review. Database-backed screens also need `docker compose up -d db`. Each phase below includes the shared commands and its manual test sequence.

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

### C02: React client and visual foundation [ ]

- [ ] Create a `client/` React + TypeScript app with its own npm scripts.
- [ ] Add routing, a shared API client, and a development proxy forwarding `/api` and `/health` to Express with session cookies.
- [ ] Define the typography, color, spacing, button, input, and layout styles from the visual direction.
- [ ] Show a simple API connection status using the real health route.

**Acceptance:** Client builds and connects to Express through the development proxy.

**Your browser test:** Open the client, confirm the API status, resize to a phone width, and tab through the controls. Stop Express and confirm a useful connection error appears. Review the visual style before more screens are added.

**Phase check (client commands become available in C02):**

```powershell
npm run check
npm test
npm run build
npm run build --prefix client
# In separate terminals: npm run dev ; npm run dev --prefix client
# Browser: check API status, disconnected state, keyboard focus, and mobile layout
```

## Phase 2: PostgreSQL, leads, and authentication

**Goal:** A manager can sign in and work with stored demo leads.

**Order:** DB01 -> D03-D05 -> DB02 -> AU01-AU03 -> UI01 -> AU04 -> UI02 -> AU05 -> UI03 -> AU06 -> D06 -> UI04 -> D07 -> UI05 -> D08 -> UI06 -> D09 -> UI07 -> D10. Use this order rather than task numbering. Each UI task immediately exercises the preceding route; AU06 protects all lead routes before they are added.

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

### UI01: Login screen [ ]

- [ ] Build `/login` with labeled email/password fields and a single sign-in action.
- [ ] Connect to the login route; show validation, submitting, and invalid-credential states.
- [ ] Show a minimal signed-in landing screen after success.

**Acceptance / Your browser test:** Try empty fields, wrong password, and correct credentials. Errors must be readable; success opens the signed-in screen. Refresh/session behavior follows in UI02.


### AU04: Current session [ ]

- [ ] Add `GET /api/auth/me`.
- [ ] Look up the session from the cookie and return safe manager fields.
- [ ] Test valid, missing, expired, and deleted sessions.

**Acceptance:** Invalid sessions return 401.

### UI02: Restore and protect browser sessions [ ]

- [ ] Call `/api/auth/me` on app load and show a short session-loading state.
- [ ] Add the protected workspace layout and redirect expired sessions to login.

**Acceptance / Your browser test:** Log in and refresh: stay signed in. Open a protected URL in a private window: return to login without showing CRM data.


### AU05: Logout [ ]

- [ ] Add `POST /api/auth/logout`.
- [ ] Delete the server-side session and clear the cookie.
- [ ] Test that the old cookie fails on `/api/auth/me`.

**Acceptance:** Logout immediately revokes access.

### UI03: Logout control [ ]

- [ ] Add logout to the workspace navigation.
- [ ] Call the logout route, clear user/cached CRM state, and return to login.

**Acceptance / Your browser test:** Log out, refresh, and use browser Back. Protected data must remain inaccessible; signing in again must work.


### AU06: Protect CRM routes [ ]

- [ ] Add an Express session middleware for `/api/leads` and future CRM routes.
- [ ] Keep `/health` public; register the guard before adding D06-D10 routes.
- [ ] Add login attempt limiting and cookie settings for local versus hosted use; validate request origin for cookie-authenticated writes.
- [ ] Test anonymous and authenticated calls.

**Acceptance:** Anonymous CRM requests return 401.

### D06: List leads [ ]

- [ ] Add `GET /api/leads` with a small bounded `limit` and pagination cursor/offset.
- [ ] Return stable IDs and only intended public fields.
- [ ] Test empty, populated, and excessive-limit requests.

**Acceptance:** Results are paginated and the maximum page size is enforced.

### UI04: Lead list [ ]

- [ ] Build `/leads` with a compact table using the list route and pagination.
- [ ] Show loading, empty, and failed-request states without fake records.

**Acceptance / Your browser test:** Sign in and open Leads. Confirm seeded records and page limits; verify an empty database shows an empty state.


### D07: Read one lead [ ]

- [ ] Add `GET /api/leads/:leadId`.
- [ ] Return 404 for an unknown ID.
- [ ] Test a known and unknown ID.

**Acceptance:** The route returns exactly one lead or 404.

### UI05: Lead details [ ]

- [ ] Link each lead row to `/leads/:leadId`.
- [ ] Show known fields and mark missing industry as unknown; handle 404.

**Acceptance / Your browser test:** Open a lead and compare it with the list. Open an unknown ID and confirm a useful missing-lead message.


### D08: Create one lead [ ]

- [ ] Add `POST /api/leads` for manual demo entry.
- [ ] Validate the body and handle duplicate email/source key.
- [ ] Test valid, invalid, and duplicate requests.

**Acceptance:** Valid input persists; invalid input returns 400.

### UI06: Create lead form [ ]

- [ ] Add a New lead form using the create route.
- [ ] Show field errors and duplicate handling; return to the saved record on success.

**Acceptance / Your browser test:** Create a synthetic lead, try an invalid email, then repeat the same email. Confirm only one valid record is stored.


### D09: Edit one lead [ ]

- [ ] Add `PATCH /api/leads/:leadId` for approved editable fields.
- [ ] Validate changes and update `updated_at`.
- [ ] Test saved changes, invalid input, and an unknown ID.

**Acceptance:** Allowed edits persist and other fields cannot be changed.

### UI07: Edit lead form [ ]

- [ ] Add edit controls for allowed fields using the patch route.
- [ ] Preserve unsaved input when validation fails and refresh the saved record.

**Acceptance / Your browser test:** Edit a job title and refresh: it persists. Submit invalid input: show the error without losing the form.


### D10: Record a CRM activity [ ]

- [ ] Migrate an `activities` table with lead ID, type, details, time, and idempotency key.
- [ ] Add one write function for later agents and routes.
- [ ] Test repeating the same action.

**Acceptance:** A retry creates one activity row.

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
npm run build --prefix client
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

### UI08: Business profile form [ ]

- [ ] Build profile creation and saved profile views using the profile routes.
- [ ] Show field validation and save/error states.

**Acceptance / Your browser test:** Submit an empty profile, then save a valid synthetic business. Refresh and confirm the saved description and targets.


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

### UI09: ICP generation and selection [ ]

- [ ] Add Generate ICP, generation status, version history, and selection controls.
- [ ] Display rationale, unknowns, and model failures clearly.

**Acceptance / Your browser test:** Generate an ICP from the saved profile, inspect its evidence/unknowns, select a version, and refresh to confirm selection. Check a configured model failure shows an error.


**Phase check:**

```powershell
npm run db:migrate
npm run check
npm test
npm run build
npm run build --prefix client
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

### UI10: Candidate results [ ]

- [ ] Show candidates for the selected ICP with match evidence and bounded pagination.
- [ ] Link each candidate to the existing lead detail screen.

**Acceptance / Your browser test:** Select an ICP, find candidates, and inspect matching reasons. Verify changing the ICP refreshes results.


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

### UI11: Qualification results [ ]

- [ ] Add a qualification action and display score, category, factor contributions, and uncertainty.
- [ ] Keep a visible pending-review label for uncertain leads.

**Acceptance / Your browser test:** Qualify synthetic high, low, and uncertain examples. Inspect the factors and confirm uncertain leads remain blocked.


### L06: Review uncertain leads [ ]

- [ ] Add authenticated `GET /api/review-items` and `PATCH /api/review-items/:reviewId` for approve/reject with a reason.
- [ ] Store reviewer, decision time, and qualification reference; reject invalid or conflicting decisions.
- [ ] Test that rejection blocks outreach and approval permits the next step once.

**Acceptance:** A manager can resolve an uncertain lead through the API with a traceable decision.

### UI12: Lead review queue [ ]

- [ ] Build `/reviews` using review-item list and decision routes.
- [ ] Show evidence, approve/reject controls, reason input, and saved decision state.

**Acceptance / Your browser test:** Approve one uncertain lead and reject another. Refresh and confirm decisions persist and duplicate clicks do not repeat actions.


**Phase check:**

```powershell
npm run db:migrate
npm run check
npm test
npm run build
npm run build --prefix client
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

### UI13: Knowledge search preview [ ]

- [ ] Add authenticated `POST /api/knowledge/search` wrapping the tested retrieval service.
- [ ] Build a small `/knowledge` search screen showing returned passages and source locations.

**Acceptance / Your browser test:** Ask a question covered by the seeded documents and inspect its source passage. Ask an unrelated question and confirm a clear no-match state.


**Phase check (ingest script planned in R03):**

```powershell
npm run db:migrate
npm run knowledge:ingest
npm run check
npm test
npm run build
npm run build --prefix client
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

### UI14: Workflow launch and progress [ ]

- [ ] Build `/workflows` with profile/ICP selection and a start action.
- [ ] Show run stage, node events, errors, and paused/review status; add resume using a stored decision.
- [ ] Poll safely while running and stop polling on completion or page exit.

**Acceptance / Your browser test:** Start a run, watch its stages, open an uncertain-lead review, and resume after deciding. Refresh the run and verify stored progress remains visible.


**Phase check:**

```powershell
npm run db:migrate
npm run check
npm test
npm run build
npm run build --prefix client
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

### UI15: Draft reading and approval [ ]

- [ ] Show generated draft subject/body, supporting sources, and pending-review state on lead detail.
- [ ] Add generate, approve, and reject actions using the draft routes.

**Acceptance / Your browser test:** Generate and inspect a draft, follow its source references, reject it, and approve another. Refresh to verify the saved decisions.


### O03: Simulate contact [ ]

- [ ] Add authenticated `POST /api/outreach-drafts/:draftId/simulate`.
- [ ] Record an approved draft as a simulated CRM contact activity.
- [ ] Block unapproved drafts and suppressed leads.
- [ ] Test that no email or SMS provider is called.

**Acceptance:** The activity clearly says `simulated`.

### UI16: Simulated contact action [ ]

- [ ] Add a clearly labeled Simulate contact button for approved drafts.
- [ ] Show the stored simulated result and disable ineligible actions.

**Acceptance / Your browser test:** Try an unapproved draft, then an approved draft. Only the approved action succeeds and is visibly labeled simulated.


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

### UI17: Simulated reply and suppression [ ]

- [ ] Add a simulated reply form and display its classification.
- [ ] Show follow-up/review items and an opt-out label with blocked outreach controls.

**Acceptance / Your browser test:** Submit Interested, an ambiguous reply, and Unsubscribe on separate demo leads. Confirm the right status and that an opted-out lead cannot create or simulate further outreach.


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
npm run build --prefix client
# Manually: generate -> review -> simulate -> submit Unsubscribe -> verify new draft blocked
```

## Phase 8: Dashboard and final visual polish

**Goal:** Bring together the screens built in earlier phases and verify the complete browser experience.







### C01: CRM timeline and summary API [ ]

- [ ] Add `GET /api/leads/:leadId/activities` in time order.
- [ ] Add `GET /api/dashboard/summary` for leads, qualified, contacted, replies, opportunities, and review queue.
- [ ] Test counts against seeded records and simulated activity labels.

**Acceptance:** API counts match stored CRM events.
### UI18: Lead activity timeline [ ]

- [ ] Show the ordered CRM activity feed on the existing lead detail screen.
- [ ] Display qualifications, review decisions, simulated contacts, and replies with timestamps.

**Acceptance / Your browser test:** Open a lead used in earlier phases and verify that each stored action appears once in order.

### C06: Dashboard summary [ ]

- [ ] Build `/dashboard` with real funnel totals and links to leads, workflows, and review items.
- [ ] Show simulation labels and refresh summary values after completed actions.

**Acceptance / Your browser test:** Complete a demo action and compare the refreshed counts with the relevant leads and activity records.

### C07: Visual and browser polish [ ]

- [ ] Review the existing screens together for consistent typography, spacing, controls, and navigation.
- [ ] Check keyboard navigation, mobile layouts, validation, empty states, and error recovery.

**Acceptance / Your browser test:** Walk through login to simulated reply on desktop and phone widths. Report any unreadable, confusing, or inaccessible control before the final rehearsal.

**Phase check (client scripts already available from phase 1):**

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
- [ ] For a UI task, give the user the start commands and complete its **Your browser test** review before moving on.
- [ ] Relevant tests and type/build checks pass; keep the result in `progress.md` to one short line.
- [ ] Documentation and task status match the code that exists.
- [ ] Commit only that task's files using its ID in the message.
- [ ] Stop and ask the user to review before the next task.
