---
id: webhooks
name: Webhooks
version: 0.1.0
---

Webhook endpoint management, subscription matching, and outbound delivery lifecycle.

<Admonition type="info">
All events in this domain follow CloudEvents v1.0. The event `type` is also the NATS subject suffix: `<domain>.<entity>.<action>`.
</Admonition>
