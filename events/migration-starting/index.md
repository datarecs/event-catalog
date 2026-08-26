---
id: migration-starting
name: Migration Starting
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
| **type** | `migration.migration.starting` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (`MigrationStartingPayload`)

```typescript
{
  tenant_id: string;
  migration_type: string;
  direction: string;
  migration_id: string;
  retry: boolean;
}
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
