---
id: endpoint-created
name: Endpoint Created
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Webhooks
    textColor: white
    backgroundColor: green
---

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `io.datarecs.webhook.endpoint.created` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (`WebhookEndpointLifecyclePayload`)

```typescript
{ /* schema not found — check data-models-events */ }
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
