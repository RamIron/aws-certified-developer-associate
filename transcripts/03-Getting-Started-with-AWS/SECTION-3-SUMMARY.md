# Section 3 Summary - Getting Started with AWS

## Lessons Covered
- [3.1 - AWS Cloud Overview - Regions & AZ](./3.1-AWS-Cloud-Overview-Regions-and-AZ.md) — PERFECT 100%
- 3.2 - Tour of the Console & Services in AWS — skipped (console UI overview)
- 3.3 - About the UI changes in the course — skipped (console UI overview)

---

## Core Concepts

### AWS Regions
- A **region** is a cluster of data centers (e.g., `us-east-1`, `eu-west-3`)
- Most services are **region-scoped** — using a service in one region is independent from another
- **How to choose a region:**
  1. **Compliance** — data governance/legal requirements
  2. **Latency** — deploy close to your users
  3. **Service availability** — not all regions have all services
  4. **Pricing** — varies by region

### Availability Zones (AZs)
- Each region has **3 to 6 AZs** (usually 3)
- Each AZ = one or more discrete data centers with redundant power and networking
- AZs are **isolated** from each other to prevent disaster cascading
- Connected with **high bandwidth, ultra-low latency** networking

### Points of Presence (Edge Locations)
- 400+ points of presence in 90+ cities across 40+ countries
- Used by **CloudFront** for low-latency content delivery

### Global vs Region-Scoped Services

| Scope  | Services                              |
|--------|---------------------------------------|
| Global | IAM, Route 53, CloudFront, WAF        |
| Region | EC2, Lambda, Elastic Beanstalk, etc.  |

---

## Exam Tips
- Region = cluster of data centers; AZ = one or more data centers inside a region
- AZs are isolated but connected with high-speed networking
- IAM and Route 53 are global — no region selection needed
- Choose a region based on: compliance, latency, availability, pricing (in that order)
