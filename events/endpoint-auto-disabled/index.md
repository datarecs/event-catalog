---
id: endpoint-auto-disabled
name: Endpoint Auto Disabled
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
| **type** | `webhook.endpoint.auto_disabled` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (`WebhookEndpointAutoDisabledPayload`)

```typescript
{
  endpoint_id: string;
  url: string;
  consecutive_failures: number;
  disabled_at: string;
}
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
