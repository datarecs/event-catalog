---
id: reconciliation-workers
name: Reconciliation Workers
version: 0.1.0
sends:
  - id: run-started
  - id: run-stage-completed
  - id: run-completed
  - id: run-failed
  - id: run-cancelled
  - id: run-rows-processed
receives:
  - id: job-triggered
---

Ephemeral Node.js workers (extractors and comparators) that execute the actual data reconciliation.

- **Event Source URI**: `/datarecs/reconciliation-worker`
- **Technology**: Node.js (Turborepo)
- **Execution**: Ephemeral K8s Jobs
