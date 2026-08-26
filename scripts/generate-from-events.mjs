#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogRoot = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
let eventsPackagePath = path.resolve(catalogRoot, '../data-models-events');
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--events-path' && args[i + 1]) {
    eventsPackagePath = path.resolve(args[i + 1]);
  }
}

const DOMAIN_META = {
  tenant: { catalogSlug: 'tenant-management', name: 'Tenant Management', description: 'Tenant provisioning, domain checks, and admin notifications.', badgeLabel: 'Tenant Management' },
  identity: { catalogSlug: 'identity-access', name: 'Identity & Access', description: 'Authentication, users, invitations, groups, roles, and permissions.', badgeLabel: 'Identity & Access' },
  workspace: { catalogSlug: 'workspace-management', name: 'Workspace Management', description: 'Workspace lifecycle — creation, update, and deletion.', badgeLabel: 'Workspace Management' },
  connection: { catalogSlug: 'connection-management', name: 'Connection Management', description: 'Database connection CRUD, testing, and reservation lifecycle.', badgeLabel: 'Connection Management' },
  reconciliation: { catalogSlug: 'reconciliation', name: 'Reconciliation', description: 'Jobs, job groups, triggers, schedules, runs, and result processing.', badgeLabel: 'Reconciliation' },
  platform: { catalogSlug: 'platform-operations', name: 'Platform Operations', description: 'API keys, encryption, billing, and platform administration.', badgeLabel: 'Platform Operations' },
  audit: { catalogSlug: 'audit-evidence', name: 'Audit Evidence', description: 'Audit export, archive, retention, and integrity-verification lifecycle.', badgeLabel: 'Audit Evidence' },
  webhook: { catalogSlug: 'webhooks', name: 'Webhooks', description: 'Webhook endpoint management, subscription matching, and outbound delivery lifecycle.', badgeLabel: 'Webhooks' },
  notification: { catalogSlug: 'notifications', name: 'Notifications', description: 'Email delivery and tenant notification configuration lifecycle.', badgeLabel: 'Notifications' },
  migration: { catalogSlug: 'enterprise-migrations', name: 'Enterprise Migrations', description: 'Enterprise migration execution and step lifecycle.', badgeLabel: 'Enterprise Migrations' },
  support: { catalogSlug: 'support-operations', name: 'Support Operations', description: 'Tenant-homed support access and platform administration lifecycle.', badgeLabel: 'Support Operations' },
};

const SERVICE_META = {
  'core-api': {
    name: 'Core API',
    description: 'The central REST API that handles user requests, authentication, authorisation, and orchestration. Primary event producer for most domain events.\n\n- **Event Source URI**: `/datarecs/core-api`\n- **Technology**: NestJS (Node.js)',
    sendsDomains: ['tenant', 'identity', 'workspace', 'connection', 'reconciliation', 'platform', 'audit', 'support', 'webhook'],
    sendsExclude: ['connection.reservation.', 'reconciliation.run.', 'webhook.delivery.'],
    receivesPrefix: ['reconciliation.run.completed', 'reconciliation.run.errored', 'reconciliation.run.rows_processed'],
  },
  'connection-checker': {
    name: 'Connection Checker',
    description: 'gRPC microservice responsible for database connectivity validation, credential storage in OpenBao, and Kubernetes egress policy management.\n\n- **Event Source URI**: `/datarecs/connection-checker`\n- **Technology**: NestJS gRPC (Node.js)',
    sendsPrefix: ['connection.reservation.'],
    receivesPrefix: ['connection.connection.created', 'connection.connection.updated', 'connection.connection.deleted'],
  },
  'platform-agent': {
    name: 'Platform Agent',
    description: 'gRPC microservice for database introspection — listing databases, schemas, tables, and columns on tenant connections.\n\n- **Event Source URI**: `/datarecs/platform-agent`\n- **Technology**: NestJS gRPC (Node.js)',
    sendsPrefix: [],
    receivesPrefix: ['connection.reservation.created'],
  },
  'reconciliation-workers': {
    name: 'Reconciliation Workers',
    description: 'Ephemeral Node.js workers (extractors and comparators) that execute the actual data reconciliation.\n\n- **Event Source URI**: `/datarecs/reconciliation-worker`\n- **Technology**: Node.js (Turborepo)\n- **Execution**: Ephemeral K8s Jobs',
    sendsPrefix: ['reconciliation.run.'],
    receivesPrefix: ['reconciliation.job.triggered'],
  },
  'console': {
    name: 'Console',
    description: 'Angular SPA for logged-in users. Receives tenant-scoped real-time job-run updates through core-api, sourced from NATS JetStream.\n\n- **Technology**: Angular\n- **Event Delivery**: Core API real-time client channel',
    sendsPrefix: [],
    receivesPrefix: ['reconciliation.run.'],
  },
  'webhook-service': {
    name: 'Webhook Service',
    description: 'NATS JetStream consumer that matches tenant-scoped CloudEvents against webhook subscriptions and delivers them to registered HTTP endpoints with HMAC-SHA256 signing, retries, and dead-lettering.\n\n- **Event Source URI**: `/datarecs/webhook-service`\n- **Technology**: NestJS (Node.js)\n- **Delivery**: HTTP POST with exponential-backoff retry',
    sendsPrefix: ['webhook.delivery.'],
    receivesAllEvents: true,
  },
  'email-notifier': {
    name: 'Email Notifier',
    description: 'Tenant-scoped notification service that consumes reconciliation lifecycle events and emits durable email-delivery outcomes through NATS JetStream.\n\n- **Event Source URI**: `/datarecs/email-notifier`\n- **Technology**: NestJS (Node.js)',
    sendsPrefix: ['notification.email.'],
    receivesPrefix: ['reconciliation.run.'],
  },
  'enterprise-migrations': {
    name: 'Enterprise Migrations',
    description: 'Tenant-scoped migration service that emits migration and step lifecycle evidence through NATS JetStream.\n\n- **Event Source URI**: `/datarecs/enterprise-migrations`\n- **Technology**: NestJS (Node.js)',
    sendsPrefix: ['migration.'],
    receivesPrefix: [],
  },
};

const LIFECYCLE_GROUPS = {
  GROUP_CREATED: 'GroupLifecyclePayload', GROUP_UPDATED: 'GroupLifecyclePayload', GROUP_DELETED: 'GroupLifecyclePayload',
  GROUP_MEMBER_ADDED: 'GroupMembershipPayload', GROUP_MEMBER_REMOVED: 'GroupMembershipPayload',
  CUSTOM_ROLE_CREATED: 'CustomRoleLifecyclePayload', CUSTOM_ROLE_UPDATED: 'CustomRoleLifecyclePayload', CUSTOM_ROLE_DELETED: 'CustomRoleLifecyclePayload',
  USER_JOIN_REQUEST_APPROVED: 'JoinRequestDecisionPayload', USER_JOIN_REQUEST_DENIED: 'JoinRequestDecisionPayload',
  WORKSPACE_CREATED: 'WorkspaceLifecyclePayload', WORKSPACE_UPDATED: 'WorkspaceLifecyclePayload', WORKSPACE_DELETED: 'WorkspaceLifecyclePayload',
  CONNECTION_CREATED: 'ConnectionLifecyclePayload', CONNECTION_UPDATED: 'ConnectionLifecyclePayload', CONNECTION_DELETED: 'ConnectionLifecyclePayload',
  CONNECTION_RESERVED: 'ConnectionReservationPayload', CONNECTION_RESERVATION_UPDATED: 'ConnectionReservationPayload', CONNECTION_RESERVATION_DELETED: 'ConnectionReservationPayload',
  JOB_CREATED: 'JobLifecyclePayload', JOB_UPDATED: 'JobLifecyclePayload', JOB_DELETED: 'JobLifecyclePayload',
  JOB_GROUP_CREATED: 'JobGroupLifecyclePayload', JOB_GROUP_UPDATED: 'JobGroupLifecyclePayload', JOB_GROUP_DELETED: 'JobGroupLifecyclePayload',
  JOB_SCHEDULE_CREATED: 'JobScheduleLifecyclePayload', JOB_SCHEDULE_UPDATED: 'JobScheduleLifecyclePayload', JOB_SCHEDULE_DELETED: 'JobScheduleLifecyclePayload',
  API_KEY_CREATED: 'ApiKeyLifecyclePayload', API_KEY_UPDATED: 'ApiKeyLifecyclePayload', API_KEY_DELETED: 'ApiKeyLifecyclePayload',
  WEBHOOK_ENDPOINT_CREATED: 'WebhookEndpointLifecyclePayload', WEBHOOK_ENDPOINT_UPDATED: 'WebhookEndpointLifecyclePayload', WEBHOOK_ENDPOINT_DELETED: 'WebhookEndpointLifecyclePayload', WEBHOOK_ENDPOINT_DISABLED: 'WebhookEndpointLifecyclePayload',
  WEBHOOK_SUBSCRIPTION_CREATED: 'WebhookSubscriptionLifecyclePayload', WEBHOOK_SUBSCRIPTION_UPDATED: 'WebhookSubscriptionLifecyclePayload', WEBHOOK_SUBSCRIPTION_DELETED: 'WebhookSubscriptionLifecyclePayload',
  WEBHOOK_DELIVERY_FAILED: 'WebhookDeliveryPayload', WEBHOOK_DELIVERY_DEAD_LETTERED: 'WebhookDeliveryPayload',
  WEBHOOK_ENDPOINT_AUTO_DISABLED: 'WebhookEndpointAutoDisabledPayload',
  NOTIFICATION_EMAIL_SENT: 'EmailNotificationPayload', NOTIFICATION_EMAIL_FAILED: 'EmailNotificationPayload',
  MIGRATION_STARTING: 'MigrationStartingPayload', MIGRATION_STEP_COMPLETED: 'MigrationStepCompletedPayload',
  MIGRATION_STEP_FAILED: 'MigrationStepFailedPayload', MIGRATION_COMPLETED: 'MigrationCompletedPayload',
  MIGRATION_FAILED: 'MigrationFailedPayload',
  JOB_RUN_EXTRACTION_STARTED: 'ExtractionStartedPayload', JOB_RUN_EXTRACTION_COMPLETED: 'ExtractionCompletedPayload',
  JOB_RUN_EXTRACTION_ERRORED: 'ExtractionErroredPayload', JOB_RUN_COMPARISON_STARTED: 'ComparisonStartedPayload',
  JOB_RUN_COMPARISON_COMPLETED: 'ComparisonCompletedPayload', JOB_RUN_COMPARISON_ERRORED: 'ComparisonErroredPayload',
  JOB_RUN_STAGE_STARTED: 'StageStartedPayload', JOB_RUN_STAGE_COMPLETED: 'StageCompletedPayload',
  JOB_RUN_STAGE_ERRORED: 'StageErroredPayload',
};

function parseEventTypes(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const events = [];
  const regex = /^\s+(\w+)\s+=\s+'((\w+)\.(.+))'/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const [, enumKey, type, domain, entityAction] = match;
    const slug = entityAction.replace(/[_.]/g, '-');
    const name = entityAction.split('.').map(p => p.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(' ');
    events.push({ enumKey, type, domain, slug, name });
  }
  return events;
}

function parsePayloadSchemas(domainDir) {
  const schemas = {};
  if (!fs.existsSync(domainDir)) return schemas;
  for (const domainName of fs.readdirSync(domainDir)) {
    const indexPath = path.join(domainDir, domainName, 'index.ts');
    if (!fs.existsSync(indexPath)) continue;
    const content = fs.readFileSync(indexPath, 'utf-8');
    const classRegex = /export class (\w+Payload)\s*\{([\s\S]*?)^\}/gm;
    let classMatch;
    while ((classMatch = classRegex.exec(content)) !== null) {
      const [, className, body] = classMatch;
      const fields = [];
      const lines = body.split('\n');
      for (let index = 0; index < lines.length; index++) {
        const fieldMatch = lines[index].match(/^ {4}(?:@.*\s+)?(\w+)([!?]):\s*(.*)$/);
        if (!fieldMatch) continue;

        const [, fieldName, optMarker, firstTypeLine] = fieldMatch;
        const typeLines = [firstTypeLine];
        while (!/^ {4}\S.*;\s*(?:\/\/.*)?$/.test(lines[index]) && index + 1 < lines.length) {
          index += 1;
          typeLines.push(lines[index].trimEnd());
        }
        const fieldType = typeLines.join('\n')
          .replace(/;\s*(?:\/\/.*)?$/, '')
          .trim();
        fields.push({ fieldName, fieldType, optional: optMarker === '?' });
      }
      schemas[className] = fields;
    }
  }
  return schemas;
}

function getPayloadClassName(enumKey) {
  if (LIFECYCLE_GROUPS[enumKey]) return LIFECYCLE_GROUPS[enumKey];
  const parts = enumKey.toLowerCase().split('_');
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('') + 'Payload';
}

function formatSchema(fields) {
  if (!fields || fields.length === 0) return '{ /* schema not found — check data-models-events */ }';
  return '{\n' + fields.map(f => `  ${f.fieldName}${f.optional ? '?' : ''}: ${f.fieldType};`).join('\n') + '\n}';
}

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

function generateDomains(events) {
  const domains = new Set(events.map(e => e.domain));
  for (const domain of domains) {
    const meta = DOMAIN_META[domain];
    if (!meta) { console.warn(`  Warning: Unknown domain: ${domain}`); continue; }
    const dir = path.join(catalogRoot, 'domains', meta.catalogSlug);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, 'index.md'),
`---
id: ${meta.catalogSlug}
name: ${meta.name}
version: 0.1.0
---

${meta.description}

<Admonition type="info">
All events in this domain follow CloudEvents v1.0. The event \`type\` is also the NATS subject suffix: \`<domain>.<entity>.<action>\`.
</Admonition>
`);
  }
  return domains;
}

function generateEvents(events, allSchemas) {
  for (const event of events) {
    const meta = DOMAIN_META[event.domain];
    const badgeLabel = meta ? meta.badgeLabel : event.domain;
    const payloadClass = getPayloadClassName(event.enumKey);
    const schema = formatSchema(allSchemas[payloadClass]);
    const dir = path.join(catalogRoot, 'events', event.slug);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, 'index.md'),
`---
id: ${event.slug}
name: ${event.name}
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: ${badgeLabel}
    textColor: white
    backgroundColor: green
---

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | \`${event.type}\` |
| **datacontenttype** | \`application/json\` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (\`${payloadClass}\`)

\`\`\`typescript
${schema}
\`\`\`

<Admonition type="tip">
Schema defined in \`@datarecs/data-models-events\` — import and validate with class-validator.
</Admonition>
`);
  }
}

function generateServices(events) {
  for (const [serviceSlug, meta] of Object.entries(SERVICE_META)) {
    const sends = [];
    const receives = [];
    for (const event of events) {
      if (meta.sendsPrefix && meta.sendsPrefix.some(p => event.type.startsWith(p))) sends.push(event.slug);
      if (meta.sendsDomains) {
        const inDomain = meta.sendsDomains.includes(event.domain);
        const excluded = (meta.sendsExclude || []).some(p => event.type.startsWith(p));
        if (inDomain && !excluded && !sends.includes(event.slug)) sends.push(event.slug);
      }
      if (meta.receivesAllEvents) receives.push(event.slug);
      else if (meta.receivesPrefix && meta.receivesPrefix.some(p => event.type === p || event.type.startsWith(p))) receives.push(event.slug);
    }
    const dir = path.join(catalogRoot, 'services', serviceSlug);
    ensureDir(dir);
    let fm = `---\nid: ${serviceSlug}\nname: ${meta.name}\nversion: 0.1.0`;
    if (sends.length > 0) { fm += '\nsends:'; for (const s of sends) fm += `\n  - id: ${s}`; }
    if (receives.length > 0) { fm += '\nreceives:'; for (const r of receives) fm += `\n  - id: ${r}`; }
    fm += '\n---';
    fs.writeFileSync(path.join(dir, 'index.md'), `${fm}\n\n${meta.description}\n`);
  }
}

// --- Main ---
const eventTypesPath = path.join(eventsPackagePath, 'src/envelope/event-types.ts');
const domainsPath = path.join(eventsPackagePath, 'src/domains');

if (!fs.existsSync(eventTypesPath)) {
  console.error(`Cannot find event-types.ts at: ${eventTypesPath}`);
  console.error(`Use --events-path to specify the data-models-events location`);
  process.exit(1);
}

console.log(`Reading events from: ${eventsPackagePath}`);
const events = parseEventTypes(eventTypesPath);
console.log(`  Found ${events.length} event types`);
const allSchemas = parsePayloadSchemas(domainsPath);
console.log(`  Found ${Object.keys(allSchemas).length} payload schemas`);

console.log(`\nGenerating catalog...`);
const domains = generateDomains(events);
console.log(`  ${domains.size} domains`);
generateEvents(events, allSchemas);
console.log(`  ${events.length} events`);
generateServices(events);
console.log(`  ${Object.keys(SERVICE_META).length} services`);
console.log(`\nDone! Event catalog generated at: ${catalogRoot}`);
