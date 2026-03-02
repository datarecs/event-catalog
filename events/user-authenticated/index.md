---
id: user-authenticated
name: User Authenticated
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Identity & Access
    textColor: white
    backgroundColor: green
---

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `io.datarecs.identity.user.authenticated` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (`UserAuthenticatedPayload`)

```typescript
{
  user_id: string;
  email: string;
  provider: string;
}
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
