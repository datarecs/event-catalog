---
id: email-notifier
name: Email Notifier
version: 0.1.0
sends:
  - id: email-sent
  - id: email-failed
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

Tenant-scoped notification service that consumes reconciliation lifecycle events and emits durable email-delivery outcomes through NATS JetStream.

- **Event Source URI**: `/datarecs/email-notifier`
- **Technology**: NestJS (Node.js)
