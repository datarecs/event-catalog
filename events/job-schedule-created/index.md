---
id: job-schedule-created
name: Job Schedule Created
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Reconciliation
    textColor: white
    backgroundColor: green
---

Emitted when a cron schedule is created for a job.

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `com.datarecs.reconciliation.schedule.created` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema

```typescript
{ schedule_id: string; job_id: string; cron_expression: string; timezone?: string; actor_id: string; }
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
