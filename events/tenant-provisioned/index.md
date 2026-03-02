---
id: tenant-provisioned
name: Tenant Provisioned
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Tenant Management
    textColor: white
    backgroundColor: green
---

Emitted when a new tenant has been fully provisioned — database schema created, Vault paths set up, and admin user ready.

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `com.datarecs.tenant.tenant.provisioned` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema

```typescript
{ tenant_id: string; domain: string; admin_email: string; provisioned_at: string; }
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
