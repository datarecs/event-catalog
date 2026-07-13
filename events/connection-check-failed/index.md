---
id: connection-check-failed
name: Connection Check Failed
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Connection Management
    textColor: white
    backgroundColor: green
  - content: Action Required
    textColor: white
    backgroundColor: red
---

Emitted **once** when a saved connection transitions from healthy to **stale** — i.e. the
recurring connectivity health-check has failed repeatedly and exhausted its retry grace. When a
connection goes stale, DataRecs also pauses any job schedules that use it and blocks new runs
against it until the connection is fixed, so this event is your signal to take action.

## When it fires

The health-check probes each connection roughly every 12 hours. On failure the retry cadence
depends on **why** the probe failed:

- **Credentials / configuration errors** (`AUTH_FAILED`, `CONFIG_INVALID`) — the connection is
  marked stale immediately (retrying won't help until you fix it).
- **Transient errors** (`TIMEOUT`, `NETWORK_UNREACHABLE`, `UNKNOWN`) — retried after ~5 minutes,
  then ~1 hour; if it still can't connect, it is marked stale.

The event is emitted a single time on the healthy→stale transition (not on every failed probe).

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `io.datarecs.connection.connection.check_failed` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (`ConnectionCheckFailedPayload`)

```typescript
{
  connection_id: string;        // The connection that went stale
  error_class: string;          // AUTH_FAILED | CONFIG_INVALID | TIMEOUT | NETWORK_UNREACHABLE | UNKNOWN
  checked_at: string;           // ISO-8601 timestamp of the failing probe
  became_stale: boolean;        // true on the healthy→stale transition
  consecutive_failures?: number;// How many consecutive probes failed before going stale
}
```

`error_class` is a stable, leak-safe category — it never contains a DSN, host, username, password,
or connection string.

## What to do when you receive it

1. Fix the underlying connection (most often: re-enter rotated credentials, or restore network
   access to the database).
2. In the DataRecs console, open the connection and choose **Resume paused schedules**. Schedules
   resume only once the connection is healthy again; a schedule that was *also* paused by a
   different stale connection stays paused until that one is resolved too (partial resumability).

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import `ConnectionCheckFailedPayload` and validate with class-validator.
</Admonition>

<Admonition type="info">
Recovery is also automatic: once the health-check sees the connection is reachable again, DataRecs auto-resumes the schedules it paused for this connection. The manual **Resume paused schedules** action is for resuming immediately without waiting for the next check.
</Admonition>
