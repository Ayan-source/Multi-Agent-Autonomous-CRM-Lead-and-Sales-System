# SalesGenie AI — Roadmap

This page tracks phases and status. [TASKS.md](TASKS.md) contains the small, independently verifiable tasks in each phase. Complete one task, test it, update `progress.md`, then wait for approval before starting the next. Later tasks can be revised when the dataset and development environment are known.

| Phase | Outcome | Status | Key dependency |
| --- | --- | --- | --- |
| 0. Audit | Inspect proposals and empty repository; choose a practical direction. | Complete | None |
| 1. Foundation | Runnable API, basic documentation, and development checks. | In progress | npm package access for static type checking |
| 2. Data, access, and CRM API | Inspect dataset; set up PostgreSQL, login/logout, and lead routes. | Planned | Dataset sample, package access, and usable PostgreSQL |
| 3. Business profile and ICP | Accept profile and generate validated ICP. | Planned | CRM foundation and LLM access |
| 4. Discovery and qualification | Find and explain suitable leads; flag uncertainty. | Planned | Verified dataset fields and ICP |
| 5. Retrieval and memory | Retrieve relevant business facts for grounded generation. | Planned | Business documents, embeddings, pgvector |
| 6. Workflow orchestration | Connect steps with shared state and review routing. | Planned | Tested individual steps |
| 7. Outreach and replies | Draft messages, simulate responses, enforce opt-outs. | Planned | Qualification, retrieval, review flow |
| 8. CRM dashboard | Persist outcomes and show the funnel and review queue. | Planned | CRM records and workflow events |
| 9. Evaluation and hardening | Measure quality, reliability, cost, and baseline results. | Planned | Working end-to-end flow |
| 10. Demo and release | Reproducible scenario, report, and deployment decision. | Planned | Evaluated prototype |

**Current milestone:** F01 (minimal API), F02 (core project documents), D01 (CSV schema/quality audit), and D02 (validated lead input mapping) are complete. F03 (static type checking) depends on package access. The next task is D03, establishing a local PostgreSQL connection; it needs a reachable database and a PostgreSQL client dependency. The Kaggle dataset's license is still unconfirmed, so the supplied raw contact records must not be imported or used in the demo. No authentication, database, model, agent, frontend, or outreach implementation is complete.
