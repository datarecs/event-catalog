---
id: migration-failed
name: Migration Failed
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Enterprise Migrations
    textColor: white
    backgroundColor: green
---

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `migration.migration.failed` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (`MigrationFailedPayload`)

```typescript
{
  tenant_id: string;
  migration_type: string;
  direction: string;
  migration_id: string;
  error_message: string;
  failed_step: string;
}
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
