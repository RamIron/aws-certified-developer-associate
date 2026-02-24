# Section 7 Summary - AWS Fundamentals: ELB + ASG

## Lessons

| # | Lesson | Status |
|---|--------|--------|
| 7.1 | High Availability and Scalability | PERFECT 100% |
| 7.2 | Elastic Load Balancing (ELB) Overview | PERFECT 100% |
| 7.3 | Note: About the Classic Load Balancer (CLB) | Skipped (deprecated) |
| 7.4 | Application Load Balancer (ALB) | PERFECT 100% |
| 7.5 | ALB - Hands On Part 1 | Skipped |
| 7.6 | ALB - Hands On Part 2 | Skipped |
| 7.7 | Network Load Balancer (NLB) | PERFECT 100% |
| 7.8 | NLB - Hands On | Skipped |
| 7.9 | Gateway Load Balancer (GWLB) | PERFECT 100% |
| 7.10 | ELB Sticky Sessions | PERFECT 100% |
| 7.11 | ELB Cross Zone Load Balancing | PERFECT 100% |
| 7.12 | ELB SSL Certificates | PERFECT 100% |
| 7.13 | ELB SSL Certificates - Hands On | Skipped |
| 7.14 | ELB Connection Draining | PERFECT 100% |
| 7.15 | Auto Scaling Groups (ASG) Overview | REVIEW 67% |
| 7.16 | ASG - Hands On | Skipped |
| 7.17 | ASG Scaling Policies | PERFECT 100% |
| 7.18 | ASG Scaling Policies - Hands On | Skipped |
| 7.19 | ASG Instance Refresh | REVIEW 50% |
| 7.20 | High Availability & Scalability Quiz | Udemy quiz 14/20 |

---

## Key Concepts

### Scalability & High Availability

| Concept | Definition | Enabled By |
|---------|-----------|------------|
| Vertical Scaling | Bigger instance (scale up/down) | Hardware limit |
| Horizontal Scaling | More instances (scale out/in) | ASG + ELB |
| High Availability | Multi-AZ deployment, survive AZ failure | ASG multi-AZ + ELB multi-AZ |

### Elastic Load Balancers — Comparison

| Feature | ALB | NLB | GWLB |
|---------|-----|-----|------|
| **Layer** | 7 (HTTP/HTTPS) | 4 (TCP/UDP) | 3 (IP) |
| **Use case** | Web apps, microservices, containers | Extreme performance, static IPs | Network traffic inspection |
| **Protocol** | HTTP, HTTPS, WebSocket | TCP, UDP, TLS | GENEVE (port 6081) |
| **Static IP** | No (DNS name only) | Yes (Elastic IP per AZ) | No |
| **Target groups** | EC2, ECS, Lambda, private IPs | EC2, private IPs, ALB | EC2, private IPs |
| **Health checks** | HTTP/HTTPS | TCP, HTTP, HTTPS | TCP, HTTP, HTTPS |

### ALB Routing Rules
Routes to different target groups based on: **URL path**, **hostname**, **query string**, **headers**

### Client IP with ALB
ALB performs **connection termination** — EC2 sees ALB's private IP. Real client IP is in **X-Forwarded-For** header.

### NLB in Front of ALB
Combines static IPs (NLB) + HTTP routing (ALB).

### Sticky Sessions
- Same client → same instance
- ALB: **cookies** (application-based or duration-based)
- NLB: **source IP** (no cookies)
- Configured at **target group level**
- Reserved cookie names: AWSALB, AWSALBAPP, AWSALBTG
- Trade-off: can cause **load imbalance**

### Cross Zone Load Balancing

| Load Balancer | Default | Inter-AZ Charges |
|---------------|---------|-------------------|
| ALB | **ON** | No charges |
| NLB | **OFF** | Charges apply |
| GWLB | **OFF** | Charges apply |

- With cross zone: traffic distributed across ALL instances in ALL AZs
- Without: traffic stays within each AZ (can cause imbalance)

### SSL/TLS Certificates
- Load balancers perform **SSL termination** (decrypt HTTPS, forward HTTP to instances)
- **ACM** (AWS Certificate Manager) manages certificates with auto-renewal
- **SNI** allows multiple SSL certificates on one load balancer (ALB & NLB)

### Connection Draining (Deregistration Delay)
- In-flight requests get time to complete when instance is deregistered/unhealthy
- ELB stops sending **new** requests to draining instance
- Default: **300 seconds** | Range: 1-3,600 | Disable: set to 0

### Auto Scaling Groups (ASG)

**Capacity:** minimum, desired, maximum
**Launch template:** blueprint for EC2 instances (AMI, instance type, user data, etc.)
**ASGs are free** — you pay for the EC2 instances

**ASG + ELB superpowers:**
- New instances auto-registered with ELB
- Unhealthy instances terminated and replaced (self-healing)
- ELB distributes traffic to new instances automatically

### ASG Scaling Policies

| Type | How It Works |
|------|-------------|
| **Target Tracking** | Set metric + target value, ASG adjusts automatically |
| **Simple / Step** | CloudWatch alarm triggers → add/remove instances |
| **Scheduled** | Scale at specific time (known patterns) |
| **Predictive** | ML forecasts from historical data, schedules ahead |

**Scaling Cooldown:** 300 seconds default — no scaling during this period to let metrics stabilize.

### ASG Instance Refresh
- Rolling replacement of all instances when launch template changes
- API: **StartInstanceRefresh**
- **Minimum healthy percentage** controls how many can be replaced at a time
- **Warm-up time** (fixed, does not auto-extend) ensures new instances are ready

---

## Consolidated Exam Tips

- **ELB provides a static DNS name** (not a static IP) — only NLB has static IPs
- **Static IP / firewall rules** → NLB
- **HTTP routing / microservices** → ALB
- **Network inspection / GENEVE / port 6081** → GWLB
- **Multiple SSL certs on one listener** → SNI (ALB & NLB)
- **EC2 only sees private IPs** → use X-Forwarded-For header
- **Scale based on app-specific metric** → Custom CloudWatch Metric (not detailed monitoring)
- **"Keep metric around X"** → Target Tracking scaling policy
- **Launch template** = where you change AMI, instance type, etc. (existing instances keep old config)
- **Instance Refresh** = how you roll out new launch template to all running instances
- Cross zone ON by default only for ALB (free) — NLB/GWLB off by default (charges apply)
- Sticky sessions cause load imbalance — NLB uses source IP, ALB uses cookies
- Connection draining default 300s — low value for short requests, high for uploads
