# SalesGenie AI — Architecture

## Current implementation

`src/app.ts` creates a Node HTTP server with `GET /health`; `src/server.ts` starts it on localhost. `src/lead-mapping.ts` maps the five observed CSV fields to a validated `LeadInput` using only synthetic test fixtures. `test/health.test.ts` tests the route over local HTTP, and `test/lead-mapping.test.ts` checks the mapper. Node 22 strips TypeScript syntax at runtime, and npm scripts run the server and tests. There is no database connection, frontend, model call, agent framework, authentication, or production deployment. Static TypeScript checking is not yet configured because package downloads failed in this environment.

## Intended system

```text
React dashboard (planned)
       |
TypeScript HTTP API (minimal foundation exists)
       |
Sales workflow: profile → ICP → candidates → scoring → drafts → simulated replies
       |                         |                         |
       +----- human review ------+-------------------------+
       |
PostgreSQL CRM records + workflow history (planned)
       |
pgvector business-document retrieval for grounded drafts (planned)
```

Use one Node/TypeScript backend for routes, validation, authentication, deterministic business logic, and model/tool adapters. A React dashboard is the proposed client; choose its tooling when the dashboard task starts. PostgreSQL with pgvector is the selected storage direction: relational tables hold authoritative CRM state, while vector search later retrieves relevant business text. Do not put ordinary lead status or workflow state into embeddings. PostgreSQL setup and extension availability still need verification.

The demo will have one seeded sales-manager account, password hashes, and server-side sessions carried by an HTTP-only cookie. Planned routes are `POST /api/auth/login`, `GET /api/auth/me`, and `POST /api/auth/logout`; CRM and workflow routes require a session. There is no public registration route. This is a proposed design, not implemented authentication.

Start the flow as plain functions and explicit data structures. Add LangGraph JS when branching, shared state, retries, and pause/resume for human review are implemented. A graph node should have one clear responsibility and return validated state updates. The LLM provider and model remain undecided until a task needs them; external calls should sit behind small adapters so tests can use fixed responses.

## Responsibilities and data flow

| Component | Input | Output and responsibility |
| --- | --- | --- |
| BusinessProfileAgent | Submitted business profile | Structured, validated ICP; ask for review if key information is absent. |
| LeadFinderAgent | ICP and inspected local dataset | Candidate lead references and matched attributes. |
| QualifierAgent | ICP and candidate | Explainable rule score, category, evidence, uncertainty; use LLM reasoning only where useful. |
| OutreachAgent | Approved lead, business facts, retrieved context | Factual draft and supporting context for human review. |
| ResponseAgent | Simulated reply | Response category or review flag; opt-out signal takes priority. |
| CRMUpdateAgent | Validated decisions and actions | Idempotent CRM and activity updates with traceable outcomes. |
| Optional verifier | Important agent output | Flags unsupported claims or invalid structure when ordinary validation is insufficient. |

The workflow carries the profile, ICP, lead ID, candidate facts, score and explanation, retrieved document references, draft, review decision, response, and current status. The CRM stores durable records; workflow state carries one run's context. An outreach draft must never be interpreted as permission to send. A response marked Unsubscribe updates suppression before any later outreach decision.

## Data model direction

Planned relational concepts are users/sessions, businesses/profiles, ICP versions, source leads, qualification results, activities and drafts, responses, suppression records, opportunities, review items, and workflow runs/events. Use stable IDs and uniqueness rules for imported leads and retried actions; determine exact columns and keys after inspecting the real dataset. RAG documents will have source metadata and embedding records in pgvector when relevant business material exists. No schema or migration exists yet.

## Boundaries and operational rules

- API validation checks user input and model-produced structures before database writes or routing.
- Database writes and status transitions are explicit application operations, with an audit trail and retry-safe behavior.
- Lead data and logs should contain only the personal information required for the demo. Use synthetic or authorized contacts and record dataset license findings before import.
- The default workflow previews or simulates outreach. Live email/SMS requires a separate design and explicit approval.
- Tests use deterministic fixtures and mocked LLM/external adapters; evaluation reports identify simulated data.

Architecture is planned unless marked as current above. See [PRD.md](PRD.md) for required behavior and [TASKS.md](TASKS.md) for the order of implementation.
