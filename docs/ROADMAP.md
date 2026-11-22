# SalesGenie AI — Roadmap

This page tracks phases and status. [TASKS.md](TASKS.md) contains the small, independently verifiable tasks in each phase. Complete one task, test it, update `progress.md`, then wait for approval before starting the next. Later tasks can be revised when the dataset and development environment are known.

Commit after every mini task. After a successful commit and user review, remind the user to push manually; repeat that reminder at each phase checkpoint. A failed commit must be resolved before calling the changes ready to push.

**Reviewed development order:** F04 -> F05 -> C02 (React shell and visual foundation) -> DB01 (Docker database) -> D03-D05 -> DB02 (isolated database tests) -> authentication routes with UI01-UI03 -> protected lead routes with UI04-UI07 -> phases 3-9. Add profile/ICP screens in phase 3, candidate/qualification/review screens in phase 4, a RAG preview in phase 5, workflow controls in phase 6, and draft/reply screens in phase 7. Phase 8 adds the final dashboard, activity timeline, and visual polish. Every UI task has an explicit user browser test in TASKS.md. Express and React keep their normal npm workflow. LangGraph gains outreach, response, and CRM nodes in O06-O08. GitHub automated checks are E04.

| Phase | Outcome | Status | Key dependency |
| --- | --- | --- | --- |
| 0. Audit | Inspect proposals and supplied dataset; define lead input mapping. | Complete | Dataset license still unconfirmed |
| 1. Foundation | Runnable API, React shell, basic visual styles, and development checks. | In progress | F05, C02 |
| 2. Data, access, and CRM API | Docker PostgreSQL, isolated tests, login/logout screens, and protected lead CRUD screens. | Planned | Docker Desktop/Compose, package access |
| 3. Business profile and ICP | Accept profile and generate validated ICP. | Planned | CRM foundation and LLM access |
| 4. Discovery and qualification | Find and explain suitable leads; flag uncertainty. | Planned | Verified dataset fields and ICP |
| 5. Retrieval and memory | Retrieve relevant business facts for grounded generation. | Planned | Business documents, embeddings, pgvector |
| 6. Workflow orchestration | Connect steps with shared state and review routing. | Planned | Tested individual steps |
| 7. Outreach and replies | Draft messages, simulate responses, enforce opt-outs. | Planned | Qualification, retrieval, review flow |
| 8. Dashboard and polish | Add activity timeline, summary dashboard, and polish the screens built earlier. | Planned | Existing feature screens, CRM records, and workflow events |
| 9. Evaluation and final demo | Measure quality, reliability, cost, and baseline results; rehearse a reproducible demo and decide deployment. | Planned | Working end-to-end flow |

**Current milestone:** F01-F04 (API foundation, project documents, Express/TypeScript, and environment configuration), D01 (CSV schema/quality audit), and D02 (validated lead input mapping) are complete. The Express backend builds and its four earlier tests passed; F04 adds configuration checks. Review F04 before starting F05 (request parsing and API errors). The Kaggle dataset's license is still unconfirmed, so the supplied raw contact records must not be imported or used in the demo. No database, authentication, model, agent, frontend, or outreach implementation is complete.
