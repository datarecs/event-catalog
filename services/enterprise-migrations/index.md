---
id: enterprise-migrations
name: Enterprise Migrations
version: 0.1.0
sends:
  - id: migration-starting
  - id: migration-step-completed
  - id: migration-step-failed
  - id: migration-completed
  - id: migration-failed
---

Tenant-scoped migration service that emits migration and step lifecycle evidence through NATS JetStream.

- **Event Source URI**: `/datarecs/enterprise-migrations`
- **Technology**: NestJS (Node.js)
