---
id: run-errored
name: Run Errored
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Reconciliation
    textColor: white
    backgroundColor: green
---

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `reconciliation.run.errored` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (`JobRunErroredPayload`)

```typescript
{
  run_id: string;
  job_id: string;
  tenant_id: string;
  workflow_name: string;
  error: { code: RunErrorCode; message: string };
}
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
