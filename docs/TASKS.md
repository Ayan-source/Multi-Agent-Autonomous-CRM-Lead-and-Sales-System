# SalesGenie AI — Build checklist

This is the practical to-do list. **Each checkbox is one small task** to implement, test, explain, and record in `progress.md` before starting another. Route names and pages below describe the intended prototype; none exists unless checked. The selected demo account model is one seeded sales-manager account, with no public sign-up. The dataset, LLM provider, and exact database columns still require inspection before those tasks start.

**Status:** `[x]` done; `[ ]` planned; `[ ] (blocked)` needs the stated dependency. Phase summaries are in [ROADMAP.md](ROADMAP.md). The next product task is **D01**.

## Phase 0 — Audit

**Visible result:** A clear picture of what exists before coding.

- [x] **A01 — Inspect the starting project.** Read the proposals, list existing code and tools, and report gaps. Done: read-only audit completed.

## Phase 1 — Project foundation

**Visible result:** The API starts locally and has repeatable checks.

- [x] **F01 — Start the API.** Create `GET /health`, a server entry point, npm scripts, and an HTTP test. Done: one test and syntax check pass.
- [x] **F02 — Write project documents.** Add PRD, architecture, roadmap, this checklist, and a simple progress log. Done: documents are present and linked.
- [ ] **F03 — Add static TypeScript checking.** Install a compiler, add a `typecheck` script, and run it on source and tests. Done: command passes locally. **Blocked:** npm package downloads currently fail.
- [ ] **F04 — Add configuration validation.** Create `.env.example` with placeholder names for the first service used; reject missing/invalid settings at startup. Done: valid and invalid configuration examples are checked.

## Phase 2 — Dataset, PostgreSQL, authentication, and lead API

**Visible result:** A manager can sign in and work with a small, safe list of stored leads.

### Dataset and database

- [ ] **D01 — Inspect LeadsBlue.** Obtain a small permitted sample; record license, actual columns, missing values, duplicates, and personal-data concerns. Done: a short findings note identifies usable fields. **Dependency:** sample is not in the workspace.
- [ ] **D02 — Define `Lead` input mapping.** Map observed source columns to a small lead structure and reject unusable rows. Done: fixtures show valid, missing, and malformed values.
- [ ] **D03 — Connect PostgreSQL.** Configure a local connection outside source control and add a read-only connection check. Done: check succeeds and a bad URL fails clearly.
- [ ] **D04 — Create the `leads` table.** Add a migration with lead ID, source key, known fields, and uniqueness based on observed data. Done: migration runs on an empty database and a duplicate insert is handled.
- [ ] **D05 — Import a tiny safe dataset.** Load synthetic or anonymized leads through D02 into D04. Done: counts and rejected rows are reported; rerunning adds no duplicates.
- [ ] **D06 — List leads.** Add `GET /api/leads` with a small page limit. Done: route test checks response shape and bounded results.
- [ ] **D07 — View one lead.** Add `GET /api/leads/:leadId`. Done: existing ID returns details; unknown ID returns 404.
- [ ] **D08 — Create one lead.** Add validated `POST /api/leads` for demo records. Done: valid input persists; invalid input returns 400; duplicate key is handled.
- [ ] **D09 — Edit one lead.** Add validated `PATCH /api/leads/:leadId` for allowed fields. Done: changed fields persist; unknown ID and invalid input are tested.
- [ ] **D10 — Store one CRM activity.** Add an `activities` table and a write function with an idempotency key. Done: repeating the same action stores one row.

### Login and protected access

- [ ] **AU01 — Store demo user and sessions.** Migrate `users` and `sessions` tables; store password hashes, not passwords. Done: migration and repository tests pass.
- [ ] **AU02 — Seed one manager account.** Provide a local setup command that reads the password from an environment variable. Done: rerun does not duplicate the user and no password enters Git or logs.
- [ ] **AU03 — Login route.** Add `POST /api/auth/login` with email/password; create an HTTP-only session cookie on success. Done: good credentials work; wrong or missing credentials fail without revealing which field was wrong.
- [ ] **AU04 — Current-user route.** Add `GET /api/auth/me`. Done: valid session returns the manager identity; no or expired session returns 401.
- [ ] **AU05 — Logout route.** Add `POST /api/auth/logout`; invalidate the session and clear the cookie. Done: the old cookie cannot call `/api/auth/me` afterward.
- [ ] **AU06 — Protect existing lead routes.** Add a session guard and make it the default for new CRM/workflow routes; leave `/health` public. Done: anonymous lead requests get 401 and authenticated requests work.

## Phase 3 — Business profile and ICP

**Visible result:** A manager can enter a business profile and inspect its generated customer profile.

- [ ] **I01 — Validate `BusinessProfile`.** Define description, target industries, regions, size, and optional notes. Done: empty/invalid inputs are rejected in tests.
- [ ] **I02 — Save a profile.** Add `POST /api/business-profiles`. Done: a valid profile is stored for the signed-in user; invalid input returns 400.
- [ ] **I03 — Read a profile.** Add `GET /api/business-profiles/:profileId`. Done: saved profile returns; missing ID gives 404.
- [ ] **I04 — Add the LangChain model adapter.** One function sends a model request; tests replace it with a fake. Done: no paid API call is required for tests. **Dependency:** package access and provider credentials for live use.
- [ ] **I05 — Write the ICP prompt.** Ask the model to derive only supported customer traits from a profile and explain uncertainty. Done: prompt fixtures contain the right profile facts and no secrets.
- [ ] **I06 — Validate structured ICP output.** Parse target traits, rationale, and unknowns from model output. Done: malformed or unsupported output does not enter CRM state.
- [ ] **I07 — Generate an ICP.** Add `POST /api/business-profiles/:profileId/icps` using I04–I06. Done: mocked model creates a validated ICP or a clear failure/review result.
- [ ] **I08 — View ICP history.** Add `GET /api/business-profiles/:profileId/icps`. Done: stored versions can be read in order.
- [ ] **I09 — Select an ICP.** Save which validated version downstream work should use. Done: candidate search uses the selected version after a new one is generated.

## Phase 4 — Find and qualify leads

**Visible result:** Each candidate has a score, reason, and a review decision when uncertain.

- [ ] **L01 — Match leads to an ICP.** Write a dataset/CRM search function using only verified fields. Done: fixtures show matched and excluded lead IDs with reasons.
- [ ] **L02 — Expose candidates.** Add `GET /api/icps/:icpId/candidates` with a limit. Done: route returns lead IDs and match evidence; unknown ICP gives 404.
- [ ] **L03 — Score one lead with rules.** Define score factors separately from model prompts. Done: tests show each factor's contribution and missing-field behavior.
- [ ] **L04 — Assign fit category.** Convert the score to High, Medium, or Low Fit and mark borderline values. Done: exact threshold boundaries are tested.
- [ ] **L05 — Add optional LLM reasoning.** Ask the model to explain only uncertain scores using given evidence. Done: mocked output is validated and cannot invent lead facts or silently replace the rule score.
- [ ] **L06 — Save qualification.** Add `POST /api/leads/:leadId/qualifications` for a chosen ICP. Done: score, category, explanation, and source run are stored without duplicate retries.
- [ ] **L07 — Queue uncertain leads.** Create a review item for borderline/conflicting cases. Done: such a lead cannot enter outreach until reviewed.

## Phase 5 — RAG and knowledge retrieval

**Visible result:** A draft can cite relevant product facts retrieved from known documents.

- [ ] **R01 — Select business knowledge.** Add a few authorized product facts or guidelines as local demo documents. Done: each document has a source label and no contact-data dump.
- [ ] **R02 — Split documents into chunks.** Keep chunk text, document ID, and location. Done: a test can trace retrieved text back to its source.
- [ ] **R03 — Create pgvector storage.** Migrate document/chunk/embedding tables in PostgreSQL. Done: extension and migration run in the chosen environment.
- [ ] **R04 — Generate embeddings.** Add an embedding adapter and idempotent chunk ingestion. Done: fake-embedding tests pass and re-ingestion does not duplicate chunks.
- [ ] **R05 — Build `retrieveKnowledge` tool.** Search for the most relevant chunks for a lead/product question. Done: a relevant fixture ranks above an unrelated one; no-match returns an empty result.
- [ ] **R06 — Check grounding.** Pass retrieved text and source IDs to a draft prompt; flag claims without support. Done: a test catches an invented product claim.

## Phase 6 — LangGraph workflow and tool calling

**Visible result:** One run moves between agents and pauses when a person must decide.

- [ ] **G01 — Define shared graph state.** Include profile ID, ICP ID, lead IDs, scores, review status, draft IDs, response status, and errors. Done: node input/output examples validate.
- [ ] **G02 — Add ICP node.** Wrap the tested profile-to-ICP service in a LangGraph node. Done: a fixed profile updates graph state with an ICP ID.
- [ ] **G03 — Add lead-finding node.** Call the tested candidate search and append lead IDs to state. Done: graph test shows the selected IDs.
- [ ] **G04 — Add qualification node.** Score candidates and store outcomes. Done: graph test covers high, low, and uncertain results.
- [ ] **G05 — Wire conditional edges.** Route high-fit leads to `draft_ready`, low-fit leads to finish, and uncertain leads to review. Done: all three graph paths are tested; outreach is attached later.
- [ ] **G06 — Add `findLeads` tool.** Wrap L01 with a validated input/output contract. Done: mocked tool call returns candidate IDs.
- [ ] **G07 — Add `scoreLead` tool.** Wrap L03/L04 with a validated contract. Done: mocked tool call returns score, category, and factors.
- [ ] **G08 — Add `retrieveKnowledge` tool.** Wrap R05 with a validated contract. Done: mocked tool call returns chunks and source IDs.
- [ ] **G09 — Add `saveCrmActivity` tool.** Wrap D10 with a validated contract. Done: retry test stores one activity.
- [ ] **G10 — Bound failures.** Add timeouts/retry limits around model and external calls. Done: transient failure retries; persistent failure stops with a visible status.
- [ ] **G11 — Pause for human review.** Save graph state before review and resume once on a valid decision. Done: restart/resume test does not repeat a CRM action.
- [ ] **G12 — Start a run.** Add `POST /api/workflows` with a profile/ICP selection. Done: it returns a run ID; invalid input fails without starting work.
- [ ] **G13 — Inspect a run.** Add `GET /api/workflows/:runId` with stage, outcome, and safe event history. Done: user can see progress and failure without exposed secrets.

## Phase 7 — Outreach drafts and simulated replies

**Visible result:** A manager reviews a draft, simulates a reply, and sees opt-outs enforced.

- [ ] **O01 — Draft from facts.** Build an outreach prompt using approved lead facts, ICP, and retrieved source text. Done: mocked output is specific and names its supporting sources.
- [ ] **O02 — Validate the draft.** Reject missing subject/body, invented claims, and unprofessional output. Done: good and bad fixtures route correctly.
- [ ] **O03 — Save a draft.** Add `POST /api/leads/:leadId/outreach-drafts`. Done: draft is stored as `pending_review`; no message is sent.
- [ ] **O04 — List drafts.** Add `GET /api/leads/:leadId/outreach-drafts`. Done: reviewer sees draft IDs and review status for a lead.
- [ ] **O05 — View one draft.** Add `GET /api/outreach-drafts/:draftId`. Done: reviewer sees content and source references; unknown ID returns 404.
- [ ] **O06 — Review a draft.** Add `PATCH /api/outreach-drafts/:draftId/review` for approve/reject. Done: only a signed-in reviewer can decide; duplicate decisions do not duplicate activity.
- [ ] **O07 — Simulate outreach.** Mark an approved draft as simulated-contact activity. Done: activity is labeled simulated and no email/SMS API is called.
- [ ] **O08 — Submit a simulated reply.** Add `POST /api/leads/:leadId/responses`. Done: reply text is saved and tied to the correct lead/activity.
- [ ] **O09 — Classify a reply.** Assign Interested, Not Interested, Follow-up Required, Unsubscribe, or review-needed. Done: fixed examples and ambiguity are tested.
- [ ] **O10 — Enforce unsubscribe.** Add a suppression record when reply means opt-out. Done: future drafting and simulated contact are blocked for that lead across runs.
- [ ] **O11 — Decide follow-up.** Create a review task for eligible follow-up; do not send automatically. Done: no-response, ambiguous, and opt-out examples route safely.

## Phase 8 — CRM views and dashboard

**Visible result:** A signed-in manager can follow the sales funnel and review items in a browser.

- [ ] **C01 — Extend CRM activity types.** Use D10 to record qualification, draft, simulated contact, reply, and review events. Done: each event appears once in a lead timeline.
- [ ] **C02 — Show lead timeline.** Add `GET /api/leads/:leadId/activities`. Done: ordered history and current status match stored events.
- [ ] **C03 — Calculate dashboard counts.** Add `GET /api/dashboard/summary` for totals, qualified, contacted, replies, opportunities, and review queue. Done: seeded fixtures give expected counts and simulated labels.
- [ ] **C04 — Create React shell.** Add navigation, API client, and protected layout. Done: it loads locally and sends the session cookie to the API.
- [ ] **C05 — Build login page.** Add form using `POST /api/auth/login`. Done: valid login reaches the dashboard; invalid login shows an error.
- [ ] **C06 — Restore browser session.** Call `GET /api/auth/me` on page load. Done: refresh stays signed in while session is valid and redirects when expired.
- [ ] **C07 — Add logout control.** Call `POST /api/auth/logout` and clear client state. Done: browser returns to login and protected pages no longer load.
- [ ] **C08 — Build profile form.** Enter and view business profile and its ICP. Done: invalid fields are visible; accepted profile/ICP can be revisited.
- [ ] **C09 — Build leads table/detail.** Show candidates, scores, explanations, and timeline. Done: reviewer can inspect one lead without raw database access.
- [ ] **C10 — Build review queue.** Show uncertain leads and drafts with approve/reject controls. Done: action updates the right item after refresh.
- [ ] **C11 — Build dashboard and run view.** Show funnel counts, simulated outcome labels, graph stage, and errors. Done: values match the API and one demo run is understandable.

## Phase 9 — Evaluation and hardening

**Visible result:** A report shows what worked, how well, and where the prototype fails.

- [ ] **E01 — Label a lead-fit sample.** Record human labels and split into development/test groups. Done: test labels are not placed in prompts.
- [ ] **E02 — Calculate qualification metrics.** Script precision, recall, F1, and accuracy on held-out examples. Done: repeatable output includes the counts behind each metric.
- [ ] **E03 — Compare rule-only baseline.** Run the same test set through rule scoring and the full flow. Done: report uses the same labels and explains differences.
- [ ] **E04 — Score outreach quality.** Use a small human rubric for relevance, personalization, factual support, tone, and call to action. Done: scored examples and method are saved.
- [ ] **E05 — Run failure cases.** Cover missing email/company, duplicate leads, bad model output, database failure, retry, ambiguous reply, and unsubscribe. Done: each case has an observed safe outcome.
- [ ] **E06 — Measure execution.** Capture duration, model calls, estimated cost per lead, and failure count. Done: report separates observed measurements from simulated conversion results.
- [ ] **E07 — Review security.** Verify protected routes, session expiry, input validation, secret handling, and privacy-safe logs. Done: issues are fixed or explicitly documented.

## Phase 10 — Final demo and report

**Visible result:** The course evaluator can repeat the full simulated workflow.

- [ ] **P01 — Seed a synthetic demo.** Provide a repeatable setup command for one business, knowledge documents, and safe leads. Done: reset/reseed produces the same starting state.
- [ ] **P02 — Rehearse one end-to-end run.** Profile → ICP → leads → scores → draft review → simulated reply → CRM/dashboard. Done: exact steps and observed output are recorded.
- [ ] **P03 — Write evaluation report.** Include qualification metrics, outreach rubric, reliability/cost, baseline, and limitations. Done: every reported number has a source or is labeled simulated.
- [ ] **P04 — Decide deployment.** If needed for the course, document and verify a suitable host; otherwise document local demo setup. Done: evaluator can reproduce the demo.

**Working rule:** Finish only one unchecked item at a time. For that item, explain the concept, implement it, run relevant tests, update `progress.md`, and stop for approval before the next item.
