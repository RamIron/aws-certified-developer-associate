# Section 13 Summary - Advanced Amazon S3

## Lessons

| # | Lesson | Status |
|---|--------|--------|
| 13.1 | S3 Lifecycle Rules (with S3 Analytics) | PERFECT |
| 13.2 | S3 Lifecycle Rules - Hands On | Skipped |
| 13.3 | S3 Event Notifications | PERFECT |
| 13.4 | S3 Event Notifications - Hands On | Skipped |
| 13.5 | S3 Performance | PERFECT |
| 13.6 | S3 Object Tags & Metadata | REVIEW |
| 13.7 | Amazon S3 Advanced Quiz | Skipped (Udemy quiz) |

---

## S3 Lifecycle Rules

### Two Types of Actions

| Action | What it does | Example |
|--------|-------------|---------|
| **Transition Actions** | Move objects to another storage class | Standard → Standard-IA after 60 days → Glacier after 6 months |
| **Expiration Actions** | Delete objects after some time | Delete logs after 365 days, delete incomplete multi-part uploads |

### Rule Scope
- **Entire bucket**, by **prefix**, or by **object tags**

### Exam Scenarios
- Source images (Standard → Glacier after 60 days) + thumbnails (One-Zone-IA → expire after 60 days) — use prefix to differentiate
- Recover deleted objects → enable versioning + lifecycle rules on non-current versions (Standard-IA → Glacier Deep Archive)

### S3 Analytics
- Recommends when to transition objects between classes
- Only works for **Standard** and **Standard-IA** (not One-Zone-IA or Glacier)
- CSV report, updated daily, takes **24-48 hours** to start

---

## S3 Event Notifications

### Events
- Object created, removed, restored, replication
- Can filter by prefix/suffix (e.g., `.jpg` only)

### Destinations

| Destination | Permission Needed |
|-------------|------------------|
| **SNS Topic** | SNS Resource Access Policy |
| **SQS Queue** | SQS Resource Access Policy |
| **Lambda Function** | Lambda Resource Policy |
| **EventBridge** | All events go automatically |

- Uses **resource-based policies** on the target (not IAM Roles for S3)
- Delivery typically within seconds, sometimes a minute+

### EventBridge Advantages
- Advanced filtering (metadata, object size, name)
- Multiple destinations at once (18+ services)
- Archive & replay events
- More reliable delivery

---

## S3 Performance

### Baseline
- Latency: **100-200 ms** first byte
- **3,500 PUT/COPY/POST/DELETE** per second per prefix
- **5,500 GET/HEAD** per second per prefix
- Spread across prefixes to multiply throughput

### Upload Optimization

| Feature | What it does |
|---------|-------------|
| **Multi-Part Upload** | Split file into parts, upload in parallel. Recommended > 100 MB, required > 5 GB |
| **Transfer Acceleration** | Upload to nearby edge location → private AWS network to target bucket. Compatible with multi-part |

### Download Optimization

| Feature | What it does |
|---------|-------------|
| **Byte-Range Fetches** | Request specific byte ranges in parallel. Also useful for partial reads (e.g., file headers) |

---

## S3 Object Tags & Metadata

### Metadata
- Key-value pairs, user-defined must start with **`x-amz-meta-`**
- Retrieved with the object

### Tags
- Key-value pairs for **fine-grained permissions** and **analytics**
- IAM policies can restrict access based on tags

### Critical Point
- **Neither metadata nor tags are searchable in S3**
- To search: build an external index in **DynamoDB**, query there, fetch from S3

---

## Consolidated Exam Tips

1. Lifecycle Rules: **transition** (move) and **expiration** (delete) actions
2. S3 Analytics: only for Standard & Standard-IA, CSV report, 24-48h to start
3. Event Notifications: **SNS, SQS, Lambda** (resource policies) + **EventBridge** (all events, 18+ services)
4. Baseline: **3,500 PUT / 5,500 GET** per second per prefix
5. Multi-Part Upload: recommended > 100 MB, **required > 5 GB**
6. Transfer Acceleration: edge location → private AWS network
7. Byte-Range Fetches: parallel downloads + partial reads
8. Tags → fine-grained IAM permissions per object
9. Metadata & tags are **NOT searchable** in S3 → use DynamoDB index
10. "Easily recreated + infrequently accessed" → One-Zone-IA
