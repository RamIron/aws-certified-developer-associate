# Section 20 Summary — AWS Monitoring & Audit: CloudWatch, X-Ray and CloudTrail

## Lessons

| # | Lesson | Status |
|---|--------|--------|
| 20.1 | AWS Monitoring - Section Introduction | ✅ Completed (intro) |
| 20.2 | Monitoring Overview in AWS | ✅ Completed (overview) |
| 20.3 | CloudWatch Metrics | ✅ PERFECT |
| 20.4 | CloudWatch Custom Metrics | ⚠️ REVIEW 0% |
| 20.5 | CloudWatch Logs | ✅ PASSED 75% |
| 20.6 | CloudWatch Logs - Hands On | ✅ Completed |
| 20.7 | CloudWatch Logs - Live Tail - Hands On | ✅ Completed |
| 20.8 | CloudWatch Agent & Logs Agent | ✅ PERFECT |
| 20.9 | CloudWatch Logs - Metric Filters | ✅ Completed |
| 20.10 | CloudWatch Logs - Metric Filters Hands On | ✅ Completed |
| 20.11 | CloudWatch Alarms | ✅ PERFECT |
| 20.12 | CloudWatch Alarms Hands On | ✅ Completed |
| 20.13 | CloudWatch Synthetics | ✅ PERFECT |
| 20.14 | Amazon EventBridge | ✅ PERFECT |
| 20.15 | Amazon EventBridge - Hands On | ✅ Completed |
| 20.16 | Amazon EventBridge - Multi-Account Aggregation | ✅ Completed |
| 20.17 | X-Ray Overview | ✅ PASSED 75% |
| 20.18 | X-Ray Hands On | ✅ Completed |
| 20.19 | X-Ray: Instrumentation and Concepts | ⚠️ REVIEW 67% |
| 20.20 | X-Ray: Sampling Rules | ✅ Completed |
| 20.21 | X-Ray APIs | ✅ PERFECT |
| 20.22 | X-Ray with Beanstalk | ✅ Completed |
| 20.23 | X-Ray & ECS | ✅ PERFECT |
| 20.24 | AWS Distro for OpenTelemetry | ✅ Completed |
| 20.25 | CloudTrail | ✅ PERFECT |
| 20.26 | CloudTrail Hands On | ✅ Completed |
| 20.27 | CloudTrail - EventBridge Integration | ✅ Completed |
| 20.28 | CloudTrail vs CloudWatch vs X-Ray | ✅ Completed |
| 20.29 | AWS Quick Clean-Up | ✅ Completed |
| — | Monitoring & Audit Quiz (Quiz 17) | ✅ Completed |

---

## The Big Three: CloudWatch vs X-Ray vs CloudTrail

| Service | Purpose | One-liner |
|---------|---------|-----------|
| **CloudWatch** | **Monitoring** | How are my resources and apps performing? |
| **X-Ray** | **Tracing** | Where is the bottleneck in my distributed app? |
| **CloudTrail** | **Audit** | Who did what and when? |

---

## CloudWatch Metrics
> *How often data is collected and published to CloudWatch*

### Built-in Metrics
- Every AWS service pushes metrics to CloudWatch
- **Namespace** groups metrics by service (e.g., `AWS/EC2`)
- **Dimensions** = attributes (e.g., `InstanceId`) — up to **30 per metric**
- EC2 default monitoring: every **5 min** | Detailed: every **1 min** (extra cost)
- **RAM/memory is NOT a default metric** — must push as custom metric

### Custom Metrics (`PutMetricData` API)
- Push your own metrics: RAM, disk, logged-in users, anything
- **StorageResolution**: `60` = standard (1 min) | `1` = high-res (1 sec, retained **3 hours**)
- High-res read periods: 1s, 5s, 10s, 30s, 60s+
- Accepts timestamps: **2 weeks past**, **2 hours future**

---

## CloudWatch Logs
> *What your applications output — store, search, and export log data*

### Structure
- **Log Group** = your application
- **Log Stream** = specific instance/container within the group
- Retention: **1 day to 10 years** (or never expire)
- Encrypted by default, optional KMS

### Sources
SDK, CloudWatch Unified Agent, Elastic Beanstalk, ECS, Lambda, VPC Flow Logs, API Gateway, CloudTrail, Route 53

### Export Options

| Method | Destination | Speed | How |
|--------|------------|-------|-----|
| Batch | S3 | Up to **12 hours** | `CreateExportTask` API |
| Real-time | KDS, KDF, Lambda | Streaming | Subscription Filters |

- Max **2 subscription filters** per log group
- Cross-account aggregation: subscription filter + destination access policy + IAM role with `kinesis:PutRecord`

### Logs Insights
- Query engine for historical log data (**NOT real-time**)
- Can query multiple log groups across accounts

### Live Tail
- **Real-time** log viewer
- ~1 hour/day free

---

## CloudWatch Agents
> *Software installed on EC2 to push logs and extra metrics (RAM, disk, etc.)*

| | Logs Agent (OLD) | Unified Agent (NEW) |
|--|-----------------|---------------------|
| Logs | ✅ | ✅ |
| Metrics | ❌ | ✅ (RAM, swap, processes, disk I/O, netstat) |
| Config | Manual | **SSM Parameter Store** |
| Status | Deprecated | **Use this one** |

**Key distinction:** EC2 pushes **metrics by default** (CPU, disk, network) but **zero logs by default**. Need agent + IAM role for logs.

---

## CloudWatch Metric Filters
> *Turn log patterns into metrics — then trigger alarms on them*

- Scan logs for patterns → create CloudWatch Metrics
- **NOT retroactive** — only new events after filter creation
- Up to **3 dimensions** per filter
- Chain: **Logs → Metric Filter → Metric → Alarm → SNS**

---

## CloudWatch Alarms
> *How often the alarm evaluates a metric and triggers actions (different from how often data is collected!)*

### Three States
`OK` → `INSUFFICIENT_DATA` → `ALARM`

### Three Targets
1. **EC2 Actions** — stop, terminate, reboot, recover
2. **Auto Scaling** — scale out/in
3. **SNS** — notifications → Lambda for custom actions

### Composite Alarms
- Combine multiple alarms with **AND/OR** logic
- Reduces alarm noise
- Monitors alarm **states**, not metrics directly

### EC2 Instance Recovery
- Triggered by **StatusCheckFailed_System**
- Preserves: private IP, public IP, Elastic IP, metadata, placement group

### Testing
- `set-alarm-state` CLI — force alarm into any state without real incident

---

## CloudWatch Synthetics Canary
> *Automated scripts that test your endpoints from the outside — like a robot user*

- Scripts that **simulate user behavior** (proactive monitoring)
- Written in **Node.js or Python** with **headless Google Chrome**
- Run once or on a schedule

### 6 Blueprints

| Blueprint | Purpose |
|-----------|---------|
| Heartbeat Monitor | Load URL, take screenshots |
| API Canary | Test REST API read/write |
| Broken Link Checker | Find dead links |
| Visual Monitoring | Screenshot comparison vs baseline |
| Canary Recorder | Record actions → auto-generate script |
| GUI Workflow Builder | Verify form workflows (login, checkout) |

---

## Amazon EventBridge (formerly CloudWatch Events)
> *React to events in real-time — "when X happens, do Y"*

### Two Modes
1. **Schedule/Cron** — "Every hour, trigger Lambda"
2. **Event Pattern** — React when something happens

### Three Event Buses

| Bus | Source |
|-----|--------|
| **Default** | AWS services (EC2, S3, CodeBuild, CloudTrail) |
| **Partner** | SaaS partners (Zendesk, Datadog, Auth0) |
| **Custom** | Your own apps (AWS or on-premises) |

### Key Features
- **Archive & Replay** — archive events, replay for debugging (indefinite or set retention)
- **Schema Registry** — auto-discovers event JSON structure, generates code bindings, supports versioning
- **Resource-based policies** — cross-account event bus access (`events:PutEvents`)
- Multi-account aggregation: event rule target can be an event bus in another account

### Cross-Account Policy
```json
{
  "Effect": "Allow",
  "Action": "events:PutEvents",
  "Principal": { "AWS": "111122223333" },
  "Resource": "arn:aws:events:us-east-1:123456789012:event-bus/central-event-bus"
}
```

---

## AWS X-Ray
> *Trace requests across microservices — find where things break or slow down*

### What It Does
- Visual service map of distributed applications
- Trace requests end-to-end across all services
- Identify bottlenecks, errors, latency issues

### Terminology

| Term | Meaning |
|------|---------|
| **Trace** | End-to-end journey of one request |
| **Segment** | One service's contribution to the trace |
| **Sub-segment** | Granular detail within a segment |
| **Annotations** | Key-value pairs, **indexed**, searchable |
| **Metadata** | Key-value pairs, **NOT indexed**, not searchable |

### Enabling X-Ray (Two Things Required)
1. **Import X-Ray SDK** in your code (Java, Python, Go, Node.js, .NET)
2. **Run X-Ray Daemon** (UDP packet interceptor, sends batch every 1s)
   - EC2/on-premises: install yourself
   - Lambda/managed: runs automatically

### Sampling Rules
- Default: **reservoir 1 req/s** + **rate 5%**
- Custom rules: change in console, **no restart needed**, daemon picks up automatically
- Priority: lower number = higher priority (default = 10,000)

### Write APIs (`AWSXRayWriteOnlyAccess`)

| API | Purpose |
|-----|---------|
| PutTraceSegments | Upload segment documents |
| PutTelemetryRecords | Upload daemon health metrics |
| GetSamplingRules | Read sampling rules (needed for writing) |
| GetSamplingTargets | Advanced sampling |
| GetSamplingStatisticsSummaries | Advanced sampling |

### Read APIs

| API | Purpose |
|-----|---------|
| GetServiceGraph | Main visual service map |
| GetTraceSummaries | Trace IDs + annotations for a time range |
| BatchGetTraces | Full trace details by ID |
| GetTraceGraph | Service graph for specific traces |

### X-Ray with Beanstalk
- Daemon already included — enable via console or `.ebextensions/xray-daemon.config`
- Default Beanstalk EC2 role has X-Ray permissions
- Multi-Docker → manage daemon yourself

### X-Ray with ECS (Three Patterns)

| Pattern | Launch Type | How |
|---------|------------|-----|
| Daemon Container | EC2 only | 1 daemon per instance |
| Side Car | EC2 | 1 daemon per app container |
| Side Car | **Fargate** | **Only option** — 1 daemon per task |

Task definition config: port **2000/UDP**, env var `AWS_XRAY_DAEMON_ADDRESS`, link containers

### Troubleshooting

| Platform | Check |
|----------|-------|
| EC2 | IAM role + daemon running? |
| Lambda | IAM execution role (`AWSXRayWriteOnlyAccess`) + SDK imported + **Active Tracing** enabled? |

---

## AWS Distro for OpenTelemetry
> *Open-source alternative to X-Ray SDK — send traces to multiple destinations*

- **Open-source** alternative to X-Ray
- Send traces to **multiple destinations** (X-Ray + Datadog + Prometheus)
- **Auto-instrumentation** (no code changes)
- Exam: "open-source tracing" or "multiple destinations" → OpenTelemetry

---

## CloudTrail
> *Audit log — who made which API call and when (security camera for your AWS account)*

### What It Does
- **Audit** — records who did what and when (API calls)
- **Enabled by default**
- Logs from: console, SDK, CLI, IAM users/roles, AWS services

### Three Event Types

| Type | Logged by default? | Examples |
|------|-------------------|----------|
| **Management Events** | ✅ Yes | CreateSubnet, AttachRolePolicy, TerminateInstances |
| **Data Events** | ❌ No (high volume) | S3 GetObject/PutObject, Lambda Invoke |
| **Insights Events** | ❌ Must enable + pay | Detects unusual activity vs baseline |

### Retention
- Default: **90 days**
- Long-term: send to **S3** → query with **Athena**

### CloudTrail + EventBridge Integration
- Any API call → CloudTrail → EventBridge → SNS/Lambda
- "React to any API call in real time"

---

## Consolidated Exam Tips

### CloudWatch
- Default EC2 metrics = 5 min, detailed = 1 min. **RAM is NOT default**
- Custom metrics: `PutMetricData`, `StorageResolution=1` for high-res (3h retention)
- Logs: batch to S3 = `CreateExportTask` (12h), real-time = Subscription Filters
- Logs Insights = query engine, **NOT real-time**
- Unified Agent = logs + granular metrics, configured via **SSM Parameter Store**
- Metric Filters: **NOT retroactive**, max 3 dimensions
- Alarms: 3 states (OK, INSUFFICIENT_DATA, ALARM), 3 targets (EC2, ASG, SNS)
- Composite Alarms: AND/OR to reduce noise
- EC2 recovery: same IPs, metadata, placement group
- Test alarms: `set-alarm-state` CLI
- Synthetics Canary: Node.js/Python + headless Chrome, 6 blueprints

### EventBridge
- Formerly **CloudWatch Events**
- Cron jobs in AWS → EventBridge
- Three buses: Default, Partner, Custom
- Archive & Replay for debugging
- Schema Registry: auto-discover event structure + code bindings
- Cross-account: resource-based policy on event bus
- Any API call → CloudTrail + EventBridge

### X-Ray
- Two things: **X-Ray SDK** in code + **daemon** running
- "Works locally but not on EC2" → daemon not running or missing IAM role
- Annotations = indexed (searchable), Metadata = NOT indexed
- Default sampling: reservoir 1/s + rate 5%
- Sampling rules changed in console → no restart needed
- Write APIs: PutTraceSegments, PutTelemetryRecords + GetSamplingRules
- Beanstalk: daemon built-in, enable via `.ebextensions`
- ECS Fargate: **Side Car only** (port 2000/UDP)
- Lambda: IAM role + SDK + **Active Tracing**
- OpenTelemetry: open-source, multi-destination, auto-instrumentation

### CloudTrail
- Who did what and when → **CloudTrail**
- Enabled by default
- Management Events = default. Data Events = NOT default
- Beyond 90 days → **S3 + Athena**
- CloudTrail + EventBridge = react to any API call
