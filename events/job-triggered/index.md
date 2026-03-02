---
id: job-triggered
name: Job Triggered
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Reconciliation
    textColor: white
    backgroundColor: green
---

Emitted when a job run is triggered (immediately or dry-run). This is the handoff from core-api to the reconciliation workers.

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `com.datarecs.reconciliation.job.triggered` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema

```typescript
{ run_id: string; job_id: string; mode: 'IMMEDIATE' | 'DRY_RUN'; params?: Record<string, string>; triggered_by: string; }
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
