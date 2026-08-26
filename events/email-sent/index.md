---
id: email-sent
name: Email Sent
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Notifications
    textColor: white
    backgroundColor: green
---

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `notification.email.sent` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (`EmailNotificationPayload`)

```typescript
{
  run_id: string;
  job_id: string;
  recipient_count: number;
  detail_level: string;
  status: EmailNotificationStatus;
  error_message?: string;
  skip_reason?: string;
}
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
