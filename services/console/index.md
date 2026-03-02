---
id: console
name: Console
version: 0.1.0
receives:
  - id: job-run-started
  - id: job-run-stage-completed
  - id: job-run-completed
  - id: job-run-failed
  - id: job-run-rows-processed
---

Angular SPA for logged-in users. Subscribes to events via WebSocket for real-time updates on job run status and progress.

- **Technology**: Angular
- **Event Delivery**: WebSocket (bridged from Knative by core-api)
