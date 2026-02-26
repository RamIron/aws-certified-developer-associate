# Section 8 Summary — RDS + Aurora + ElastiCache

## Lessons

| # | Lesson | Status |
|---|--------|--------|
| 8.1 | Amazon RDS Overview | Completed (PERFECT) |
| 8.2 | RDS Read Replicas vs Multi AZ | Completed (PERFECT) |
| 8.3 | Amazon RDS Hands On | Skipped |
| 8.4 | Amazon Aurora | Completed (PERFECT) |
| 8.5 | Amazon Aurora Hands On | Skipped |
| 8.6 | RDS & Aurora Security | Completed (PERFECT) |
| 8.7 | RDS Proxy | Completed (PERFECT) |
| 8.8 | ElastiCache Overview | Completed (PERFECT) |
| 8.9 | ElastiCache Hands On | Skipped |
| 8.10 | ElastiCache Strategies | Completed (PERFECT) |
| 8.11 | Amazon MemoryDB for Redis | Completed (PERFECT) |
| 8.12 | Udemy Quiz | 16/22 |

---

## Amazon RDS

### Core Concepts
- **Managed SQL database service** — AWS handles patching, backups, monitoring, scaling
- **No SSH access** (except RDS Custom)
- Storage backed by **EBS**
- 7 engines: PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, IBM DB2, Aurora

### Storage Auto Scaling
- Automatically increases storage when running low
- Triggers when: <10% free, for >5 minutes, 6-hour cooldown since last modification
- Set a **Maximum Storage Threshold** to cap growth

### Read Replicas vs Multi AZ

| Feature | Read Replicas | Multi AZ |
|---------|--------------|----------|
| **Purpose** | Scale reads | Disaster recovery |
| **Replication** | Asynchronous | Synchronous |
| **Consistency** | Eventually consistent | Fully consistent |
| **Max count** | 15 | 1 standby |
| **Readable?** | Yes (SELECT only) | No (standby only) |
| **Cross region?** | Yes | No |
| **Network cost** | Free same region, paid cross region | N/A |

- Read Replicas can also be set up as Multi AZ
- Single AZ → Multi AZ = **zero downtime** (snapshot → restore → sync)

---

## Amazon Aurora

### Core Concepts
- **AWS proprietary**, compatible with MySQL & PostgreSQL drivers
- **5x faster** than MySQL on RDS, **3x faster** than PostgreSQL on RDS
- ~20% more expensive, but more efficient at scale
- Storage auto-grows **10 GB → 256 TB**

### High Availability
- **6 copies** across **3 AZs** (4/6 for writes, 3/6 for reads)
- **Self-healing** via peer-to-peer replication
- Failover **< 30 seconds**, any replica can become master
- Up to **15 Read Replicas** with auto-scaling, **< 10ms** replica lag

### Endpoints

| Endpoint | Points To | Purpose |
|----------|-----------|---------|
| **Writer Endpoint** | Always the master | Writes — auto-redirects on failover |
| **Reader Endpoint** | All read replicas (load balanced) | Reads — connection-level LB |

- **Backtrack**: restore to any point in time without backups

---

## RDS & Aurora Security

| Layer | Detail |
|-------|--------|
| **At-rest encryption** | KMS, defined at launch. Unencrypted master = unencrypted replicas |
| **In-flight encryption** | TLS by default |
| **Authentication** | Username/password or **IAM roles** |
| **Network** | Security groups |
| **SSH** | Not available (except RDS Custom) |
| **Audit logs** | Send to CloudWatch Logs for retention |

- To encrypt existing unencrypted DB: **snapshot → restore as encrypted**

---

## RDS Proxy

- **Fully managed database proxy** — connection pooling
- Reduces DB stress (CPU, RAM, open connections)
- Reduces failover time by up to **66%**
- **Never publicly accessible** — VPC only
- Serverless, auto-scaling, multi-AZ
- IAM authentication + credentials in **Secrets Manager**
- **No code changes** — just change connection endpoint

### Supported Engines

| Engine | RDS Proxy |
|---|---|
| MySQL, PostgreSQL, MariaDB, SQL Server | ✅ |
| Aurora (MySQL & PostgreSQL) | ✅ |
| Oracle, IBM DB2 | ❌ |

### Lambda + RDS = RDS Proxy
Lambda spins up thousands of instances → each opens a DB connection → overwhelms DB. RDS Proxy pools all connections. This is **the** recommended pattern.

---

## ElastiCache

### Core Concepts
- **Managed in-memory cache** — Redis or Memcached
- High performance, low latency
- **Requires application code changes** (unlike RDS Proxy)
- Two main patterns:
  1. **DB query caching** — reduce read load
  2. **Session store** — make apps stateless

### Redis vs Memcached

| Feature | Redis | Memcached |
|---|---|---|
| **High Availability** | Multi-AZ with auto-failover | No HA |
| **Read Scaling** | Read replicas (up to 5 with cluster mode disabled) | No replicas |
| **Data Durability** | AOF persistence | No persistence |
| **Backup & Restore** | Yes | Only serverless version |
| **Data Structures** | Sets, sorted sets (leaderboards) | Simple key-value |
| **Architecture** | Replication | Sharding |
| **Multi-threaded** | No | Yes |

### Caching Strategies

| Strategy | How it works | Penalty | Stale data? |
|---|---|---|---|
| **Lazy Loading** (Cache-Aside) | Read: check cache → if miss, read DB → write to cache | Read penalty (3 calls on miss) | Yes |
| **Write Through** | Write: save to DB → also write to cache | Write penalty (2 calls on write) | No |
| **TTL** | Set expiration time on cached items | None | Controlled staleness |

- **Lazy Loading**: implement first, foundation for most apps
- **Write Through**: add on top to reduce staleness
- **Combine both** for best results
- Too many LRU evictions → scale up cache

### Pseudocode Patterns (exam may show these)
- **Read function** (get_user) checking cache first = **Lazy Loading**
- **Write function** (save_user) updating cache after DB = **Write Through**

---

## Amazon MemoryDB for Redis

| | ElastiCache Redis | MemoryDB for Redis |
|---|---|---|
| **Purpose** | Cache (in front of DB) | Database (replaces DB) |
| **Durability** | Data can be lost | Durable — Multi-AZ transaction log |
| **Performance** | High | Ultra-fast (160M+ req/sec) |
| **Scale** | Limited | Tens of GB to hundreds of TB |

---

## Consolidated Exam Tips

- **RDS**: managed SQL, 7 engines, no SSH, auto scaling storage (<10%, 5min, 6hr cooldown)
- **Read Replicas**: read scaling, async, up to 15, eventually consistent, free same region
- **Multi AZ**: disaster recovery, sync, NOT readable, zero downtime to enable
- **Aurora**: AWS proprietary, 6 copies/3 AZs, Writer + Reader endpoints, < 30s failover, Backtrack
- **Security**: KMS at rest (at launch), TLS in flight, IAM auth, snapshot → restore to encrypt
- **RDS Proxy**: connection pooling, 66% faster failover, VPC only, Lambda + RDS → Proxy, no Oracle/DB2
- **ElastiCache**: requires code changes, Redis (HA, persistence, sorted sets) vs Memcached (simple, sharding)
- **Lazy Loading**: read function, 3 calls on miss, stale data possible
- **Write Through**: write function, 2 calls on write, never stale, combine with Lazy Loading
- **MemoryDB**: durable in-memory DB (not a cache), Redis-compatible, 160M+ req/sec
- See "leaderboard" → **Redis sorted sets**
- See "Lambda + RDS" → **RDS Proxy**
- See "reduce read load" → **ElastiCache**
- See "durable in-memory database" → **MemoryDB**
- See "connection pooling" → **RDS Proxy**
- See "stateless app / session store" → **ElastiCache**
