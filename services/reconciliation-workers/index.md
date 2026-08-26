---
id: reconciliation-workers
name: Reconciliation Workers
version: 0.1.0
sends:
  - id: run-triggered
  - id: run-queued
  - id: run-queue-errored
  - id: run-completed
  - id: run-errored
  - id: run-finalised
  - id: run-cancel-requested
  - id: run-cancelled
  - id: run-rows-processed
  - id: run-results-downloaded
  - id: run-extraction-started
  - id: run-extraction-completed
  - id: run-extraction-errored
  - id: run-comparison-started
  - id: run-comparison-completed
  - id: run-comparison-errored
  - id: run-stage-started
  - id: run-stage-completed
  - id: run-stage-errored
receives:
  - id: job-triggered
---

Ephemeral Node.js workers (extractors and comparators) that execute the actual data reconciliation.

- **Event Source URI**: `/datarecs/reconciliation-worker`
- **Technology**: Node.js (Turborepo)
- **Execution**: Ephemeral K8s Jobs
