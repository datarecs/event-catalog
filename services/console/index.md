---
id: console
name: Console
version: 0.1.0
receives:
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
---

Angular SPA for logged-in users. Receives tenant-scoped real-time job-run updates through core-api, sourced from NATS JetStream.

- **Technology**: Angular
- **Event Delivery**: Core API real-time client channel
