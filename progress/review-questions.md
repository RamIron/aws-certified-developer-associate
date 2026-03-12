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

## Section 12 - AWS CLI, SDK, IAM Roles & Policies

### Q5 - EC2 instance needs S3 permissions
**Question:** EC2 instance wants to upload objects to S3 using PutObject but lacks permissions. What should you do?

**Answer:** Ask an administrator to attach an IAM Policy to the **IAM Role** on the EC2 instance.

- IAM Role = a set of permissions an AWS service can assume (like a uniform)
- You attach **IAM Policies** to the Role to define what it can do
- EC2 uses Roles through **Instance Profiles**
- NEVER use personal credentials or env vars on EC2 — always IAM Roles

**Key:** Inside AWS = IAM Roles. EC2 needs permissions → attach a policy to its Role.

### Q6 - API Authorization Exceptions vs colleague
**Question:** Colleague can run the app fine, you get API Authorization Exceptions. What should you do?

**Answer:** Compare both IAM Policies using **AWS Policy Simulator** to understand the differences.

- **Policy Simulator** = tool to test IAM policies and see what's allowed/denied without making real API calls
- If same app works for one person but not another → it's a **permissions difference**
- Policy Simulator helps you find exactly which action is being denied and why

**Key:** Authorization issues between users → compare policies with Policy Simulator.

### Q7 - IAM Role credentials on EC2
**Question:** When you have an IAM Role attached to EC2 and run CLI commands from inside, AWS CLI uses the \_\_\_\_\_ to get \_\_\_\_\_ credentials.

**Answer:** Instance **Metadata**, **temporary**.

- Metadata = info about the instance (IPs, role name, credentials)
- User data = the launch script (bootstrap)
- Credentials from IAM Roles are always **temporary** (they expire and auto-rotate)

**Key:** Metadata ≠ User data. Role credentials are always temporary.

## Section 15 - CloudFront

### Q8 - OAC vs Signed URL for paid content
**Question:** Paid content in S3, distributed globally via CloudFront, S3 configured to only exchange data with CloudFront. Which feature securely distributes the paid content?

**Answer:** CloudFront **Signed URL** (not OAC).

- **OAC** = secures S3↔CloudFront connection (already done in the question setup)
- **Signed URL** = controls which **users** can access the content
- OAC answers "who can reach S3?" → only CloudFront
- Signed URL answers "who can reach CloudFront content?" → only authorized users

**Key:** "paid/premium content distribution" → Signed URL. OAC is infrastructure security, not user-level access control.

### Q9 - CloudFront vs S3 CRR for dynamic content
**Question:** Highly dynamic content in S3 us-east-1, need low latency in ap-southeast-1. What to use?

**Answer:** **S3 Cross-Region Replication** (not CloudFront).

- CloudFront = static content, cached (may be stale), global
- S3 CRR = dynamic content, near real-time sync, specific regions

**Key:** "highly dynamic" = changes frequently = needs fresh data = CRR. "Static worldwide" = CloudFront.

### Q10 - Trusted Key Group vs CloudFront Key Pair
**Question:** Recommended signer for CloudFront Signed URLs/Cookies?

**Answer:** **Trusted Key Group** (not CloudFront Key Pair).

- Trusted Key Group = any IAM user can manage, API support, key rotation
- CloudFront Key Pair = root account only, console only, no APIs

**Key:** Trusted Key Group = recommended (modern, automatable). CloudFront Key Pair = old way (root only).
