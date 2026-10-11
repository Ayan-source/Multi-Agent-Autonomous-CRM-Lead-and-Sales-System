# SalesGenie AI — Product requirements

## Purpose and users

SalesGenie AI is a university project that demonstrates a working B2B sales workflow: business profile → ideal customer profile (ICP) → lead discovery → qualification → outreach draft → response handling → CRM update → dashboard and human review. It should show several focused agents sharing state and using tools, with measurable results. It is a demonstrable prototype, not a production sales service.

The primary user is a sales manager who enters a business profile, reviews proposed leads and messages, and follows their status. The student developer and course evaluator need a repeatable demo that shows each decision, the data behind it, and what happens when data is incomplete or a step fails.

## Product scope

### Required capabilities

1. Accept a business/product description and target industries, regions, company sizes, and other relevant customer traits. Produce a structured ICP that later steps can use.
2. Find candidate leads in an inspected, locally available B2B dataset. Record the dataset source and observed fields; do not assume the proposed LeadsBlue sample contains any particular column until inspected.
3. Score leads against the ICP with explainable rules, then add LLM reasoning where it improves a decision. Return a score, High/Medium/Low Fit category, and evidence or uncertainty. Route borderline or conflicting results to human review.
4. Generate professional, personalized outreach **drafts** grounded in known lead and business facts. Present them for review; the prototype must not send real email or SMS as part of the default workflow.
5. Classify simulated replies as Interested, Not Interested, Follow-up Required, or Unsubscribe. Treat unclear replies as requiring review. An opt-out prevents later outreach.
6. Store leads, scores, drafts, responses, status changes, and significant agent decisions in a CRM database. Retried updates must not silently create duplicate records.
7. Show a dashboard with lead counts, funnel stages, responses, review items, and workflow activity. Distinguish simulated outcomes from observed outcomes.
8. Demonstrate shared workflow state, tool use, conditional routing, retrieval of relevant business knowledge, and human oversight in one end-to-end scenario.
9. Let a seeded sales-manager account sign in and out of the demo. Protect CRM, workflow, review, and dashboard data from anonymous API requests; public self-registration is outside the prototype scope.

### Evaluation and quality

- Evaluate qualification against a labeled set with precision, recall, F1, and accuracy; compare it with a simple rule-based baseline.
- Review a sample of drafts for relevance, personalization, factual support, tone, and useful call to action.
- Record workflow failures, recovery behavior, time per lead, number of LLM calls, and estimated cost. Label synthetic funnel results as simulated.
- Validate user input and structured model output. Keep secrets out of code and logs, use synthetic or authorized demonstration contacts, respect dataset terms, and prevent repeated or unwanted outreach.
- Keep ordinary logic deterministic where practical; tests must mock paid/external services and cover missing fields, duplicates, ambiguity, opt-out, retries, and the end-to-end demo.

## Out of scope for the initial prototype

Live outreach, contact scraping, HubSpot/SendGrid/Twilio integration, model fine-tuning, and a production deployment are optional later extensions. None is required to prove the course workflow. An optional Critic/Verifier agent should be added only if ordinary validation cannot cover a demonstrated need.

## Acceptance criteria

The final course demo is acceptable when a sales manager can sign in, enter a business profile, obtain a structured ICP, inspect dataset-sourced candidates and their reasons for qualification, review grounded outreach drafts, submit simulated replies including an unsubscribe, and see correct CRM records and dashboard counts. A rerun must avoid duplicate actions; an opted-out contact must remain suppressed. Anonymous requests must not expose CRM data. The project must include reproducible tests, a labeled qualification evaluation, and a report that separates simulated outcomes from real observations.

## Current state and source of truth

As of 2026-10-11, only a minimal local API with `GET /health` exists. No dataset, database, LLM, agent, dashboard, or outreach capability is implemented. This PRD condenses `prompt.md` and the two proposal documents in the repository; `prompt.md` controls the staged development and simulated-outreach approach where the proposals differ. Task status lives in [ROADMAP.md](ROADMAP.md) and the small steps in [TASKS.md](TASKS.md).
