---
id: api-key-deleted
name: API Key Deleted
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Platform Operations
    textColor: white
    backgroundColor: green
---

Emitted when an API key is deleted.

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `com.datarecs.platform.api_key.deleted` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema

```typescript
{ api_key_id: string; name: string; scopes: string[]; actor_id: string; }
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
