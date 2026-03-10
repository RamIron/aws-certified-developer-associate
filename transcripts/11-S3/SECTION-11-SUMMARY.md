# Section 11 Summary - Amazon S3 Introduction

## Lessons

| # | Lesson | Status |
|---|--------|--------|
| 11.1 | S3 Overview | PERFECT |
| 11.2 | S3 Hands On | Skipped |
| 11.3 | S3 Security: Bucket Policy | PERFECT |
| 11.4 | S3 Security: Bucket Policy Hands On | Skipped |
| 11.5 | S3 Website Overview | PERFECT |
| 11.6 | S3 Website Hands On | Skipped |
| 11.7 | S3 Versioning | PERFECT |
| 11.8 | S3 Versioning - Hands On | Skipped |
| 11.9 | S3 Replication | PERFECT |
| 11.10 | S3 Replication Notes | PERFECT |
| 11.11 | S3 Replication - Hands On | Skipped |
| 11.12 | S3 Storage Classes Overview | REVIEW |
| 11.13 | S3 Storage Classes Hands On | Skipped |
| 11.14 | Amazon S3 Quiz | Skipped (Udemy quiz) |

---

## S3 Basics

- **Infinitely scaling storage** — one of the main building blocks of AWS
- Files stored in **buckets** (top-level directories), files are called **objects**
- Bucket names are **globally unique** (across all accounts and regions)
- Buckets are **region-level** resources (not global, despite the console)

### Objects

- Object **key** = full path (e.g., `photos/vacation/beach.jpg`)
- Key = prefix + object name — S3 has no real directories
- Max object size = **5 TB**
- Multi-part upload **required** for files > **5 GB**
- Metadata (key-value pairs), Tags (up to 10), Version ID

---

## S3 Security

### Two Ways to Control Access

| Type | How |
|------|-----|
| **User-Based (IAM)** | IAM policies on users/roles |
| **Resource-Based (Bucket Policy)** | JSON policy on the bucket |

Access granted if: IAM permissions OR resource policy allows it + no explicit deny

### Bucket Policy (JSON)

| Field | Meaning |
|-------|---------|
| **Principal** | WHO (`*` = anyone) |
| **Action** | WHAT (`s3:GetObject`, `s3:PutObject`) |
| **Resource** | WHERE (bucket + objects) |
| **Effect** | Allow or Deny |

### Common Access Patterns

- **Public access** → Bucket Policy with `Principal: "*"`
- **IAM user** → IAM Policy
- **EC2 instance** → IAM Role (never IAM user!)
- **Cross-account** → Bucket Policy

### Block Public Access

- Extra safety layer — **overrides** bucket policies that allow public access
- Can be set at **bucket level** or **account level**
- To make bucket public: disable Block Public Access + add public bucket policy

---

## S3 Static Website Hosting

- S3 can host static websites (HTML, CSS, JS, images) — no server needed
- Enable in bucket properties, specify **index document** (e.g., `index.html`)
- 403 Forbidden → bucket policy doesn't allow public reads
- S3 Website is a valid **Route 53 Alias target**

---

## S3 Versioning

- Enabled at the **bucket level**
- Every upload with the same key creates a new version (v1, v2, v3...)
- Pre-versioning files have version = **null**
- Suspending versioning does NOT delete existing versions

### Delete Behavior

| Action | Result |
|--------|--------|
| Delete object (no version specified) | **Delete marker** added (recoverable) |
| Delete specific version (by ID) | **Permanent delete** (irreversible) |

---

## S3 Replication

- **CRR** (Cross-Region Replication) — different regions
- **SRR** (Same-Region Replication) — same region
- **Versioning must be enabled** on both source and destination
- Replication is **asynchronous**
- Works across different AWS accounts
- Version IDs are replicated (same ID in both buckets)

### Replication Notes

- Only **new objects** replicated — use **S3 Batch Replication** for existing
- **Delete markers**: optional replication (opt-in)
- **Permanent deletes** (by version ID): **never replicated** (prevents malicious deletes)
- Replication is **NOT transitive** (like VPC Peering)

### Use Cases

| Type | Use Cases |
|------|-----------|
| **CRR** | Compliance, lower latency in another region |
| **SRR** | Log aggregation, prod-to-test replication |

---

## S3 Storage Classes

### Durability vs Availability

- **Durability**: 11 nines (99.999999999%) — **same for ALL classes**
- **Availability**: varies by class

### Classes Overview

| Class | Availability | Use Case | Retrieval |
|-------|-------------|----------|-----------|
| **S3 Standard** | 99.99% | Frequently accessed (default) | Instant |
| **S3 Standard-IA** | 99.9% | Infrequent access, rapid retrieval | Instant (retrieval cost) |
| **S3 One Zone-IA** | 99.5% | Recreatable data, secondary backups | Instant (single AZ risk!) |
| **Glacier Instant** | — | ~Once per quarter, need milliseconds | Milliseconds (min 90 days) |
| **Glacier Flexible** | — | Archives, willing to wait | 1-5 min / 3-5 hr / 5-12 hr (min 90 days) |
| **Glacier Deep Archive** | — | Long-term, cheapest | 12 hr / 48 hr (min 180 days) |
| **Intelligent-Tiering** | — | Unknown access patterns | Auto-moves, no retrieval charges |

### Glacier Flexible Retrieval Tiers

| Tier | Time | Cost |
|------|------|------|
| Expedited | 1-5 minutes | Highest |
| Standard | 3-5 hours | Medium |
| Bulk | 5-12 hours | Free |

### Lifecycle Rules

- Automate moving objects between storage classes over time
- Example: Standard → Standard-IA (30 days) → Glacier (180 days)
- **Reduced Redundancy** is deprecated — ignore it

---

## Consolidated Exam Tips

1. Bucket names are **globally unique**, buckets are **region-level**
2. Max object = **5 TB**, multi-part upload required for **> 5 GB**
3. EC2 → S3 = **IAM Role** (never IAM user or stored credentials)
4. Cross-account S3 = **Bucket Policy**
5. Block Public Access **overrides** bucket policies — account-level for max protection
6. 403 on S3 website = bucket policy not public
7. S3 Website = valid **Route 53 Alias target**
8. Versioning: delete = delete marker (recoverable), delete by version ID = permanent
9. Replication requires **versioning on both buckets**, only new objects replicated
10. Permanent deletes are **never replicated** (security feature)
11. Durability = **11 nines for ALL classes** | Availability = varies
12. Milliseconds → **Glacier Instant** | Minutes-hours → **Glacier Flexible** | Hours-days → **Deep Archive**
13. Unknown access pattern → **Intelligent-Tiering**
14. **One Zone-IA** = single AZ, data lost if AZ destroyed
