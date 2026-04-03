# Section 21 Summary — AWS Serverless: Lambda

## Lessons

| # | Lesson | Status |
|---|--------|--------|
| 21.1 | AWS Lambda - Section Introduction | ✅ Completed (intro) |
| 21.2 | Serverless Introduction | ✅ Completed |
| 21.3 | AWS Lambda Overview | ✅ PERFECT |
| 21.4 | AWS Lambda First Hands-On | ✅ Completed |
| 21.5 | Lambda Synchronous Invocations | ✅ Completed |
| 21.6 | Lambda Synchronous Invocations Hands-On | ✅ Completed |
| 21.7 | Lambda & Application Load Balancer | ✅ Completed |
| 21.8 | Lambda & ALB Hands-On | ✅ Completed |
| 21.9 | Lambda Asynchronous Invocations & DLQ | ✅ Completed |
| 21.10 | Lambda Asynchronous Invocations Hands-On | ✅ Completed |
| 21.11 | Lambda & CloudWatch Events / EventBridge | ✅ Completed |
| 21.12 | Lambda & EventBridge Hands-On | ✅ Completed |
| 21.13 | Lambda & S3 Event Notifications | ✅ Completed |
| 21.14 | Lambda & S3 Event Notifications Hands-On | ✅ Completed |
| 21.15 | Lambda Event Source Mapping | ✅ PASSED 75% |
| 21.16 | Lambda Event Source Mapping Hands-On (SQS) | ✅ Completed |
| 21.17 | Lambda Event & Context Objects | ✅ Completed |
| 21.18 | Lambda Destinations | ✅ Completed |
| 21.19 | Lambda Destinations Hands-On | ✅ Completed |
| 21.20 | Lambda Permissions - IAM Roles & Resource Policies | ✅ Completed |
| 21.21 | Lambda Permissions Hands-On | ✅ Completed |
| 21.22 | Lambda Environment Variables | ✅ Completed |
| 21.23 | Lambda Environment Variables Hands-On | ✅ Completed |
| 21.24 | Lambda Monitoring & X-Ray Tracing | ✅ Completed |
| 21.25 | Lambda Monitoring & X-Ray Hands-On | ✅ Completed |
| 21.26 | Lambda@Edge & CloudFront Functions | ✅ PERFECT |
| 21.27 | Lambda in VPC | ✅ PERFECT |
| 21.28 | Lambda in VPC Hands-On | ✅ Completed |
| 21.29 | Lambda Function Performance | ✅ PERFECT |
| 21.30 | Lambda Function Performance Hands-On | ✅ Completed |
| 21.31 | Lambda Layers | ✅ Completed |
| 21.32 | Lambda Layers Hands-On | ✅ Completed |
| 21.33 | Lambda File Systems Mounting | ✅ PERFECT |
| 21.34 | Lambda Concurrency | ✅ PERFECT |
| 21.35 | Lambda Concurrency Hands-On | ✅ Completed |
| 21.36 | Lambda External Dependencies | ✅ Completed |
| 21.37 | Lambda External Dependencies Hands-On | ✅ Completed |
| 21.38 | Lambda & CloudFormation | ✅ Completed |
| 21.39 | Lambda & CloudFormation Hands-On | ✅ Completed |
| 21.40 | Lambda Container Images | ✅ Completed |
| 21.41 | Lambda Versions & Aliases | ✅ PERFECT |
| 21.42 | Lambda Versions & Aliases Hands-On | ✅ Completed |
| 21.43 | Lambda & CodeDeploy | ✅ Completed |
| 21.44 | Lambda Function URL | ✅ PERFECT |
| 21.45 | Lambda Function URL Hands-On | ✅ Completed |
| 21.46 | Lambda - CodeGuru Integration | ✅ Completed |
| 21.47 | Lambda Limits | ✅ Completed |
| 21.48 | Lambda Best Practices | ✅ Completed |
| — | AWS Lambda Quiz (Quiz 18) | ✅ Completed |

---

## Serverless Overview
> *You don't manage servers; AWS handles provisioning, scaling, patching, and availability*

### What Is Serverless?
- Serverless ≠ "no servers" — means **you don't manage them**
- Originally meant **FaaS (Function as a Service)** — pioneered by AWS Lambda
- Now includes any service where you don't provision servers

### Major Serverless Services
| Service | Purpose |
|---------|---------|
| **Lambda** | Run code (functions) without servers |
| **DynamoDB** | NoSQL database, scales automatically |
| **Cognito** | User identity / authentication |
| **API Gateway** | REST API front door |
| **S3** | Object storage |
| **SNS / SQS** | Messaging |
| **Kinesis Data Firehose** | Streaming delivery |
| **Aurora Serverless** | Database that scales on demand |
| **Step Functions** | Orchestrate workflows |
| **Fargate** | Run Docker containers without managing EC2 |

---

## Lambda Overview
> *Run code on demand, pay per invocation, scales automatically, 15-minute max execution*

### EC2 vs Lambda Comparison

| | EC2 | Lambda |
|---|---|---|
| **Servers** | You provision and manage | AWS manages |
| **Running** | Continuously (even idle) | On demand — only when invoked |
| **Scaling** | ASG (you configure) | Automatic |
| **Time limit** | Unlimited | Max **15 minutes** |
| **Billing** | Per hour/second (always on) | Per invocation + compute duration |

### Lambda Benefits & Pricing
**Benefits:**
- Pay per request + compute time
- **Free tier:** 1 million requests + 400,000 GB-seconds/month
- Integrated with tons of AWS services
- Easy monitoring via CloudWatch
- Up to **10 GB RAM** per function
- **More RAM = better CPU + network** (critical exam concept!)

**Pricing:**
- Per calls: first 1M free, then **$0.20 per 1M requests**
- Per duration: billed in **1ms increments**
- 400,000 GB-seconds free = 400,000s at 1 GB RAM = 3,200,000s at 128 MB RAM

### Supported Languages

| Language | Notes |
|----------|-------|
| **Node.js** | Most popular for exam |
| **Python** | Most popular for exam |
| Java | JVM-based |
| C# | .NET Core / PowerShell |
| Ruby | |
| Rust, Go, etc. | Via **Custom Runtime API** |
| **Container Images** | Must implement **Lambda Runtime API** (up to 10 GB) |

### Key Integrations
- **API Gateway** → REST API invokes Lambda
- **ALB** → HTTP load balancer invokes Lambda
- **Kinesis** → Real-time data transformation
- **DynamoDB** → Event streams → Lambda triggers
- **S3** → Event notifications (file created/deleted)
- **CloudFront** → Lambda@Edge
- **EventBridge** → React to AWS infrastructure events
- **CloudWatch Logs** → Stream logs to Lambda
- **SNS, SQS** → Message processing

---

## Synchronous Invocations
> *Caller waits for result; Lambda handles errors on request*

### How It Works
```
Client → invoke Lambda → wait... → get response
```

- Caller **waits** for the response
- **Errors must be handled on the client side** (retries, exponential backoff)
- Lambda does **NOT** retry for you in sync mode

### Services That Invoke Lambda Synchronously

| Service | Context |
|---------|---------|
| **ALB (Application Load Balancer)** | Sync HTTP → JSON → Lambda → JSON → HTTP |
| **API Gateway** | REST API endpoint |
| **CloudFront (Lambda@Edge)** | Edge function |
| **Cognito** | User auth triggers |
| **Step Functions** | Workflow orchestration |
| S3 Batch | Batch operations |
| Lex / Alexa | Chatbot |
| Kinesis Data Firehose | Stream transformation |

**Pattern:** If caller is **user-facing** → **synchronous**

---

## Lambda & ALB
> *Convert HTTP ↔ JSON; handle multi-value headers*

### HTTP → JSON Conversion (ALB to Lambda)
ALB converts HTTP request into **JSON event:**

```json
{
  "requestContext": { "elb": { "targetGroupArn": "..." } },
  "httpMethod": "GET",
  "path": "/lambda",
  "queryStringParameters": { "query": "1234ABCD" },
  "headers": { "connection": "keep-alive", "host": "..." },
  "body": "...",
  "isBase64Encoded": false
}
```

### JSON → HTTP Conversion (Lambda to ALB)
Lambda must return:

```json
{
  "statusCode": 200,
  "statusDescription": "200 OK",
  "headers": { "Content-Type": "text/html" },
  "body": "<h1>Hello from Lambda</h1>",
  "isBase64Encoded": false
}
```

### Multi-Value Headers
When same query parameter or header key appears multiple times:

```
GET /lambda?name=foo&name=bar
```

**Without** multi-value: only one value kept.
**With** multi-value: **both values kept as array:**

```json
{
  "queryStringParameters": { "name": ["foo", "bar"] }
}
```

---

## Asynchronous Invocations
> *Fire and forget; Lambda retries 3x; DLQ on failure; idempotency required*

### How It Works
```
S3 (new file) ──→ ┌──────────────┐ ──→ Lambda function
                   │ Event Queue  │
SNS topic ──────→ │  (internal)  │ ──→ Lambda function
                   └──────────────┘
```

Caller fires and forgets — Lambda processes from internal queue.

### Automatic Retries
If Lambda fails, it **retries automatically** — 3 total attempts:

```
Attempt 1: immediately
Attempt 2: 1 minute after failure
Attempt 3: 2 minutes after attempt 2
```

**Critical:** Function must be **idempotent** (same result regardless of retries) because events may be processed multiple times.

### Dead-Letter Queue (DLQ)
After 3 retries fail, event sent to **DLQ** for investigation:

```
Event → Lambda → fail → retry 1 → fail → retry 2 → fail → DLQ (SQS or SNS)
```

### Services That Invoke Lambda Asynchronously

| Service | Use Case |
|---------|----------|
| **S3** | Event notifications (new file, delete, etc.) |
| **SNS** | React to topic notifications |
| **CloudWatch Events / EventBridge** | React to AWS infrastructure events |
| CodeCommit | New branch, tag, push |
| CodePipeline | Invoke during pipeline (must callback) |
| CloudWatch Logs | Log processing |
| SES | Email handling |
| CloudFormation | Custom resources |
| Config | Rule evaluations |
| IoT / IoT Events | Device events |

---

## Lambda & EventBridge
> *Serverless CRON jobs and event-driven architecture*

### Two Integration Patterns

**1. Serverless CRON / Rate:**
```
EventBridge Rule (every 1 hour)
         ↓
      Lambda (perform scheduled task)
```

**2. React to AWS Events:**
```
CodePipeline state changes
         ↓
  EventBridge Rule (on state change)
         ↓
      Lambda (perform task)
```

Both are **asynchronous invocations** — EventBridge fires events and Lambda processes from internal queue.

---

## Lambda & S3 Event Notifications
> *Classic pattern: S3 event → Lambda → Database; enable versioning for concurrent writes*

### S3 Event Notification Flow
```
                    ┌──→ SNS ──→ fan out to multiple SQS
                    │
S3 event ───────────┼──→ SQS ──→ Lambda reads from queue
                    │
                    └──→ Lambda (async invocation)
                              │
                              └──→ DLQ (SQS) on failure
```

### Versioning Matters
- S3 events typically deliver in **seconds** (sometimes 1+ minute)
- If two writes to **same object** happen simultaneously → you may only get **one notification**
- **Fix:** Enable **versioning** on bucket to guarantee all notifications received

### Typical Use Case
```
S3 bucket (new file)
       ↓ (async)
    Lambda (process file)
       ↓
  DynamoDB or RDS (store results)
```

---

## Event Source Mapping
> *Lambda polls source; three invocation models; streams maintain order; SQS scales differently*

### The Three Invocation Models

| Model | Trigger | Waits? | Retries | Services |
|-------|---------|--------|---------|----------|
| **Synchronous** | User/service direct | Yes | Client handles | ALB, API GW, CLI |
| **Asynchronous** | Service fires event | No | Lambda 3x → DLQ | S3, SNS, EventBridge |
| **Event Source Mapping** | Lambda polls source | Polls then sync invoke | Depends on source | Kinesis, DDB Streams, SQS |

### Streams (Kinesis Data Streams & DynamoDB Streams)

**Key concepts:**
- **Shard** = one lane in stream. Records distributed by partition key
- Creates **iterator per shard** — items processed **in order** per shard
- **Start position (configured once):**
  - `LATEST` — only new records from now on
  - `TRIM_HORIZON` — from the very beginning
  - `AT_TIMESTAMP` — from specific point in time
- Processed items **NOT removed** — stay until expiration (24h–365 days)
- **Low traffic:** use batch window to accumulate records
- **High traffic:** enable parallelization — up to **10 batch processors per shard**

**Parallelization Factor:**
```
Example: 4 shards, parallelization factor = 5

  Shard 1 → 5 Lambda instances  ┐
  Shard 2 → 5 Lambda instances  │
  Shard 3 → 5 Lambda instances  ├→ Total: 4 × 5 = 20 concurrent Lambdas
  Shard 4 → 5 Lambda instances  ┘
```

Max parallelization factor = **10** → 4 shards × 10 = **40** concurrent Lambdas max.

**Stream Error Handling:**
- **Entire batch reprocessed** until success or items expire
- Processing for that **shard is paused** (blocks the shard!)
- Options: **discard old events** (send to Destination), **limit retry attempts**, **split batch on error**

### Queues (SQS & SQS FIFO)

- Event Source Mapping **polls SQS** using **Long Polling**
- Batch size: **1 to 10 messages**
- Recommended: queue visibility timeout = **6x Lambda timeout**
- DLQ? Set on **SQS**, NOT on Lambda (Lambda DLQ only for async)
- Successfully processed items **deleted from queue**
- May receive **same item twice** → function must be **idempotent**

**SQS Standard vs FIFO Scaling:**

| Feature | SQS Standard | SQS FIFO |
|---------|--------------|----------|
| **Order** | No guarantee | In-order per Message Group ID |
| **Scaling** | Adds 60 instances/min, up to **1,000 batches/sec** | Scales to **# of active message groups** |
| **On error** | Batch items returned individually | Processed in order per group |

---

## Event & Context Objects
> *Event = what happened; Context = where it's running*

### Event Object — "What happened"
JSON document from invoking service containing data to process.

**Example structures vary by source:**

```python
# EventBridge event
event = {
    "source": "aws.events",
    "detail-type": "Scheduled Event",
    "region": "eu-west-1",
    "detail": { ... }
}

# S3 event
event = {
    "Records": [{
        "s3": {
            "bucket": { "name": "my-bucket" },
            "object": { "key": "photo.jpg" }
        }
    }]
}

# SQS event
event = {
    "Records": [{
        "body": "hello world",
        "messageAttributes": { "foo": { "stringValue": "bar" } },
        "eventSource": "aws:sqs",
        "messageId": "abc-123"
    }]
}

# ALB event
event = {
    "httpMethod": "GET",
    "path": "/lambda",
    "queryStringParameters": { "name": "foo" },
    "headers": { "host": "example.com" },
    "body": None,
    "isBase64Encoded": False
}
```

### Context Object — "Where it's running"
Metadata about invocation and runtime environment. **Same structure regardless of source.**

```python
context.aws_request_id                  # Unique ID for invocation
context.function_name                   # "lambda-demo"
context.function_arn                    # Full ARN
context.memory_limit_in_mb              # 128, 256, etc.
context.log_group_name                  # CloudWatch Log Group
context.log_stream_name                 # CloudWatch Log Stream
context.function_version                # "$LATEST" or version number
context.invoked_function_arn            # ARN with alias/version
context.get_remaining_time_in_millis()  # Time left before timeout
```

---

## Lambda Destinations
> *Modern replacement for DLQ; supports success events; more targets*

### Destinations for Asynchronous Invocations
Configure **two destinations** — one for success, one for failure:

```
                      ┌──────────────────────────┐
                      │ Success Destination       │
                 ✅ → │ (SQS, SNS, Lambda,       │
                      │  EventBridge)             │
S3 event → Lambda ───┤    └──────────────────────┘
                 │    ┌──────────────────────────┐
                 ❌ → │ Failure Destination       │
                      │ (SQS, SNS, Lambda,       │
                      │  EventBridge)             │
                      └──────────────────────────┘
```

### Destinations vs DLQ

| | DLQ (old) | Destinations (new, recommended) |
|---|---|---|
| **Success events** | ❌ No | ✅ Yes |
| **Failure events** | ✅ Yes | ✅ Yes |
| **Targets** | SQS, SNS | SQS, SNS, Lambda, EventBridge |
| **Recommendation** | Still works | **Use this** |

### Destinations for Event Source Mapping
Only for **discarded batches** (failure only):

```
Kinesis / DDB Stream
       ↓
  Event Source Mapping → Lambda → keeps failing
                                       ↓
                              Discarded batch
                                       ↓
                              ┌──────────────────┐
                              │ Failed Destination │
                              │ (SQS or SNS)      │
                              └──────────────────┘
```

**Key difference:** Event Source Mapping destinations are **failure only** (no success destination). Targets limited to **SQS or SNS** (no Lambda/EventBridge).

---

## Lambda Permissions
> *Execution Role = what Lambda can do; Resource-Based Policy = who can invoke*

### Two Permission Mechanisms

```
┌─────────────────────────────────────────────────────────┐
│  EXECUTION ROLE (IAM Role)                              │
│  "What can my Lambda function ACCESS?"                  │
│                                                         │
│  Lambda ──→ read SQS? → IAM Role with SQS              │
│  Lambda ──→ write DDB? → IAM Role with DDB             │
│  Lambda ──→ write logs? → IAM Role with CloudWatch     │
│                                                         │
│  Used when: Lambda PULLS or CALLS other services        │
├─────────────────────────────────────────────────────────┤
│  RESOURCE-BASED POLICY                                  │
│  "Who can INVOKE my Lambda function?"                   │
│                                                         │
│  S3 wants to invoke Lambda? → Resource-based policy     │
│  ALB wants to invoke Lambda? → Resource-based policy    │
│  EventBridge wants to invoke? → Resource-based policy   │
│                                                         │
│  Used when: Other services PUSH events to Lambda        │
└─────────────────────────────────────────────────────────┘
```

### Common Managed Execution Roles

| Managed Policy | Grants Permission To |
|---|---|
| **AWSLambdaBasicExecutionRole** | Write logs to CloudWatch |
| **AWSLambdaKinesisExecutionRole** | Read from Kinesis |
| **AWSLambdaDynamoDBExecutionRole** | Read from DynamoDB Streams |
| **AWSLambdaSQSQueueExecutionRole** | Read from SQS |
| **AWSLambdaVPCAccessExecutionRole** | Deploy Lambda in VPC |
| **AWSXRayDaemonWriteAccess** | Upload trace data to X-Ray |

**Best practice:** **One execution role per function** (don't share roles).

### When Is Each Used?

**Execution Role needed when:**
- Event Source Mapping (Lambda polls) → read from Kinesis/SQS/DDB
- Lambda calls another service → write to S3/DynamoDB
- Lambda writes logs → CloudWatch permissions

**Resource-Based Policy needed when:**
- S3 invokes Lambda (async)
- ALB invokes Lambda (sync)
- EventBridge invokes Lambda (async)
- Another AWS account invokes Lambda (cross-account)

### Cross-Account Access
An IAM principal can access Lambda if **either** is true:

```
Option A: IAM policy on PRINCIPAL allows it
  (e.g., your IAM user has AdministratorAccess)

         OR

Option B: Resource-based policy on LAMBDA allows it
  (e.g., S3 service is authorized to invoke)
```

---

## Environment Variables
> *4 KB limit; key-value pairs; encrypt secrets with KMS*

### Basics
- **Key-value pairs** (string form)
- **Max size: 4 KB** for all combined
- Adjust function behavior **without changing code**
- Lambda adds **system environment variables** automatically

### Encryption with KMS

```
┌──────────────────────────────────────────────┐
│  Encryption Options                          │
│                                              │
│  1. Lambda service key (default, free)       │
│     → AWS manages the key                    │
│                                              │
│  2. Customer Master Key (CMK)                │
│     → You manage the key in KMS              │
│     → More control, can audit usage          │
└──────────────────────────────────────────────┘
```

---

## Monitoring & X-Ray Tracing
> *CloudWatch Logs automatic; X-Ray requires Active Tracing + SDK + IAM role*

### CloudWatch Logs
- Lambda execution logs → **automatically** stored in CloudWatch Logs
- Requires: IAM execution role with CloudWatch permissions (in **BasicExecutionRole**)

### CloudWatch Metrics

| Metric | What It Shows |
|--------|--------------|
| **Invocations** | Number of times function called |
| **Duration** | How long each execution took |
| **Concurrent Executions** | How many instances running simultaneously |
| **Error Count** | Number of failed invocations |
| **Success Rate** | % of successful invocations |
| **Throttles** | Invocations rejected due to concurrency limits |
| **Async Delivery Failures** | Failed async invocations |
| **Iterator Age** | How far behind Lambda is reading from Kinesis/DDB (lag) |

### X-Ray Tracing Enable Path

```
┌────────────────────────────────────────────────┐
│  Step 1: Enable "Active Tracing" in Lambda     │
│          (Lambda runs X-Ray daemon for you)    │
│                                                │
│  Step 2: Use X-Ray SDK in your code            │
│                                                │
│  Step 3: IAM execution role must have:         │
│          AWSXRayDaemonWriteAccess              │
└────────────────────────────────────────────────┘
```

No need to install daemon manually — Lambda handles it when Active Tracing enabled.

### X-Ray Environment Variables
When you enable Active Tracing, Lambda **automatically** sets these 3 env vars:

| Variable | What It Does | Exam relevance |
|----------|-------------|-----------------|
| `_X_AMZN_TRACE_ID` | The tracing header — unique trace ID following request across services | Needed to propagate trace to downstream service |
| `AWS_XRAY_CONTEXT_MISSING` | What happens when code tries to use X-Ray but no active trace context. Default: `LOG_ERROR` | Rarely tested — default is `LOG_ERROR` |
| **`AWS_XRAY_DAEMON_ADDRESS`** | **IP:PORT** of X-Ray daemon (e.g., `169.254.79.129:2000`). SDK uses this to send trace data | **Most important for exam** — how SDK finds daemon |

---

## Lambda@Edge & CloudFront Functions
> *Two types of edge functions; Lambda@Edge more powerful; CloudFront Functions ultra-fast*

### Why Edge Functions?
- Applications deployed in specific region, CloudFront distributes via **edge locations worldwide**
- Sometimes need to execute logic **at the edge** before reaching origin
- Fully **serverless**, deployed globally, pay per use

### The 4 Stages of a CloudFront Request

```
          ┌──────────┐
          │  Client   │
          └────┬──┬───┘
               │  ▲
    Viewer     │  │  Viewer
    Request ①  │  │  Response ④
               ▼  │
          ┌──────────┐
          │CloudFront│
          └────┬──┬───┘
               │  ▲
    Origin     │  │  Origin
    Request ②  │  │  Response ③
               ▼  │
          ┌──────────┐
          │  Origin   │
          └──────────┘

  CloudFront Functions  →  ① ④ only (viewer side)
  Lambda@Edge           →  ① ② ③ ④  (all stages)
```

### Comparison Table

| Feature | CloudFront Functions | Lambda@Edge |
|---------|---------------------|-------------|
| **Runtime** | JavaScript | Node.js, Python |
| **Scale** | Millions req/sec | Thousands req/sec |
| **Trigger points** | Viewer only (① ④) | All 4 stages (① ② ③ ④) |
| **Max execution time** | < 1 ms | 5-10 seconds |
| **Max memory** | 2 MB | 128 MB up to 10 GB |
| **Total package size** | 10 KB | 1 MB – 50 MB |
| **Network / File system access** | ❌ No | ✅ Yes |
| **Access to request body** | ❌ No | ✅ Yes |
| **3rd-party libraries** | ❌ No | ✅ Yes |
| **Pricing** | Free tier available, 1/6th price of @Edge | No free tier, per request & duration |
| **Authoring region** | Managed within CloudFront | us-east-1 (replicated globally) |

### Use Cases
- Website security and privacy
- Dynamic web applications at the edge
- SEO (Search Engine Optimization)
- Intelligent routing
- Bot mitigation
- Real-time image transformation
- A/B testing
- User authentication and authorization
- User tracking and analytics

---

## Lambda in VPC
> *Default: outside VPC, can't access private resources; VPC deployment requires ENI + NAT for internet*

### Default Lambda Networking
By default, Lambda runs **outside your VPC** (AWS-managed VPC):

```
✅ Can access: public internet, DynamoDB, S3
❌ Cannot access: private resources (RDS, ElastiCache, internal ELB)
```

### Deploying Lambda in a VPC
To access private VPC resources, configure:
1. **VPC ID**
2. **Subnets** (private subnets)
3. **Security Group** for Lambda

Lambda creates an **ENI (Elastic Network Interface)** — needs **AWSLambdaVPCAccessExecutionRole**.

```
  ┌─────────────── Your VPC ───────────────────┐
  │                                             │
  │  ┌─── Private Subnet ───────────────────┐  │
  │  │                                       │  │
  │  │  ┌──────────┐   ENI   ┌───────────┐  │  │
  │  │  │  Lambda   │────────►│    RDS     │  │  │
  │  │  └──────────┘         └───────────┘  │  │
  │  │   Lambda SG ──────────► RDS SG       │  │
  │  │         (SG must allow access)       │  │
  │  └──────────────────────────────────────┘  │
  └─────────────────────────────────────────────┘
```

> **EXAM TRAP:** Lambda in public subnet does NOT give internet access — different from EC2!

### Internet Access from VPC: NAT Gateway
Lambda in VPC has **NO internet access** by default. Solution: **NAT Gateway**

```
  ┌─────────────── Your VPC ────────────────────────────┐
  │                                                      │
  │  ┌── Private Subnet ──┐   ┌── Public Subnet ──┐     │
  │  │                     │   │                    │     │
  │  │  ┌──────────┐      │   │  ┌─────────────┐  │     │
  │  │  │  Lambda   │──────┼──►│  │ NAT Gateway  │  │     │
  │  │  └──────────┘      │   │  └──────┬──────┘  │     │
  │  │       │             │   │         │         │     │
  │  │       ▼             │   │         ▼         │     │
  │  │  ┌──────────┐      │   │  ┌─────────────┐  │     │
  │  │  │   RDS     │      │   │  │ Internet GW  │──┼──► Internet
  │  │  └──────────┘      │   │  └─────────────┘  │     │
  │  └─────────────────────┘   └────────────────────┘     │
  └──────────────────────────────────────────────────────┘
```

### VPC Endpoints for Private AWS Services
Instead of routing through Internet Gateway, use **VPC Endpoints:**

```
  ┌─── Private Subnet ────────────────────────┐
  │                                            │
  │  ┌──────────┐     ┌──────────────────┐    │
  │  │  Lambda   │────►│  VPC Endpoint    │────┼──► DynamoDB (private)
  │  └──────────┘     │  (Gateway type)   │    │
  │                    └──────────────────┘    │
  └────────────────────────────────────────────┘
```

### CloudWatch Logs Exception
Lambda in VPC can **always write to CloudWatch Logs** without NAT/VPC Endpoint.

---

## Lambda Function Performance
> *RAM scales with vCPU; execution context reused; /tmp up to 10 GB; timeout max 15 min*

### RAM & vCPU
- Default: **128 MB** RAM
- Max: **10 GB** RAM (1 MB increments)
- **Cannot set vCPUs directly** — increase RAM to get more vCPU
- At **1,792 MB** → function gets **1 full vCPU**
- Above 1,792 MB → multiple vCPUs → need **multi-threading**

```
  RAM              vCPU
  ─────────────────────────────
  128 MB           fractional
  1,792 MB    →    1 full vCPU
  3,584 MB    →    2 vCPUs
  10,240 MB   →    ~6 vCPUs
```

> **Exam tip:** CPU-bound Lambda running slow? **Increase RAM** (not a direct vCPU setting)

### Timeout
- **Default:** 3 seconds
- **Maximum:** 900 seconds (15 minutes)
- Anything over 15 minutes → NOT a Lambda use case → use Fargate/ECS/EC2

### Execution Context (Critical!)
The execution context is a **temporary runtime environment** persisting between invocations. AWS keeps it alive anticipating next call.

**BAD — DB connection INSIDE handler (runs EVERY invocation):**
```python
def get_user_handler(event, context):
    DB_URL = os.getenv("DB_URL")
    db_client = database.connect(DB_URL)    # ← runs every time!
    user = db_client.get(user_id=event["user_id"])
    return user
```

**GOOD — DB connection OUTSIDE handler (runs ONCE, reused):**
```python
DB_URL = os.getenv("DB_URL")
db_client = database.connect(DB_URL)        # ← runs once, reused!

def get_user_handler(event, context):
    user = db_client.get(user_id=event["user_id"])
    return user
```

**Rule:** Anything heavy to initialize (DB connections, HTTP clients, SDK clients) → put **OUTSIDE** handler → reused across invocations.

### /tmp Directory
- **Size:** Up to **10 GB** disk space
- **Purpose:** Write temporary files (download large files, disk operations)
- **Persists** across invocations within same execution context
- Need **permanent** storage? → use **S3** instead
- To **encrypt** /tmp → use **KMS data keys** (generate key, encrypt yourself)

---

## Lambda Layers
> *Externalize dependencies for reuse; custom runtimes; reduces deployment package size*

### Why Use Layers?

**Without Layers (Bad):**
```
  Every function bundles its own dependencies
  → large zip, slow deploys, repeated uploads
```

**With Layers (Good):**
```
  ┌──────────────────┐     ┌──────────────────┐
  │ Function A       │     │ Function B       │
  │ (20 KB)          │     │ (60 KB)          │
  └───────┬──────────┘     └───────┬──────────┘
          │                        │
          │    ┌───────────────┐   │
          ├───►│ Layer 1       │◄──┤
          │    │ (10 MB)       │   │
          │    └───────────────┘   │
          │    ┌───────────────┐   │
          └───►│ Layer 2       │◄──┘
               │ (30 MB)       │
               └───────────────┘

  Deploy Function A → upload 20 KB only!
  Both share the same layers (no duplication)
```

### Key Benefits
- **Faster deployments** — only upload code, not dependencies
- **Reuse across functions** — multiple functions share layers
- **Independent updates** — update code without re-uploading dependencies

---

## Lambda File Systems Mounting
> *EFS on Lambda requires VPC + Access Points; compare storage options*

### Lambda + EFS
- Lambda can mount **EFS** if running in **VPC**
- Mounted to local directory during initialization
- Requires **EFS Access Points**
- Watch two limits:
  1. **EFS connection limits** — each Lambda instance = 1 connection
  2. **Connection burst limits** — many concurrent Lambdas can exceed burst capacity

```
  ┌─────────────── VPC ──────────────────────┐
  │                                           │
  │  Availability Zone A    AZ B              │
  │  ┌─── Private ───┐     ┌─── Private ──┐  │
  │  │  Subnet A      │     │  Subnet B     │  │
  │  │                │     │               │  │
  │  │ λ λ            │     │ λ             │  │
  │  └───────┬─────────┘     └───────┬──────┘  │
  │          │                       │         │
  │          ▼                       ▼         │
  │     ┌─────────────────────────────────┐   │
  │     │  EFS Access Point (Path: /)     │   │
  │     └────────────┬────────────────────┘   │
  │                  ▼                        │
  │     ┌─────────────────────────────────┐   │
  │     │      EFS File System            │   │
  │     └─────────────────────────────────┘   │
  │                                           │
  │  ⚠ N Lambda instances = N connections    │
  └───────────────────────────────────────────┘
```

### Lambda Storage Options Comparison

| Feature | /tmp | Lambda Layers | Amazon S3 | Amazon EFS |
|---------|------|---------------|-----------|------------|
| **Max size** | 10 GB | 5 layers, 250 MB | Elastic | Elastic |
| **Persistence** | Ephemeral | Durable | Durable | Durable |
| **Content** | Dynamic | Static | Dynamic | Dynamic |
| **Storage type** | File System | Archive | Object | File System |
| **Sharing / Permissions** | Function only | IAM | IAM | IAM + NFS |
| **Data access speed** | **Fastest** | **Fastest** | Fast | Very Fast |
| **Shared across invocations?** | **No** | Yes | Yes | Yes |

### Decision Guide
```
  Need temporary scratch space?
  └──► /tmp (fastest, 10 GB, ephemeral)

  Need shared static dependencies?
  └──► Lambda Layers (immutable, 250 MB total)

  Need durable object storage?
  └──► S3 (unlimited, API-based)

  Need shared mutable file system?
  └──► EFS (VPC required, watch connection limits)
```

---

## Lambda Concurrency
> *1,000 account limit; Reserved Concurrency prevents starvation; Provisioned Concurrency eliminates cold starts*

### Concurrency Basics
- Lambda scales automatically — more invocations = more concurrent executions
- **Account concurrency limit:** up to **1,000** concurrent executions (across ALL functions)
  - Note: New accounts may start lower (e.g., 50). AWS **raises quotas automatically**, or you can **request increase**
- **Reserved Concurrency** at function level limits specific function

```
  Account Concurrency Pool: 1,000
  ┌──────────────────────────────────────────────┐
  │████████████████████████████████░░░░░░░░░░░░░░│
  │  Function A: 600    Function B: 200   Free: 200
  └──────────────────────────────────────────────┘
```

### Throttling Behavior
When concurrency limit exceeded:

| Invocation Type | Throttle Behavior |
|-----------------|-------------------|
| **Synchronous** | Returns **429 ThrottleError** (API Gateway may return **502** to users) |
| **Asynchronous** | Retries automatically, then → **DLQ** |

> **429 or 502/500 errors** related to Lambda? → think **throttling**

### Async Invocations + Throttling
When async invocations throttled:

```
  S3 bucket               Lambda
    │                      │
    │──event──event──────►│
    │                      │ Can't scale (limit reached)
    │                      │
    │              ┌─────────────────┐
    │              │ Internal Event  │
    │              │ Queue           │
    │              │                 │
    │              │ Retries for up  │
    │              │ to 6 HOURS      │
    │              │                 │
    │              │ Exponential     │
    │              │ backoff:        │
    │              │ 1s → ... → 5 min│
    │              └─────────────────┘
```

- Throttled async events return to **internal event queue**
- Retries for up to **6 hours**
- Retry interval: **exponential backoff** from 1 second up to 5 minutes

### Cold Starts & Provisioned Concurrency

**Cold Start Problem:**
- New Lambda instance = code loaded + init code runs
- Heavy init (many dependencies, DB connections) = **high latency on first request**

**Solution: Provisioned Concurrency**
- Allocate concurrency **before** function invoked
- Instances **pre-initialized** → **cold start never happens**
- All invocations have **low latency**
- Manage with **Application Auto Scaling** (schedule or target tracking)

```
  WITHOUT Provisioned Concurrency:
  ┌───────┐
  │ Req 1 │ ████████████████░░░░  (INIT + handler = slow)
  │ Req 2 │ ░░░░░░░░░░           (reused = fast)
  │ Req 3 │ ░░░░░░░░░░           (reused = fast)
  └───────┘

  WITH Provisioned Concurrency:
  ┌───────┐
  │ Req 1 │ ░░░░░░░░░░           (pre-warmed = fast!)
  │ Req 2 │ ░░░░░░░░░░           (pre-warmed = fast!)
  │ Req 3 │ ░░░░░░░░░░           (pre-warmed = fast!)
  └───────┘
```

> **Note:** VPC cold starts dramatically improved since Oct/Nov 2019

---

## Lambda External Dependencies
> *Package with code; 50 MB zip limit; S3 for larger; AWS SDK included by default*

### Packaging Dependencies
When Lambda needs external libraries, **package with code** in zip:

```
  your-function/
  ├── lambda_function.py       ← your code
  ├── node_modules/            ← JS dependencies
  ├── requirements/            ← Python deps
  └── lib/*.jar                ← Java dependencies
```

### Upload Rules

| Zip size | Method |
|----------|--------|
| **< 50 MB** | Upload **directly** to Lambda |
| **≥ 50 MB** | Upload to **S3** first, then reference |

### Key Points
- **Each language** has its own packaging (npm, pip --target, .jar)
- **Native libraries** must be compiled on **Amazon Linux**
- **AWS SDK included by default** — no need to package unless specific version needed

---

## Lambda & CloudFormation
> *Inline code for simple functions; S3 zip recommended; versioning critical for updates*

### Option 1: Inline Code
- Use `Code.ZipFile` property in template
- Lambda code written **directly inside** template
- **Cannot include dependencies** — simple functions only

### Option 2: S3 Zip (Recommended)
Store Lambda zip in **S3**, reference with three properties:

| Property | Description |
|----------|-------------|
| `S3Bucket` | The S3 bucket name |
| `S3Key` | Full path to zip file |
| `S3ObjectVersion` | Version ID (if versioned bucket) |

### Important: S3 Versioning & CloudFormation Updates

If you update code in S3 but **don't change** `S3Bucket`, `S3Key`, or `S3ObjectVersion` → **CloudFormation will NOT update!**

```
  Upload new code to S3
         │
         ├── S3ObjectVersion unchanged → ❌ No update!
         │
         └── S3ObjectVersion updated   → ✅ CloudFormation updates Lambda
```

> **Best practice:** Enable **S3 versioning** and update `S3ObjectVersion` in template on each deploy

### Cross-Account Deployment
Deploy Lambda code from Account 1's S3 to functions in Account 2 & 3:

Two things needed per target account:
1. **Bucket Policy** on Account 1's S3 bucket → allow access from other accounts
2. **CloudFormation Execution Role** in target account → permissions to get/list from S3

---

## Lambda Container Images
> *Up to 10 GB from ECR; must implement Lambda Runtime API; best for large functions*

### Lambda Container Images Overview
- Deploy Lambda functions as **container images up to 10 GB** from **Amazon ECR**
- Pack complex/large dependencies in Docker container
- Base image **must implement Lambda Runtime API** — NOT any Docker image!

```
  ┌─────────────────────────────────┐
  │  Lambda Container Image         │
  │                                  │
  │  ┌──────────────────────────┐   │
  │  │ Your code + dependencies  │   │
  │  │ (app.js, node_modules)    │   │
  │  └──────────────────────────┘   │
  │  ┌──────────────────────────┐   │
  │  │ AWS Base Image            │   │
  │  │ (implements Lambda        │   │
  │  │  Runtime API)             │   │
  │  └──────────────────────────┘   │
  └─────────────────────────────────┘
              │
              ▼
         Amazon ECR ───► Lambda
```

### Supported Languages
Python, Node.js, Java, .NET, Go, Ruby (and custom with your own base image implementing Runtime API)

### Example Dockerfile
```dockerfile
# 1. Choose base image (implements Lambda Runtime API)
FROM amazon/aws-lambda-nodejs:12

# 2. Copy application code and files
COPY app.js package.json ./

# 3. Install dependencies
RUN npm install

# 4. Set the handler function
CMD ["app.lambdaHandler"]
```

### Best Practices
1. **Use AWS-provided base images** — built on Amazon Linux 2, **cached by Lambda**, faster pulls
2. **Multi-stage builds** — compile in preliminary stages, copy only final artifacts → smaller final image
3. **Layer ordering** — stable layers first, frequently changing layers last → better caching
4. **Single ECR repository** for functions with large layers → ECR deduplicates shared layers

---

## Lambda Versions and Aliases
> *Immutable versions; mutable aliases for stable endpoints; canary deployments via traffic split*

### Lambda Versions
- While working on Lambda, use **$LATEST** — **mutable** (can edit code)
- When happy with code, **publish it** → creates immutable version (V1, V2, V3...)
- **Immutable** = code, env vars, configuration cannot change after publishing
- Each version has its own **ARN**
- Version numbers **increasing** (V1, V2, V3...)
- Both `$LATEST` and published versions accessible independently

```
  $LATEST (mutable — edit freely)
     │
     │── Publish ──► V1 (immutable, own ARN)
     │── Publish ──► V2 (immutable, own ARN)
     │── Publish ──► V3 (immutable, own ARN)
```

### Lambda Aliases
Aliases are **mutable pointers** to Lambda versions. Give users **stable endpoint** you can redirect.

```
  ┌─────────────────────────────────────────────┐
  │                                              │
  │  $LATEST ◄──── DEV alias (mutable pointer)  │
  │                                              │
  │  V2 ◄──────── TEST alias (mutable pointer)  │
  │                                              │
  │  V1 ◄──────── PROD alias (mutable pointer)  │
  │                                              │
  └─────────────────────────────────────────────┘

  Users call the ALIAS (stable URL)
  You change where it POINTS (flexible)
```

- Each alias has its **own ARN**
- Aliases enable stable configuration for triggers/destinations
- **CANNOT reference other aliases** — only versions! (EXAM TRAP)

### Canary Deployments with Aliases
Aliases can split traffic between **two versions** using weights:

```
  PROD Alias
     │
     ├── 95% ──► V1 (stable, known good)
     │
     └──  5% ──► V2 (new, testing in prod)

  Later, when confident:

  PROD Alias
     │
     └── 100% ──► V2 (fully deployed)
```

**Gradual rollout** — test V2 with small percentage of real traffic before switching fully.

---

## Lambda & CodeDeploy
> *Automate traffic shift between alias versions; Linear, Canary, AllAtOnce strategies*

### CodeDeploy + Lambda
CodeDeploy automates **traffic shift between Lambda alias versions**:

```
  PROD Alias
     │
     │  CodeDeploy shifts X% over time:
     │
     │  Start:  100% V1,   0% V2
     │  ...      90% V1,  10% V2
     │  ...      50% V1,  50% V2
     │  End:      0% V1, 100% V2
```

### Deployment Strategies

**Linear — Grow traffic every N minutes until 100%:**
| Strategy | Description |
|----------|-------------|
| `Linear10PercentEvery3Minutes` | +10% every 3 min |
| `Linear10PercentEvery10Minutes` | +10% every 10 min |

**Canary — Try X%, then jump to 100%:**
| Strategy | Description |
|----------|-------------|
| `Canary10Percent5Minutes` | 10% for 5 min, then 100% |
| `Canary10Percent30Minutes` | 10% for 30 min, then 100% |

**AllAtOnce — Immediate switch:**
| Strategy | Description |
|----------|-------------|
| `AllAtOnce` | 0% → 100% instantly (fastest, most risky) |

```
  Linear:    ░░▓▓▓▓▓▓████████████████████  (gradual)
  Canary:    ░░▓▓▓▓░░░░████████████████████  (test, then flip)
  AllAtOnce: ░░██████████████████████████████  (instant)
```

### Rollbacks
- Create **pre and post traffic hooks** to check Lambda health
- If hooks fail OR **CloudWatch Alarm** triggers → CodeDeploy **rolls back** to V1

---

## Lambda Function URL
> *HTTPS endpoint without API Gateway or ALB; AuthType NONE vs AWS_IAM; CORS required for different domains*

### What Is a Lambda Function URL?
- Dedicated **HTTPS endpoint** for Lambda — no API Gateway/ALB needed
- Unique URL that **never changes**: `https://<url-id>.lambda-url.<region>.on.aws`
- Supports **IPv4 and IPv6**
- Accessible from **public internet only** (no private URL)
- Applies to **function alias** or **$LATEST** — NOT specific versions
- Throttle with **Reserved Concurrency**

```
  ┌──────────┐     HTTPS      ┌──────────────────────────────┐
  │  Browser  │───────────────►│  Lambda Function URL          │
  │  CLI      │                │  https://abc123.lambda-url    │
  │  Postman  │                │  .us-east-1.on.aws            │
  └──────────┘                └──────────────────────────────┘
                                        │
  No API Gateway needed!                ▼
  No ALB needed!                   ┌──────────┐
                                   │  Lambda   │
                                   └──────────┘
```

### Security: AuthType

**AuthType: NONE (Public Access)**
- Allows **public and unauthenticated** access
- Must grant public access via **resource-based policy**

```json
{
  "Effect": "Allow",
  "Principal": "*",
  "Action": "lambda:InvokeFunctionUrl",
  "Resource": "arn:aws:lambda:...:function:myFunc"
}
```

**AuthType: AWS_IAM (Authenticated Access)**
- IAM used to **authenticate and authorize** requests
- Requires `lambda:InvokeFunctionUrl` permission
- **Same account:** identity OR resource policy = allow
- **Cross account:** identity AND resource policy (both must allow)

```
  Same Account:
  ┌──────────────────────────────────────────┐
  │  Identity policy OR Resource policy = ✅  │
  │  (either one is enough)                   │
  └──────────────────────────────────────────┘

  Cross Account:
  ┌───── Account A ─────┐   ┌───── Account B ─────┐
  │                      │   │                      │
  │  Lambda Function URL │   │  IAM Role            │
  │  Resource policy:    │   │  Identity policy:    │
  │  Allow Account B ✅  │   │  Allow invoke ✅     │
  │                      │   │                      │
  └──────────────────────┘   └──────────────────────┘
          BOTH must allow for cross-account access
```

### CORS
- Needed when calling Lambda Function URL from **different domain**
- Same concept as S3 CORS

---

## CodeGuru Integration
> *Java and Python only; adds layer + env vars + IAM policy*

### CodeGuru Profiler + Lambda
- **CodeGuru Profiler** provides runtime performance insights for Lambda
- Supported for **Java and Python** only
- Activate from **Lambda console** (simple toggle)

### What Happens When Activated
1. **CodeGuru Profiler Lambda Layer** added to function
2. CodeGuru-related **environment variables** added
3. **AmazonCodeGuruProfilerAgentAccess** policy added to IAM role

---

## Lambda Limits
> *All limits per region; execution vs deployment; use container images for very large deployments*

### Execution Limits

| Limit | Value |
|-------|-------|
| **Memory** | 128 MB to 10 GB (1 MB increments) |
| **Max execution time** | 900 seconds (15 minutes) |
| **Environment variables** | 4 KB max |
| **/tmp storage** | Up to 10 GB |
| **Concurrent executions** | 1,000 (can request increase) |

### Deployment Limits

| Limit | Value |
|-------|-------|
| **Compressed zip** | 50 MB max |
| **Uncompressed** | 250 MB max |

> For files larger than 250 MB → use **/tmp** directory at runtime (up to 10 GB) OR **container images** (up to 10 GB from ECR)

### Exam Decision Table

```
  "We need 30 GB of RAM"           → ❌ NOT Lambda (max 10 GB)
  "We need 30 min execution"       → ❌ NOT Lambda (max 15 min)
  "We need a 3 GB file"            → ✅ Use /tmp
  "Deployment is 300 MB"           → ❌ Exceeds 250 MB uncompressed
                                     → Use container image (up to 10 GB)
  "Need 2,000 concurrent"          → ✅ Request quota increase
```

---

## Lambda Best Practices
> *Init outside handler; use env vars; minimize package size; NEVER recurse*

### Best Practices Summary

1. **Heavy work OUTSIDE the handler**
   - DB connections, AWS SDK init, datasets → outside handler
   - Minimizes handler execution time (reuses execution context)

2. **Use environment variables**
   - DB connection strings, S3 bucket names, config values
   - Don't hardcode values in code
   - Encrypt sensitive values with **KMS**

3. **Minimize deployment package size**
   - Only include what you need at runtime
   - If too big → break it down
   - Reuse libraries → use **Lambda Layers**
   - Remember limits: 50 MB compressed / 250 MB uncompressed

4. **NEVER have Lambda call itself (no recursion!)**
   - Lambda invoking itself = infinite loop
   - Extremely expensive and dangerous
   - This is a disaster scenario — avoid at all costs

---

## Three Invocation Models Summary

| Model | Trigger | Waits? | Retries | Error Handling | Services |
|-------|---------|--------|---------|----------------|----------|
| **Synchronous** | User/service direct | ✅ Yes | Client handles | Client retries + backoff | ALB, API Gateway, CloudFront, CLI, SDK |
| **Asynchronous** | Service fires event | ❌ No | Lambda 3x, then DLQ | Lambda retries + DLQ destination | S3, SNS, EventBridge, CloudWatch Logs, SES |
| **Event Source Mapping** | Lambda polls source | Polls then sync invoke | Depends on source | Stream error blocks shard; SQS → DLQ on queue | Kinesis, DynamoDB Streams, SQS |

---

## Lambda Storage Options

| Feature | /tmp | Lambda Layers | Amazon S3 | Amazon EFS |
|---------|------|---------------|-----------|------------|
| **Max size** | 10 GB | 5 layers, 250 MB | Elastic | Elastic |
| **Persistence** | Ephemeral | Durable | Durable | Durable |
| **Content** | Dynamic (scratch) | Static (libraries) | Dynamic (objects) | Dynamic (files) |
| **Use case** | Temporary files | Shared dependencies | Permanent storage | Shared file system |
| **Speed** | Fastest | Fastest | Fast | Very fast |
| **Shared across invocations?** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |

---

## CloudFront Functions vs Lambda@Edge

| Feature | CloudFront Functions | Lambda@Edge |
|---------|---------------------|-------------|
| **Language** | JavaScript only | Node.js, Python |
| **Scale** | Millions req/sec | Thousands req/sec |
| **Stages** | Viewer only (① ④) | All 4 stages |
| **Max execution time** | < 1 ms | 5-10 seconds |
| **Max memory** | 2 MB | 128 MB – 10 GB |
| **3rd-party libraries** | ❌ No | ✅ Yes |
| **Network access** | ❌ No | ✅ Yes |
| **Body access** | ❌ No | ✅ Yes |
| **Pricing** | Cheaper (1/6 @Edge) | More expensive |

---

## CodeDeploy Strategies for Lambda

| Strategy | Pattern | Risk | Use Case |
|----------|---------|------|----------|
| **Linear10PercentEvery3Minutes** | +10% every 3 min | Medium | Steady gradual rollout |
| **Linear10PercentEvery10Minutes** | +10% every 10 min | Medium | Slower, cautious rollout |
| **Canary10Percent5Minutes** | 10% for 5 min, then 100% | Low-medium | Quick test + flip |
| **Canary10Percent30Minutes** | 10% for 30 min, then 100% | Low-medium | Extended test period |
| **AllAtOnce** | 0% → 100% instantly | High | Fast deployment (confidence high) |

---

## Lambda Function URL Authorization

### Same Account
Either **identity-based OR resource-based policy** allows access:

```
Account A
  │
  │  IAM Role (identity policy) → Lambda function
  │  OR
  │  Lambda resource policy
  │
  └─► Either one is enough ✅
```

### Cross Account
Both **identity-based AND resource-based policy** must allow:

```
Account A                           Account B
  │                                  │
  │  Lambda Function URL             │  IAM Role
  │  Resource policy:                │  Identity policy:
  │  Allow Account B ✅              │  Allow invoke ✅
  │                                  │
  └──────────────────────────────────┘
       BOTH must allow ✅
```

---

## Consolidated Exam Tips

### Core Lambda Concepts
- **15 minutes max** execution time → if longer needed, NOT Lambda
- **10 GB max RAM** (more RAM = more vCPU + network)
- **1,000 account-wide concurrent limit** (default) → request increase for more
- **$LATEST** = mutable, **Versions** = immutable, **Aliases** = mutable pointers
- Free tier: **1M requests + 400,000 GB-seconds/month**

### Invocation Models
- **Sync** (ALB, API Gateway) = caller waits, errors client-side
- **Async** (S3, SNS, EventBridge) = fire-forget, 3 retries, DLQ on failure, **must be idempotent**
- **Event Source Mapping** (Kinesis, DDB, SQS) = Lambda polls, sync invoke, batches, maintains order (per partition key for streams)

### Permissions
- **Execution Role** = what Lambda can **do** (pull/push to other services)
- **Resource-Based Policy** = who can **invoke** Lambda (push events to Lambda)
- Event Source Mapping → **execution role** (Lambda pulls)
- S3/ALB/EventBridge → **resource-based policy** (they push)

### Performance & Optimization
- **Heavy work OUTSIDE handler** → reuses execution context
- **1,792 MB** = 1 full vCPU
- **/tmp** = 10 GB, ephemeral, per-instance
- **Execution context** persists between invocations (DB connections, HTTP clients reused)
- **Cold start** problem → Provisioned Concurrency solves it
- CPU-bound? → **Increase RAM** (not direct vCPU setting)

### Storage
- **/tmp** = fastest, ephemeral, per-invocation
- **Lambda Layers** = shared static deps, up to 250 MB total
- **S3** = object storage, unlimited, durable
- **EFS** = file system, VPC required, shared mutable, watch connection limits

### VPC & Networking
- **Default Lambda** = outside VPC → can't access private resources (RDS, ElastiCache)
- VPC Lambda = ENI + AWSLambdaVPCAccessExecutionRole
- **Lambda in public subnet ≠ internet access** (EXAM TRAP! Different from EC2)
- Internet access from VPC → **NAT Gateway**
- Private AWS service access → **VPC Endpoints**
- **CloudWatch Logs always works** from VPC (no NAT/endpoint needed)

### Deployment & Versioning
- CloudFormation inline = simple functions only (no deps)
- CloudFormation S3 = recommended, needs **S3Bucket + S3Key + S3ObjectVersion**
- **Change S3ObjectVersion for CloudFormation to detect updates**
- Container images = up to 10 GB from ECR, must implement **Lambda Runtime API**

### Advanced Topics
- **Lambda@Edge** = all 4 stages, Node.js/Python, 5-10 sec, external access, origin-level logic
- **CloudFront Functions** = viewer only, JavaScript, < 1ms, millions req/sec
- **Function URL** = HTTPS endpoint without API Gateway, AuthType NONE (public) vs AWS_IAM (authenticated)
- Same account: identity OR resource policy
- Cross account: identity AND resource policy (both required)
- **Versions vs Aliases:** versions = immutable, aliases = mutable pointers, canary deployments via alias traffic split
- **CodeDeploy strategies:** Linear (gradual), Canary (test then flip), AllAtOnce (instant)
- **Async throttling** = retries for 6 hours with exponential backoff (1s → 5 min max)
- **Event Source Mapping error handling:** stream error blocks shard, SQS error returns to queue

### Common Exam Patterns
- S3 event → Lambda → Database = **classic exam scenario**
- Serverless CRON → **EventBridge + Lambda**
- "Caller waits for response" → **synchronous** (ALB, API Gateway)
- "Fire and forget" → **asynchronous** (S3, SNS, EventBridge)
- Concurrent write to same S3 object → enable **versioning**
- Function A throttles Function B → set **Reserved Concurrency** on Function A
- Need permanent storage → **S3**, not /tmp
- Need shared file system → **EFS** (not /tmp, not Layers)
- "Lambda recursion" scenario → NEVER, disaster scenario
- Questions showing DB connection inside handler → **BAD** (should be outside)
- "More RAM to improve CPU performance" → **correct** (RAM scales with vCPU)
- Need >250 MB deployment → **container image** (up to 10 GB)
- Modify origin request/response → **Lambda@Edge only** (CloudFront Functions can't)
- Need <1ms response → **CloudFront Functions**
- Need origin manipulation → **Lambda@Edge** (more power, 5-10 sec)

---

## Quiz Results Summary

**Lessons with PERFECT (100%):**
- 21.3 AWS Lambda Overview
- 21.26 Lambda@Edge & CloudFront Functions
- 21.27 Lambda in VPC
- 21.29 Lambda Function Performance
- 21.33 Lambda File Systems Mounting
- 21.34 Lambda Concurrency
- 21.41 Lambda Versions and Aliases
- 21.44 Lambda Function URL

**Lessons with PASSED (75%+):**
- 21.15 Lambda Event Source Mapping (75%)

**Total XP Earned This Section:** 850 XP (from 8,700 → 9,550)

**Section Status:** ✅ COMPLETE (48 lessons + 1 quiz)
