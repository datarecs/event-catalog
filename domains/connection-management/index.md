---
id: connection-management
name: Connection Management
version: 0.1.0
---

Database connection CRUD, testing, and reservation lifecycle.

<Admonition type="info">
All events in this domain follow CloudEvents v1.0. The event `type` is also the NATS subject suffix: `<domain>.<entity>.<action>`.
</Admonition>
