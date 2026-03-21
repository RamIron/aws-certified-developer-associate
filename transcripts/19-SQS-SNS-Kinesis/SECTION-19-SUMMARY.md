# Section 19 - AWS Integration & Messaging: SQS, SNS & Kinesis — Complete Reference

## Lessons

| # | Lesson | Udemy # | Status |
|---|--------|---------|--------|
| 19.1 | Section Introduction | 214 | ⏭ skipped |
| 19.2 | Introduction to Messaging | 215 | ✅ |
| 19.3 | Amazon SQS - Standard Queues Overview | 216 | ✅ PERFECT |
| 19.4 | SQS - Standard Queue Hands On | 217 | ✅ |
| 19.5 | SQS Queue Access Policy | 218 | ✅ PERFECT |
| 19.6 | SQS Message Visibility Timeout | 219 | ✅ PERFECT |
| 19.7 | SQS Dead Letter Queues | 220 | ✅ PERFECT |
| 19.8 | SQS Dead Letter Queues - Hands On | 221 | ✅ |
| 19.9 | SQS Delay Queues | 222 | ⚠️ REVIEW 50% |
| 19.10 | SQS Certified Developer Concepts | 223 | ✅ PASSED 75% |
| 19.11 | SQS FIFO Queues | 224 | ✅ PERFECT |
| 19.12 | SQS FIFO Queues Advanced | 225 | ⚠️ REVIEW 67% |
| 19.13 | Amazon SNS | 226 | ✅ PERFECT |
| 19.14 | SNS and SQS - Fan Out Pattern | 227 | ✅ PERFECT |
| 19.15 | SNS Hands On | 228 | ✅ |
| 19.16 | Amazon Kinesis Data Streams | 229 | ✅ PERFECT |
| 19.17 | Kinesis Data Streams - Hands On | 230 | ✅ |
| 19.18 | Amazon Data Firehose | 231 | ✅ PERFECT |
| 19.19 | Amazon Data Firehose - Hands On | 232 | ✅ |
| 19.20 | Amazon Managed Service for Apache Flink | 233 | ✅ |
| 19.21 | SQS vs SNS vs Kinesis | 234 | ✅ |
| — | Messaging & Integration Quiz | Quiz 16 | ✅ |

---

## 1. Communication Patterns

- **Synchronous:** Service A calls Service B directly (tightly coupled)
- **Asynchronous:** Service A sends message to a queue/topic, Service B picks it up (decoupled)
- Three decoupling services: **SQS** (queue), **SNS** (pub/sub), **Kinesis** (streaming)

---

## 2. Amazon SQS — Simple Queue Service

### Standard Queue
- Producers send → Queue stores → Consumers poll & delete
- **Unlimited throughput**, unlimited messages in queue
- Default retention: **4 days** (max 14 days)
- Max message size: **1,024 KB**
- At-least-once delivery, best-effort ordering
- Consumers poll up to **10 messages** at a time (`MaxNumberOfMessages`)

### Security
- In-flight: HTTPS | At-rest: KMS (SSE-SQS or SSE-KMS) | Client-side: your responsibility
- IAM policies for API access
- **SQS Access Policies** (resource-based) for cross-account access and S3 → SQS events

### Cross-Account Access Policy
- `Principal`: other account's ID array
- `Action`: `sqs:ReceiveMessage`

### S3 → SQS Access Policy
- `Principal`: `"*"` with Conditions:
  - `ArnLike`: bucket ARN
  - `StringEquals`: SourceAccount

### Visibility Timeout
- Default: **30 seconds** (range: 0 to 12 hours)
- Message invisible to others while consumer processes it
- Timeout too short → message processed **twice**
- Timeout too high → long delay if consumer crashes
- **`ChangeMessageVisibility`** API: extend timeout mid-processing

### Dead Letter Queue (DLQ)
- **MaximumReceives** threshold → message moves to DLQ after N failed reads
- DLQ type must match source queue type (FIFO → FIFO, Standard → Standard)
- Set DLQ retention to **14 days** (maximum time to debug)
- If message expires in source queue before hitting MaximumReceives → **lost forever**
- **Redrive to Source**: push messages from DLQ back to source queue after fixing consumer

### Delay Queue
- Delay messages before first poll (range: **0 to 15 minutes**)
- Queue-level default: "Delivery delay" setting
- Per-message override: **`DelaySeconds`** parameter
- Don't confuse with Visibility Timeout (that hides AFTER polling)

### Long Polling
- Consumer waits for messages if queue is empty (range: **1 to 20 seconds**, 20 recommended)
- Reduces API calls, lowers cost, decreases latency
- Enable at queue level (`Receive Message Wait Time`) or per-call (`ReceiveMessageWaitTimeSeconds`)
- Exam trigger: "too many API calls" or "high polling cost" → long polling

### SQS Extended Client (Large Messages)
- Max message = 1,024 KB. For larger payloads → upload to **S3**, send metadata pointer to SQS
- Java library but pattern works in any language

### Must-Know API Calls

| API | Purpose |
|-----|---------|
| `CreateQueue` | Create queue (arg: `MessageRetentionPeriod`) |
| `DeleteQueue` | Delete queue + all messages |
| `PurgeQueue` | Delete all messages, keep queue |
| `SendMessage` | Send message (arg: `DelaySeconds`) |
| `ReceiveMessage` | Poll (default: 1, max: 10 via `MaxNumberOfMessages`) |
| `DeleteMessage` | Remove after processing |
| `ChangeMessageVisibility` | Extend visibility timeout mid-processing |

**Batch variants:** `SendMessage`, `DeleteMessage`, `ChangeMessageVisibility` → fewer API calls, lower cost

### FIFO Queues
- **First In, First Out** — strict ordering guarantee
- Queue name must end with **`.fifo`**
- Throughput: **300 msg/s** without batching, **3,000 msg/s** with batching
- **Deduplication** (5-minute window):
  - Content-based: SHA-256 hash of body
  - Explicit: `MessageDeduplicationId` (overrides content-based if provided)
- **Message Group ID** (required): ordering within group, different groups = parallel consumers
- DLQ for FIFO must also be FIFO

---

## 3. Amazon SNS — Simple Notification Service

### Pub/Sub Model
- Producer publishes to **topic** → all **subscribers** receive the message
- One message, many receivers (unlike SQS: one message, one consumer)

### Subscribers (from AWS Console)
- Amazon Kinesis Data Firehose, Amazon SQS, AWS Lambda
- Email, Email-JSON, HTTP, HTTPS, SMS
- Email/SMS require **confirmation click** before receiving messages

### Publishers
- Your code (SDK), many AWS services natively (CloudWatch Alarms, S3 events, ASG, CloudFormation, etc.)

### Security
- Identical to SQS: HTTPS, KMS, IAM policies, SNS Access Policies (resource-based)

### SNS FIFO Topics
- Ordering + deduplication (same as SQS FIFO)
- Subscribers: **only SQS queues** (Standard and FIFO) — no Lambda, Email, HTTP, etc.
- Same throughput: 300/3,000 msg/s

### Message Filtering
- **JSON filter policy** on the **subscription** (not the topic)
- Only matching messages delivered to that subscriber
- No filter = receives **all messages**

### Fan Out Pattern
- SNS + SQS: push once to SNS → multiple SQS queues subscribe
- Decoupled, no data loss, cross-region supported
- S3 event limitation: one rule per event type + prefix → use fan out for multiple destinations
- SNS → **KDF → S3** for persisting/archiving messages

---

## 4. Amazon Kinesis Data Streams (KDS)

### Purpose
- Collect and store streaming data in **real-time**
- Exam keyword: **real-time** → think KDS

### Core Properties
- Retention: 1 day default, up to **365 days**
- Data is **immutable** — cannot delete, must wait for expiration
- **Replay** capability (unlike SQS/SNS)
- Ordering within same **partition ID**
- Max record: 10 MB

### Shards (Provisioned Mode)
- Shard = unit of **throughput** (not processing power)
- Per shard: **1 MB/s in** (1,000 records/s), **2 MB/s out**
- Scale manually — can only **double** shards per operation (1 → 2 → 4 → 8)
- Pay per shard per hour

### On-Demand Mode
- Default: **4 MB/s in**, **8 MB/s out** (same 2:1 ratio)
- Auto-scales based on past **30 days** throughput
- Pay per stream per hour + data volume

### Two Consumption Modes

| | Standard | Enhanced Fan-Out |
|--|----------|-----------------|
| **Model** | Consumer **pulls** | Kinesis **pushes** |
| **Throughput** | 2 MB/s per shard **shared** | 2 MB/s per shard **per consumer** |
| **Use when** | Few consumers | Many consumers |

### Optimized Libraries
- **KPL** (Kinesis Producer Library) = high-throughput producer
- **KCL** (Kinesis Client Library) = optimized consumer

### Key APIs (from Hands On)
- `put-record`: send record (requires partition key)
- `describe-stream`: get shard IDs
- `get-shard-iterator`: TRIM_HORIZON (beginning) or LATEST (new only)
- `get-records`: fetch batch (data is base64-encoded)

---

## 5. Amazon Data Firehose

### Purpose
- **Deliver** streaming data to destinations (fully managed, no code)
- Formerly called **Kinesis Data Firehose**
- Exam keyword: **near real-time** → think Firehose

### Why "Near Real-Time"
- Uses a **buffer** that flushes by size or time (minimum 60 seconds)

### Sources
- SDK, Kinesis Agent, KDS, CloudWatch Logs/Events, IoT

### Destinations
- **AWS:** S3, Redshift, OpenSearch
- **3rd Party:** Datadog, Splunk, New Relic, MongoDB
- **Custom:** any HTTP endpoint
- Failed data → backup S3 bucket

### Data Transformation
- Optional **Lambda** for custom transforms (e.g., CSV → JSON)
- Built-in conversion to Parquet/ORC
- Compression: GZIP, Snappy

### KDS vs Firehose

| | KDS | Firehose |
|--|-----|----------|
| **Latency** | Real-time | Near real-time |
| **Code** | Write your own | Fully managed |
| **Storage** | Up to 365 days | No storage |
| **Replay** | ✅ Yes | ❌ No |
| **Scaling** | Manual or on-demand | Automatic |

---

## 6. Amazon Managed Service for Apache Flink

- Real-time stream **processing/transformation** using Java, SQL, or Scala
- Reads from **KDS** and **Amazon MSK** (Managed Kafka)
- ⚠️ **Cannot read from Data Firehose** (exam trick!)
- Fully managed: auto-scaling, parallel computation, checkpoints/snapshots

---

## Consolidated Exam Tips

### Quick Decision Guide
- **"decouple", "work queue", "pull"** → SQS
- **"pub/sub", "fan out", "many subscribers"** → SNS
- **"real-time", "replay", "analytics", "ETL"** → KDS
- **"near real-time", "load into S3/Redshift"** → Data Firehose
- **"stream transformation"** → Apache Flink

### Numbers to Memorize
| Item | Value |
|------|-------|
| SQS max message size | 1,024 KB |
| SQS default retention | 4 days (max 14) |
| SQS visibility timeout default | 30 seconds (max 12 hours) |
| SQS delay queue max | 15 minutes |
| SQS long polling range | 1–20 seconds (20 recommended) |
| SQS MaxNumberOfMessages | 1 default, 10 max |
| SQS FIFO throughput | 300 msg/s (3,000 with batch) |
| FIFO deduplication window | 5 minutes |
| SNS max subscribers per topic | 12,500,000 |
| KDS retention | 1–365 days |
| KDS per shard in/out | 1 MB/s in, 2 MB/s out |
| KDS on-demand default | 4 MB/s in, 8 MB/s out |
| Firehose buffer minimum interval | 60 seconds |

### Common Exam Traps
- Message processed twice → visibility timeout **too short**
- "Too many API calls" → enable **long polling**
- Large messages > 1,024 KB → **SQS Extended Client + S3**
- S3 one rule per event+prefix → use **fan out** (SNS + SQS)
- SNS data is **not persisted** — if not delivered, it's lost
- Flink **cannot** read from Firehose
- SNS FIFO topics: **only SQS queues** as subscribers
- Explicit `MessageDeduplicationId` **overrides** content-based dedup
- Shard scaling: can only **double** per operation
