---
id: migration-step-completed
name: Migration Step Completed
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
| **type** | `migration.migration.step_completed` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (`MigrationStepCompletedPayload`)

```typescript
{
  tenant_id: string;
  migration_type: string;
  direction: string;
  migration_id: string;
  step_name: string;
  step_order: number;
}
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
