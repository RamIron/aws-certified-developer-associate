# Section 22 — AWS Serverless: DynamoDB — Complete Summary

## Lessons

| # | Lesson | Status |
|---|--------|--------|
| 22.1 | DynamoDB Introduction | ✅ |
| 22.2 | DynamoDB Overview | ✅ |
| 22.3 | DynamoDB Basics — Hands On | ✅ |
| 22.4 | WCU & RCU — Throughput | ✅ |
| 22.5 | WCU & RCU — Hands On | ✅ |
| 22.6 | DynamoDB Basic Operations | ✅ |
| 22.7 | Basic APIs — Hands On | ✅ |
| 22.8 | Conditional Writes | ✅ |
| 22.9 | Indexes: GSI + LSI | ✅ |
| 22.10 | Indexes — Hands On | ✅ |
| 22.11 | PartiQL | ✅ |
| 22.12 | Optimistic Locking | ✅ |
| 22.13 | DAX | ✅ |
| 22.14 | DAX — Hands On | ✅ |
| 22.15 | DynamoDB Streams | ✅ |
| 22.16 | Streams — Hands On | ✅ |
| 22.17 | DynamoDB TTL | ✅ |
| 22.18 | DynamoDB CLI | ✅ |
| 22.19 | DynamoDB Transactions | ✅ |
| 22.20 | Session State | ✅ |
| 22.21 | Partitioning Strategies | ✅ |
| 22.22 | Write Types | ✅ |
| 22.23 | Patterns with S3 | ✅ |
| 22.24 | DynamoDB Operations | ✅ |
| 22.25 | Security & Other | ✅ |
| Udemy Quiz | Section 22 Quiz | ✅ |

---

## 1. SQL vs NoSQL — The Fundamentals

**RDBMS (SQL):** Strong schema, joins, aggregations, vertical scaling.
**NoSQL:** No joins, no aggregations, all data in one row, horizontal scaling (reads + writes).

DynamoDB is a fully managed NoSQL DB with:
- Multi-AZ replication built in
- Single-digit millisecond latency
- Scales to millions req/sec, trillions of rows, hundreds of TB
- Max item size: **400 KB**
- Two table classes: **Standard** and **Infrequent Access (IA)**

---

## 2. Table Structure

| Concept | Detail |
|---|---|
| Item (row) | Max 400 KB |
| Attribute | Flexible — can be null, nested, added over time |
| Schema | Defined per item, not per table |

**Data types:** Scalar (String, Number, Binary, Boolean, Null), Document (List, Map), Set (String Set, Number Set, Binary Set)

---

## 3. Primary Key Options

**Option 1 — Partition Key only (Hash)**
- Must be unique per item
- Must have high cardinality for good distribution

**Option 2 — Partition Key + Sort Key (Hash + Range)**
- Combination must be unique
- Same PK allowed with different SKs
- Data grouped by PK, ordered by SK

> **Best partition key = attribute with the most distinct values (highest cardinality)**

---

## 4. Capacity Modes

| Mode | Planning | Cost | Throttling | Switch |
|---|---|---|---|---|
| **Provisioned** | Set RCU + WCU upfront | Pay for provisioned | `ProvisionedThroughputExceededException` | Once every 24h |
| **On-Demand** | None | Pay per request (~2.5× more expensive) | None | Once every 24h |

On-Demand unit names: **RRU** (Read Request Unit), **WRU** (Write Request Unit) — same calculation, billed per request.

**Throttling causes:** hot key, hot partition, very large items.
**Solutions:** exponential backoff (built into SDK), better partition key distribution, DAX for read-heavy hot keys.

---

## 5. WCU & RCU Formulas

### Write Capacity Unit (WCU)
> 1 WCU = 1 write/sec for items up to **1 KB** — round UP to nearest 1 KB

```
WCU = (writes/sec) × ceil(item_size_KB / 1)
```

| Example | Calculation | Result |
|---|---|---|
| 10 writes/sec, 2 KB | 10 × 2 | 20 WCU |
| 6 writes/sec, 4.5 KB | 6 × 5 (round up) | 30 WCU |
| 120 writes/min, 2 KB | 2 × 2 | 4 WCU |

### Read Capacity Unit (RCU)
> 1 RCU = 1 strongly consistent read/sec OR 2 eventually consistent reads/sec, for items up to **4 KB** — round UP to nearest 4 KB

```
Strongly Consistent:
  RCU = (reads/sec) × ceil(item_size_KB / 4)

Eventually Consistent (default):
  RCU = (reads/sec / 2) × ceil(item_size_KB / 4)

Transactional (2× cost — prepare + commit phases):
  RCU = (reads/sec × 2) × ceil(item_size_KB / 4)
```

**Example — 8 reads/sec, 6 KB item (6 KB rounds UP to 8 KB):**

| Mode | Calculation | Result |
|---|---|---|
| Strongly Consistent | 8 × (8/4) | 16 RCU |
| Eventually Consistent | (8/2) × (8/4) | 8 RCU |
| Transactional | (8 × 2) × (8/4) | 32 RCU |

### Transactional WCU
```
WCU = (writes/sec) × ceil(item_size_KB / 1) × 2
```

---

## 6. Write APIs

| API | Behavior |
|---|---|
| **PutItem** | Creates OR fully replaces existing item — full overwrite |
| **UpdateItem** | Edits specific attributes only — partial update |
| **DeleteItem** | Deletes a single item (supports conditional delete) |
| **DeleteTable** | Drops entire table instantly |
| **BatchWriteItem** | Up to 25 PutItem + DeleteItem; 16 MB total; **no UpdateItem** |

> To wipe a table → **DeleteTable + recreate** (NOT Scan + delete — too slow and expensive)

---

## 7. Read APIs

| API | Behavior |
|---|---|
| **GetItem** | Exactly 1 item by PK. Returns 0 or 1 item only. |
| **Query** | Items for a specific PK. Optional SK filter. Up to 1 MB. |
| **Scan** | Reads entire table. Very inefficient. Up to 1 MB per call. |
| **BatchGetItem** | Up to 100 items, 16 MB total. Across multiple tables. |

**FilterExpression:** Server-side filter applied AFTER reading — does **NOT reduce RCU**. Cannot filter on key attributes.

**ProjectionExpression:** Return only specific attributes — saves bandwidth.

**Query vs Scan:**
| | Query | Scan |
|---|---|---|
| Reads | Items with matching PK only | Entire table |
| Efficiency | Efficient ✅ | Very inefficient ❌ |
| Use case | Normal queries | Data export / analytics |

---

## 8. Conditional Writes (ConditionExpression)

A write check that runs before the operation. If false → write is rejected with `ConditionalCheckFailedException`.

Applies to: **PutItem, UpdateItem, DeleteItem, BatchWriteItem**

| Condition | Description |
|---|---|
| `attribute_exists(attr)` | Attribute must exist |
| `attribute_not_exists(attr)` | Attribute must NOT exist |
| `attribute_type(attr, type)` | Check data type |
| `contains(attr, value)` | String/set contains value |
| `begins_with(attr, prefix)` | String starts with prefix |
| `IN`, `between`, `size` | Value checks |
| `=`, `<>`, `<`, `>`, `<=`, `>=` | Comparisons |

**Key pattern — safe upsert (never overwrite):**
```
PutItem with: attribute_not_exists(pk)
→ Only creates if item doesn't exist
→ ConditionalCheckFailedException if item already exists
```

**FilterExpression vs ConditionExpression:**
| | FilterExpression | ConditionExpression |
|---|---|---|
| Side | Read operations | Write operations |
| Purpose | Filter results to client | Guard the write |
| RCU effect | None (reads happen first) | N/A (write side) |

---

## 9. Indexes: LSI vs GSI

| | LSI | GSI |
|---|---|---|
| Partition key | Same as base table | Different from base table |
| Sort key | Different from base table | Optional, different |
| Created | At table creation ONLY | Anytime (add/modify after) |
| Capacity | Shares main table RCU/WCU | Own provisioned RCU/WCU |
| Throttling gotcha | None | GSI throttle → main table throttles ⚠️ |
| Max per table | 5 | 20 |

**LSI use case:** Query same PK, different sort/filter attribute.
**GSI use case:** Query on a non-key attribute (different partition key altogether).

> **GSI throttling is a critical exam trap:** GSI WCU too low → both GSI AND main table are throttled, even if main table has plenty of capacity.

---

## 10. PartiQL

SQL-like interface for DynamoDB. Same capabilities as the native APIs, just SQL syntax.

- Supports: `SELECT`, `INSERT`, `UPDATE`, `DELETE`
- **No JOINs** (DynamoDB is NoSQL)
- Can run batch queries across multiple tables
- Available in: Console, NoSQL Workbench, DynamoDB APIs, CLI, SDK

---

## 11. Optimistic Locking

Strategy to prevent lost updates when multiple clients write to the same item.

**Pattern:**
1. Each item has a `version` attribute
2. Read item + its version
3. Write with condition: `version = <version you read>`
4. If someone else modified it → version won't match → `ConditionalCheckFailedException`
5. Client re-reads and retries

```
Item: { user_id: "u1", name: "Bob", version: 1 }

Client 1: SET name = "John" IF version = 1  ✅ → version becomes 2
Client 2: SET name = "Lisa" IF version = 1  ❌ → ConditionalCheckFailedException
```

DynamoDB supports **optimistic locking only** — no pessimistic locking (no blocking locks).

---

## 12. DAX — DynamoDB Accelerator

Fully managed **in-memory cache** for DynamoDB.

- **Microsecond latency** on cache hits (vs single-digit ms for DynamoDB)
- **No application code changes** — transparent, same DynamoDB API
- Solves hot key / hot partition read throttling
- Default TTL: **5 minutes**
- Up to **10 nodes** per cluster
- Minimum **3 nodes** recommended for production (Multi-AZ)

```
App → DAX cluster → DynamoDB (only on cache miss)
            ↑ microsecond latency on hits
```

**DAX vs ElastiCache:**
| | DAX | ElastiCache |
|---|---|---|
| Caches | Raw items / query results | Aggregated/computed results |
| Integration | Transparent (same API) | Manual (app manages explicitly) |
| Use case | Hot key relief, read-heavy tables | Expensive computation results |

They can be used together: DAX for raw data, ElastiCache for computed aggregations.

---

## 13. DynamoDB Streams

Ordered stream of item-level changes (CREATE, UPDATE, DELETE).

- Retention: **24 hours** — must consume or persist within window
- Shards are **auto-managed** by AWS (unlike Kinesis)
- Enabling streams does **NOT backfill** past changes

**View Types:**
| Type | Included |
|---|---|
| `KEYS_ONLY` | Key attributes only |
| `NEW_IMAGE` | Entire item after the change |
| `OLD_IMAGE` | Entire item before the change |
| `NEW_AND_OLD_IMAGES` | Both versions — see exactly what changed |

**Consumers:**
- Kinesis Data Streams → Firehose → Redshift / S3 / OpenSearch
- AWS Lambda via Event Source Mapping (polls, invokes synchronously with batches)
- KCL Application on EC2

**Lambda integration:** Event Source Mapping polls the stream → invokes Lambda synchronously with a batch of records. Lambda needs IAM permissions to read the stream.

**Use cases:** real-time reactions, cross-region replication (Global Tables use Streams), derivative tables, OpenSearch indexing, audit trails.

---

## 14. DynamoDB TTL

Automatic item deletion after an expiration timestamp.

- Define a TTL attribute (any name) — must be **Number** type (Unix Epoch timestamp)
- When current time > TTL value → item marked for deletion
- **Free — no WCU consumed**
- Deletion happens within **48 hours** of expiration (up to 48h delay)
- Expired but not-yet-deleted items still appear in reads → **filter client-side**
- TTL deletes appear in **DynamoDB Streams** → recoverable
- Items removed from **LSIs and GSIs** automatically

---

## 15. DynamoDB CLI Pagination

| Parameter | Behavior |
|---|---|
| `--page-size` | Smaller internal API calls → avoids timeouts. Returns all items. |
| `--max-items` | Limits items returned. Returns `NextToken` for next page. |
| `--starting-token` | Use `NextToken` from previous call to continue pagination. |

```
page-size → no limit on total, avoids API timeout
max-items → true user-facing pagination
```

---

## 16. Transactions

All-or-nothing operations across one or more items/tables. ACID guaranteed.

- **A**tomicity — all or nothing
- **C**onsistency — always valid state
- **I**solation — transactions don't interfere
- **D**urability — committed data persists

**APIs:**
- `TransactGetItems` — batch of GetItem operations (atomic read)
- `TransactWriteItems` — batch of PutItem / UpdateItem / DeleteItem (atomic write)

**Cost: 2× WCU and 2× RCU** (two phases: prepare + commit)

```
Transactional WCU = (writes/sec) × ceil(item_size_KB / 1) × 2
Transactional RCU = (reads/sec × 2) × ceil(item_size_KB / 4)
```

---

## 17. Session State

| Service | Shared? | Best for |
|---|---|---|
| **DynamoDB** | ✅ | Serverless / auto-scaling session store |
| **ElastiCache** | ✅ | In-memory, ultra-fast session store |
| **EFS** | ✅ | File-based session sharing for EC2 |
| **EBS** | ❌ (local only) | Cannot share across instances |
| **Instance Store** | ❌ (local only) | Cannot share across instances |
| **S3** | ✅ (but high latency) | Not suitable for session state |

**Exam keywords:**
- "in-memory" / "fastest" → **ElastiCache**
- "serverless" / "auto-scaling" → **DynamoDB**

---

## 18. Write Sharding (Partitioning Strategies)

**Problem:** Low-cardinality partition keys (e.g. only 2 values) → hot partitions.

**Solution:** Add a random or calculated suffix to the partition key to spread writes across more partitions.

| Strategy | How | Trade-off |
|---|---|---|
| Random suffix | Append random number (e.g. 1–20) | Maximum distribution; complex reads |
| Calculated suffix | Hash-based suffix | Deterministic; still complex reads |

Reads become harder: must query all shards and aggregate in application code.

---

## 19. Write Types

| Type | Both succeed? | Final value | Use case |
|---|---|---|---|
| **Concurrent** | ✅ both | Last write wins (silent overwrite) | Bug — avoid |
| **Conditional** | ❌ one fails | Clean, one winner | Optimistic locking |
| **Atomic** | ✅ both | Sum of all increments | Counters, stats |
| **Batch** | ✅ (no error) | All applied | Efficiency |

- Atomic counters are **not idempotent** — retrying will increment again
- Concurrent writes = silent overwrite problem → solve with Conditional Writes

---

## 20. Patterns with S3

### Large Object Pattern
DynamoDB max item = 400 KB. For large files: store in S3, store metadata + URL pointer in DynamoDB.

```
Write: App → S3 (file) + DynamoDB (metadata + S3 URL)
Read:  Client → DynamoDB (fast metadata) → S3 (actual file)
```

### S3 Metadata Indexing Pattern
S3 is not queryable. To search S3 objects: use Event Notifications → Lambda → DynamoDB index.

```
Upload → S3 → Event Notification → Lambda → DynamoDB (metadata index)
Query DynamoDB → get S3 keys → fetch from S3
```

---

## 21. Operations (Table Cleanup & Copying)

**Cleanup:**
- ❌ Scan + DeleteItem — slow and expensive (consumes RCU + WCU)
- ✅ **DeleteTable + recreate** — instant, cheap

**Copying a table:**
| Method | Notes |
|---|---|
| **AWS Backup** | Backup → restore to same or different account. Simple. |
| **AWS Glue** | ETL service, good for transformations during copy. |
| Custom code (Scan + BatchWriteItem) | Most effort, not recommended. |

---

## 22. Security & Other Features

### Security
| Feature | Details |
|---|---|
| VPC Endpoints | Access DynamoDB privately, no public internet |
| IAM | Full access control per table/operation |
| Encryption at rest | AWS KMS (managed or customer-managed keys) |
| Encryption in transit | SSL / TLS |

### Backup & Restore
| Type | Details |
|---|---|
| **PITR** (Point-in-Time Recovery) | Restore to any point in time, no performance impact |
| **On-demand backup** | Manual backup, restore when needed |

### Global Tables
- Multi-region, multi-active, fully replicated
- Reads AND writes accepted in ANY region
- **Requires DynamoDB Streams to be enabled** (replication uses Streams under the hood)

### DynamoDB Local
- Local simulation of DynamoDB running on your computer
- For development and testing only — no AWS needed, no cost

### AWS DMS (Database Migration Service)
- Migrate data to/from DynamoDB
- Supports: MongoDB → DynamoDB, DynamoDB → Oracle/MySQL/S3, etc.

### Fine-Grained Access Control
**Problem:** Mobile/web clients need per-user DynamoDB access at scale — can't create individual IAM users.

**Solution:** Federated login → temporary credentials → IAM role with conditions.

```
User → Identity Provider (Cognito, Google, SAML, OpenID)
     → Temporary AWS credentials
     → IAM Role with conditions:
         LeadingKeys: user can only access items where PK = their own identity
         Attributes: user can only see specific attributes
```

```json
"Condition": {
  "ForAllValues:StringEquals": {
    "dynamodb:LeadingKeys": ["${cognito-identity.amazonaws.com:sub}"]
  }
}
```

- **LeadingKeys** = row-level security (restrict by PK)
- **Attributes condition** = column-level security (restrict by attribute)

---

## Consolidated Exam Tips

### Capacity & Formulas
- WCU: 1 KB boundary, round UP → `(writes/sec) × ceil(KB/1)`
- RCU: 4 KB boundary, round UP → strongly: `reads × ceil(KB/4)`, eventually: `(reads/2) × ceil(KB/4)`
- Transactional: always **2× WCU and 2× RCU**
- On-demand = ~2.5× more expensive; switch modes once per **24h**
- `ProvisionedThroughputExceededException` → exponential backoff

### APIs
- PutItem = full replace; UpdateItem = partial update
- GetItem returns 0 or 1 item only
- FilterExpression does NOT reduce RCU — reads happen first
- BatchWriteItem has NO UpdateItem support
- Scan is inefficient — prefer Query
- Table cleanup → DeleteTable + recreate (not Scan + delete)

### Indexes
- LSI = same PK, different SK → creation time only, shared capacity
- GSI = different PK → add any time, own capacity → GSI throttle = main table throttle ⚠️

### Streams & Events
- Streams retention = **24 hours**, shards auto-managed
- Lambda reads via Event Source Mapping → synchronous invocation
- `NEW_AND_OLD_IMAGES` = see exactly what changed
- Global Tables require Streams enabled

### TTL
- Number type (Unix Epoch), free, up to **48h delay**, expired items still visible → filter client-side
- TTL deletes appear in Streams → recoverable

### Caching
- DAX = microsecond latency, no code changes, default TTL 5 min, max 10 nodes, min 3 for HA
- DAX = raw item cache; ElastiCache = aggregated/computed result cache

### Transactions
- ACID, 2× cost, prepare + commit phases
- TransactGetItems / TransactWriteItems

### Session State Keywords
- "in-memory" → ElastiCache | "serverless/auto-scaling" → DynamoDB

### Security
- Global Tables = multi-region multi-active → **requires Streams**
- LeadingKeys = row-level security | Attributes condition = column-level security
- DynamoDB Local = dev/test simulation, no AWS
- DMS = migration tool (e.g. MongoDB → DynamoDB)
