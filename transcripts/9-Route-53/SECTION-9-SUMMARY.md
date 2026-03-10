# Section 9 Summary - Route 53

## Lessons

| # | Lesson | Status |
|---|--------|--------|
| 9.1 | What is a DNS? | PERFECT |
| 9.2 | Route 53 Overview | REVIEW |
| 9.3-9.5 | Hands-on lessons | Skipped |
| 9.6 | Route 53 - TTL | PERFECT |
| 9.7 | Route 53 - CNAME vs Alias | PERFECT |
| 9.8 | Routing Policy - Simple | PERFECT |
| 9.9 | Routing Policy - Weighted | PERFECT |
| 9.10 | Routing Policy - Latency | PERFECT |
| 9.11 | Route 53 Health Checks | PERFECT |
| 9.12 | Health Checks Hands On | Skipped |
| 9.13 | Routing Policy - Failover | REVIEW |
| 9.14 | Routing Policy - Geolocation | PERFECT |
| 9.15 | Routing Policy - Geoproximity | PERFECT |
| 9.16 | Traffic Flow & Geoproximity Hands On | Skipped |
| 9.17 | Routing Policy - IP-based | PERFECT |
| 9.18 | Routing Policy - Multi Value | PERFECT |
| 9.19 | 3rd Party Domains & Route 53 | PERFECT |
| 9.20 | Section Cleanup | Skipped |
| 9.21 | Route 53 Quiz | Skipped (Udemy quiz) |

---

## DNS Fundamentals

### Domain Name Hierarchy
```
                    . (root)
                    │
            ┌───────┼───────┐
          .com    .org    .gov        ← TLD (Top Level Domain)
            │
       example.com                   ← SLD (Second Level Domain)
            │
      www.example.com                ← Subdomain
            │
  api.www.example.com                ← FQDN (Fully Qualified Domain Name)
```

### DNS Resolution Flow
```
Client → Local DNS → Root DNS → TLD DNS (.com) → SLD DNS (Route 53) → IP returned
```
- Local DNS **caches** results based on TTL

---

## Route 53 Overview

- **Fully managed, authoritative DNS** + Domain Registrar
- **Only AWS service with 100% availability SLA**
- Named after **port 53** (DNS port)
- Cost: **$0.50/month** per hosted zone, **$12+/year** for domain registration

### Record Types

| Type | Maps to |
|------|---------|
| **A** | Hostname → IPv4 |
| **AAAA** | Hostname → IPv6 |
| **CNAME** | Hostname → another hostname (NOT for zone apex) |
| **NS** | Name servers for the hosted zone |

### Hosted Zones

| | Public | Private |
|--|--------|---------|
| **Resolves** | Public domain names | Private domain names |
| **Accessible from** | Internet | VPC only |

---

## TTL (Time To Live)

- How long clients **cache** a DNS record (in seconds)
- **High TTL** = cheaper, slow updates | **Low TTL** = expensive, fast updates
- Mandatory for all records **except Alias**
- Strategy: lower TTL → wait → change record → raise TTL back

---

## CNAME vs Alias

| Feature | CNAME | Alias |
|---------|-------|-------|
| **Points to** | Any hostname | AWS resources only |
| **Zone apex (root)?** | **Not allowed** | **Works** |
| **Cost** | Charged per query | **Free** |
| **Health checks** | No | Yes |
| **TTL** | You set it | Automatic |

### Alias Targets
ELB, CloudFront, API Gateway, Beanstalk, S3 Websites, VPC Endpoints, Global Accelerator, Route 53 records

**NOT an Alias target: EC2 DNS name**

---

## Health Checks

### Three Types

| Type | Monitors |
|------|----------|
| **Endpoint** | Public resource directly (ALB, EC2) |
| **Calculated** | Combines up to 256 child health checks (OR/AND/NOT) |
| **CloudWatch Alarm** | CloudWatch Alarm state (for **private resources**) |

### Endpoint Details
- **~15 global checkers**, healthy if **>18%** report healthy
- Interval: **30s** (regular) or **10s** (fast, higher cost)
- Protocols: HTTP, HTTPS, TCP
- Can check text in first **5,120 bytes** of response
- **Must allow Route 53 health checker IPs in security group**

### Private Resources
```
Private EC2 → CloudWatch Metric → CloudWatch Alarm → Health Check
```

---

## Routing Policies Comparison

| Policy | Routes by | Health Checks | Key Signal |
|--------|-----------|---------------|------------|
| **Simple** | Single resource (or random from multiple) | **No** | Basic, no frills |
| **Weighted** | Percentage (weight / total) | Yes | "Split traffic %" |
| **Latency** | Lowest latency AWS region | Yes | "Best performance" |
| **Failover** | Primary/Secondary (active-passive) | Yes (mandatory on primary) | "Disaster recovery" |
| **Geolocation** | User's country/continent/US state | Yes | "Localization, restrict by country" |
| **Geoproximity** | Distance + bias adjustment | Yes | "Shift traffic between regions" |
| **IP-based** | Client's CIDR block | Yes | "Known IP ranges, specific ISP" |
| **Multi-Value** | Multiple healthy records (up to 8) | Yes | "Like Simple but with health checks" |

### Policy Details

**Simple**
- Can return multiple IPs → client picks randomly
- No health checks → unhealthy resources may be returned
- Alias: only one AWS resource

**Weighted**
- Weights are relative (don't need to sum to 100)
- Weight = 0 → stop traffic to that resource
- Use case: testing new versions, gradual migration

**Latency**
- You specify the region per record
- Latency ≠ geographic distance (network speed, not proximity)

**Failover**
- Only 2 records: 1 primary + 1 secondary
- Health check on primary = **mandatory**, on secondary = optional
- Automatic failover AND automatic fail-back

**Geolocation**
- Precision: US State > Country > Continent > Default
- **Default record required** — unmatched users get no response without it
- Use cases: localization, content restriction

**Geoproximity**
- Bias: positive = more traffic, negative = less traffic
- Non-AWS resources need **latitude & longitude**
- Requires **Route 53 Traffic Flow** ($50/month per policy record)

**IP-based**
- Define CIDR-to-location mappings yourself
- Use case: route known ISP traffic to specific endpoints

**Multi-Value**
- Returns up to **8 healthy records** per query
- Client picks one (client-side load balancing)
- **Not a substitute for ELB**

---

## 3rd Party Domains

- **Domain Registrar ≠ DNS Service** (different things)
- You can buy on GoDaddy + use Route 53 as DNS
- How: create public hosted zone → update **NS records** on the registrar to Route 53's name servers

---

## Consolidated Exam Tips

1. Route 53 = **only AWS service with 100% availability SLA**
2. **CNAME cannot be used at zone apex** → use Alias (free, supports health checks)
3. **EC2 DNS name is NOT a valid Alias target**
4. Health check on Failover primary is **mandatory**
5. **Security groups must allow Route 53 health checker IPs**
6. **Private resources** → CloudWatch Metric → Alarm → Health Check
7. "Localization / restrict by country" → **Geolocation** (needs default record)
8. "Shift traffic between regions" → **Geoproximity** (uses bias)
9. "Known IP ranges / ISP" → **IP-based** (uses CIDR blocks)
10. "Multiple healthy IPs returned" → **Multi-Value** (up to 8, not a replacement for ELB)
11. Simple routing = **no health checks** (Multi-Value = Simple + health checks)
12. Latency ≠ geographic distance — it's about network speed
13. Domain Registrar ≠ DNS Service — can mix and match (update NS records)
