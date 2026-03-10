# Review Questions - Missed/Confusing Exam Questions

Questions from Udemy section quizzes that need review.

---

## Section 10 - VPC Fundamentals

### Q1 - Security Group inbound vs internet access
**Question:** You have attached an Internet Gateway to your VPC, but your EC2 instances still don't have access to the internet. What is NOT a possible issue?

**Answer:** Security Group doesn't allow traffic **in** — this is NOT an issue because Security Groups are **stateful**. If outbound traffic is allowed, return traffic is automatically allowed regardless of inbound rules. The EC2 instance is trying to ACCESS the internet (outbound), not receive connections (inbound).

**Tip for NOT questions:** Rephrase as "which of these would still work fine?"

### Q2 - NAT Gateway vs NAT Instance vs Egress-Only IGW
**Question:** You want internet access for EC2 instances in private subnets with IPv4, with least administration and seamless scaling. What should you use?

**Answer:** NAT Gateway — managed by AWS, scales automatically, no admin needed.

- NAT Instance = self-managed EC2 (more admin)
- Egress-Only Internet Gateway = IPv6 only (not applicable for IPv4)

**Key:** NAT Gateway = IPv4, managed, scalable. Egress-Only IGW = IPv6 only.

### Q3 - Security Group referencing another Security Group
**Question:** EC2 instances behind an ALB in the same VPC (CIDR 192.168.0.0/18). How to ensure only the ALB can access EC2 on port 80?

**Answer:** Add inbound rule with port 80 and the **ALB's Security Group** as source.

- 0.0.0.0/0 = allows everyone (too open)
- 192.168.0.0/18 = allows entire VPC (any resource, not just ALB)
- ALB's SG = only the ALB can reach port 80 (most precise)

**Key:** Security Groups can reference other Security Groups — this is more secure than using CIDR ranges.

## Section 11 - Amazon S3 Introduction

### Q4 - Glacier Deep Archive has NO Expedited retrieval
**Question:** Which is NOT a Glacier Deep Archive retrieval mode?

**Answer:** Expedited (1-5 minutes) — this only exists for Glacier **Flexible** Retrieval.

- Glacier Flexible: Expedited (1-5 min), Standard (3-5 hr), Bulk (5-12 hr)
- Glacier Deep Archive: Standard (12 hr), Bulk (48 hr) — **only 2 tiers, no Expedited**
