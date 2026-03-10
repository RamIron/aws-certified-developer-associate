# Section 5 Summary - EC2 Fundamentals

## Lessons Covered
- 5.1 - AWS Budget Setup — skipped
- [5.2 - EC2 Basics](./5.2-EC2-Basics.md) — PERFECT 100%
- 5.3 - EC2 Instance with User Data Hands On — skipped
- [5.4 - EC2 Instance Types Basics](./5.4-EC2-Instance-Types-Basics.md) — PERFECT 100%
- [5.5 - Security Groups & Classic Ports Overview](./5.5-Security-Groups-and-Classic-Ports-Overview.md) — PERFECT 100%
- 5.6–5.13 — skipped (hands-on, SSH setup, instance connect)
- [5.14 - EC2 Instance Purchasing Options](./5.14-EC2-Instance-Purchasing-Options.md) — PASSED 75%

---

## Core Concepts

### EC2 Basics
- **EC2** = Elastic Compute Cloud = IaaS (Infrastructure as a Service)
- You rent virtual machines on demand
- EC2 ecosystem: instances, EBS volumes, ELB, Auto Scaling Groups
- **User Data** = bootstrap script that runs **once at first launch**, as root

### EC2 Instance Types

**Naming convention:** `m5.2xlarge` → class `m`, generation `5`, size `2xlarge`

| Category          | Optimized For                    | Prefixes   |
|-------------------|----------------------------------|------------|
| General Purpose   | Balanced compute/memory/network  | t, m       |
| Compute Optimized | High-performance CPU             | C          |
| Memory Optimized  | Large datasets in RAM            | R, X1, z1  |
| Storage Optimized | High sequential read/write       | I, D, H1   |

**Mnemonic:**
```
C  = Compute          (CPU go brrrr)
R  = RAM              (memory)
X  = eXtra large RAM  (XL t-shirt for your memory)
z  = Zillion bytes    (even more RAM)
I  = I/O              (read/write speed)
D  = Disk             (dense storage)
H  = HDD              (hard drives)
t  = Tiny             (free tier buddy)
m  = Medium           (jack of all trades)
```

### Security Groups
- Firewall for EC2 — control inbound and outbound traffic
- Only **allow** rules (no deny rules)
- Live **outside** the EC2 instance
- **Default:** all inbound blocked, all outbound allowed
- Can reference other security groups instead of IPs

**Troubleshooting:**
- **Timeout** = security group is blocking traffic
- **Connection refused** = traffic reached instance, app problem

**Classic Ports:**

| Port | Protocol | Used For                      |
|------|----------|-------------------------------|
| 22   | SSH      | Log into Linux instances      |
| 21   | FTP      | Upload files                  |
| 22   | SFTP     | Secure file transfer via SSH  |
| 80   | HTTP     | Unsecured websites            |
| 443  | HTTPS    | Secured websites              |
| 3389 | RDP      | Log into Windows instances    |

### EC2 Purchasing Options

| Option               | Discount | Commitment   | Best For                                |
|----------------------|----------|--------------|-----------------------------------------|
| On-Demand            | None     | None         | Short-term, unpredictable workloads     |
| Reserved Instances   | ~72%     | 1 or 3 years | Steady-state (e.g., databases)          |
| Convertible Reserved | ~66%     | 1 or 3 years | Long workloads, flexible instance type  |
| Savings Plans        | ~70%     | 1 or 3 years | Commit to $/hour, flexible size & OS    |
| Spot Instances       | ~90%     | None (can lose) | Batch jobs, resilient workloads      |
| Dedicated Hosts      | Expensive| On-demand or 1-3y | BYOL licensing, compliance         |
| Dedicated Instances  | —        | —            | Hardware dedicated to your account      |
| Capacity Reservations| None     | None         | Reserve capacity in specific AZ         |

**Resort analogy:**
- On-Demand = walk in, pay full price
- Reserved = book 1–3 years ahead, big discount
- Savings Plan = commit to $X/month, switch room types freely
- Spot = last-minute deal, can get kicked out
- Dedicated Host = book the entire building
- Capacity Reservation = book a room you may not use, still pay full price

---

## Exam Tips
- User Data runs once at first boot, with root privileges
- EC2 = IaaS; you manage the OS and applications
- Know 4 instance categories: General, Compute, Memory, Storage
- SSH (port 22) = Linux; RDP (port 3389) = Windows
- Timeout = security group issue; Connection refused = app issue
- Spot = cheapest but unreliable — NEVER for databases or critical workloads
- Dedicated Host = licensing (BYOL) or compliance needs
- Capacity Reservation = no discount, just guarantees AZ availability
- Savings Plans: lock family+region, flexible on size/OS
- Reserved Instances: lock type+region+OS, convertible adds flexibility
