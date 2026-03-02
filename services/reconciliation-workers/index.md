---
id: reconciliation-workers
name: Reconciliation Workers
version: 0.1.0
sends:
  - id: job-run-started
  - id: job-run-stage-completed
  - id: job-run-completed
  - id: job-run-failed
  - id: job-run-cancelled
  - id: job-run-rows-processed
receives:
  - id: job-triggered
---

Ephemeral Node.js workers (extractors and comparators) that execute the actual data reconciliation. Run as K8s Jobs orchestrated by Airflow or triggered by core-api.

- **Event Source URI**: `/datarecs/reconciliation-worker`
- **Technology**: Node.js (Turborepo — extractor-mysql, extractor-postgres, comparator-duckdb)
- **Execution**: Ephemeral K8s Jobs
