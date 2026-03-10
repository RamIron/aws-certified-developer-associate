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
