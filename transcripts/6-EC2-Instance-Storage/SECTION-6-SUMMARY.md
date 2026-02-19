# Section 6 Summary - EC2 Instance Storage

## Lessons Covered
- [6.1 - EBS Overview](./6.1-EBS-Overview.md) — PERFECT 100%
- 6.2 - EBS Hands On — skipped
- [6.3 - EBS Snapshots](./6.3-EBS-Snapshots.md) — PERFECT 100%
- 6.4 - EBS Snapshots Hands On — skipped
- [6.5 - AMI Overview](./6.5-AMI-Overview.md) — PERFECT 100%
- 6.6 - AMI Hands On — skipped
- [6.7 - EC2 Instance Store](./6.7-EC2-Instance-Store.md) — PERFECT 100%
- [6.8 - EBS Volume Types](./6.8-EBS-Volume-Types.md) — PERFECT 100%
- [6.9 - EBS Multi-Attach](./6.9-EBS-Multi-Attach.md) — PERFECT 100%
- [6.10 - Amazon EFS](./6.10-Amazon-EFS.md) — PASSED 75%
- 6.11 - Amazon EFS Hands On — skipped
- [6.12 - EFS vs EBS](./6.12-EFS-vs-EBS.md) — PERFECT 100%
- 6.13 - EBS & EFS Section Cleanup — skipped

---

## Core Concepts

### 1. EBS (Elastic Block Store)
- **Network drive** attached to EC2 — not physical, slight latency possible
- **AZ-locked** — cannot attach to an instance in a different AZ
- Persists data after instance termination
- One volume → one instance at a time (exception: Multi-Attach for io1/io2)
- One instance → multiple volumes allowed
- **Delete on Termination:**
  - Root volume: deleted by default
  - Additional volumes: kept by default

### 2. EBS Snapshots
- Point-in-time backup of an EBS volume
- Not required to detach first, but recommended
- Used to **migrate EBS volumes across AZs or Regions**

| Feature               | What it does                                  | Key Detail                        |
|-----------------------|-----------------------------------------------|-----------------------------------|
| Snapshot Archive      | Move snapshot to cheaper archive tier         | 75% cheaper, 24–72h restore time  |
| Recycle Bin           | Recover accidentally deleted snapshots        | Retention: 1 day to 1 year        |
| Fast Snapshot Restore | Full initialization, no latency on first use  | Costs more                        |

### 3. AMI (Amazon Machine Image)
- Customization of an EC2 instance (OS + software + config)
- Benefit: faster boot — software is pre-packaged
- **Region-specific** — can be copied across regions

| Type           | Description                                   |
|----------------|-----------------------------------------------|
| Public AMI     | Provided by AWS (e.g., Amazon Linux 2)        |
| Custom AMI     | Created and maintained by you                 |
| Marketplace AMI| Made by third-party vendors                   |

**AMI creation process:**
1. Launch + customize EC2 instance
2. Stop the instance (data integrity)
3. Build AMI → creates EBS snapshots behind the scenes
4. Launch new instances from the AMI

### 4. EC2 Instance Store
- **Physical** hard drive attached to the host hardware
- Fastest storage option (millions of IOPS vs thousands for EBS)
- **Ephemeral** — data lost on stop or terminate
- Good for: buffer, cache, scratch data, temp content
- Backup/replication is your responsibility

### 5. EBS Volume Types

| Type | Family | Max IOPS  | Max Throughput | Boot? | Best For                    |
|------|--------|-----------|----------------|-------|-----------------------------|
| gp2  | SSD    | 16,000    | 250 MiB/s      | ✅    | General workloads (legacy)  |
| gp3  | SSD    | 16,000    | 1,000 MiB/s    | ✅    | General workloads (current) |
| io1  | SSD    | 64,000    | 1,000 MiB/s    | ✅    | High IOPS databases         |
| io2  | SSD    | 256,000   | 4,000 MiB/s    | ✅    | Mission-critical, max IOPS  |
| st1  | HDD    | 500       | 500 MiB/s      | ❌    | Big data, logs, ETL         |
| sc1  | HDD    | 250       | 250 MiB/s      | ❌    | Cold archives, lowest cost  |

**gp2 vs gp3:** gp2 IOPS tied to size (3/GiB); gp3 IOPS independent from size
**Boot volumes:** SSD only (gp2, gp3, io1, io2)
**>16K IOPS:** io1 or io2; **>64K IOPS:** io2 Block Express only; **max IOPS:** requires Nitro EC2

**Volume type decision tree:**
```
Need a BOOT volume?
├── NO  → Can use st1 or sc1 (HDD)
└── YES → Must use SSD (gp2, gp3, io1, io2)
          │
          ├── Need >16,000 IOPS?
          │   ├── YES → io1 or io2
          │   │         ├── Need >64,000 IOPS? → io2 Block Express (max 256K)
          │   │         └── Need max IOPS?     → must use Nitro EC2
          │   └── NO  → gp2 or gp3
          │             └── Need independent IOPS/throughput? → gp3
          │
          └── Throughput-intensive, no high IOPS?
              ├── Frequently accessed → st1
              └── Infrequently accessed / cheapest → sc1
```

### 6. EBS Multi-Attach
- Attach **same EBS volume to multiple EC2 instances simultaneously**
- **io1 and io2 only**
- All instances in the **same AZ**
- Max **16 EC2 instances** per volume
- Requires **cluster-aware file system** (not XFS or EXT4)
- Use cases: clustered Linux apps (e.g., Teradata), concurrent writes

### 7. Amazon EFS (Elastic File System)
- Managed **NFS** (Network File System)
- Mount on **hundreds of EC2 instances across multiple AZs**
- **Linux only** (POSIX) — not compatible with Windows
- ~3x more expensive than gp2, but **pay-per-use**
- Requires a **security group**; encryption via KMS
- NFS protocol uses **port 2049**

**Performance Modes** (set at creation):

| Mode            | Latency | Throughput | Best For                        |
|-----------------|---------|------------|---------------------------------|
| General Purpose | Low     | Normal     | Web servers, CMS (default)      |
| Max I/O         | Higher  | Very high  | Big data, media processing      |

**Throughput Modes:**

| Mode        | How It Works                              | Best For                    |
|-------------|-------------------------------------------|-----------------------------|
| Bursting    | Scales with storage size                  | Variable workloads           |
| Provisioned | Set independently of storage size         | Known high-throughput needs  |
| Elastic     | Auto-scales up/down (up to 3 GiB/s reads) | Unpredictable workloads ✅  |

**Storage Tiers:**

| Tier     | Access Pattern              | Cost                         |
|----------|-----------------------------|------------------------------|
| Standard | Frequently accessed         | Higher                       |
| EFS-IA   | Infrequent access           | Lower storage + retrieval fee|
| Archive  | Rarely accessed (few/year)  | Cheapest                     |

- **Lifecycle policies** move files between tiers automatically
- **One Zone-IA** = cheapest EFS option (single AZ + infrequent access)
- Up to **90% cost savings** with right tier selection

**Availability:**

| Option   | AZ Coverage | Use Case   |
|----------|-------------|------------|
| Standard | Multi-AZ    | Production |
| One Zone | Single AZ   | Dev/Test   |

### 8. EBS vs EFS vs Instance Store

| Feature          | Instance Store     | EBS                      | EFS                     |
|------------------|--------------------|--------------------------|-------------------------|
| Attachment       | Physical (1 host)  | 1 instance (network)     | Hundreds (network)      |
| AZ scope         | Single AZ          | Single AZ                | Cross-AZ                |
| Persistence      | Ephemeral          | Persistent               | Persistent              |
| OS compatibility | Linux + Windows    | Linux + Windows          | Linux only              |
| Speed            | Fastest            | Fast                     | Slower (network)        |
| Use case         | Temp cache/buffer  | Databases, root volumes  | Shared files, WordPress |

---

## Exam Tips
- EBS = network drive, AZ-locked, persistent; Instance Store = physical, ephemeral, fastest
- Migrate EBS across AZs → snapshot + restore
- EBS backups consume IO — avoid during peak traffic
- Root EBS deleted on termination by default (configurable)
- AMI creates EBS snapshots behind the scenes; stop instance first for integrity
- Only SSD volumes can be boot volumes (gp2, gp3, io1, io2)
- gp3 decouples IOPS from size; gp2 ties them together
- io2 Block Express = up to 256K IOPS; requires Nitro EC2 for max performance
- Multi-Attach: io1/io2 only, same AZ, max 16 instances, cluster-aware FS required
- EFS = Linux only, cross-AZ, pay-per-use, ~3x cost of gp2
- EFS Elastic throughput = best for unpredictable workloads
- EFS One Zone-IA = most cost-effective option
- "Shared access across instances/AZs" → EFS; "single instance block storage" → EBS; "fastest temp storage" → Instance Store
