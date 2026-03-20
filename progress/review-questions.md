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

## Section 16 - ECS, ECR & Fargate

### Q11 - ECS_ENABLE_TASK_IAM_ROLE config
**Question:** You have a Classic ECS cluster and want to enable IAM roles for ECS tasks so they can make API requests to AWS services. Which config option should you enable in `/etc/ecs/ecs.config`?

**Answer:** `ECS_ENABLE_TASK_IAM_ROLE` (set to `true`).

- This setting is in `/etc/ecs/ecs.config` on the EC2 instance
- The ECS Agent reads this config file on startup
- Without it, ECS tasks cannot assume their own IAM Task Roles
- Only relevant for **EC2 launch type** (Fargate handles this automatically)

**Key:** EC2 launch type needs `ECS_ENABLE_TASK_IAM_ROLE=true` in `/etc/ecs/ecs.config` for Task Roles to work. Not covered in the course transcript.

### Q12 - CodeBuild authorization failure pushing to ECR
**Question:** CodePipeline build stage uses CodeBuild to build Docker images and push to ECR. The build stage fails with an authorization issue. What is the issue?

**Answer:** The **CodeBuild Service Role** lacks permissions to push to ECR.

- CodeBuild uses its own IAM Service Role
- That role needs ECR permissions (`ecr:GetAuthorizationToken`, `ecr:PutImage`, etc.)
- Same pattern: whoever pushes/pulls from ECR needs **IAM permissions**

**Key:** ECR authorization error = check IAM permissions of whoever is calling ECR (CodeBuild role, ECS task role, IAM user, etc.).

### Q13 - Second container fails to start on same EC2 instance
**Question:** Two copies of the same Docker container on the same EC2 instance. First starts fine, second fails. CPU and RAM are sufficient. What's the problem?

**Answer:** The **host port is hardcoded** in the task definition (e.g., host port 80). The first container takes port 80, the second can't bind to the same port → conflict.

- Fix: set host port to **0** (Dynamic Host Port Mapping) → Docker assigns random ports
- Use an **ALB** to discover the dynamic ports automatically

**Key:** "Second container fails on same instance, enough CPU/RAM" = host port conflict. Use host port 0 for dynamic mapping.

### Q14 - EC2 instance can't register with ECS cluster (NOT question)
**Question:** A newly launched EC2 instance can't register with your ECS cluster. What is NOT a reason?

**Answer:** "The security group does not allow inbound traffic" is **NOT** a reason.

- ECS registration is an **outbound** call (agent → ECS service), so inbound rules don't matter
- Valid reasons: ECS Agent not running, wrong AMI (not ECS-optimized), missing IAM permissions

**Key:** ECS registration = outbound API call. Inbound security group rules are irrelevant for registration.

### Q15 - Pull Docker images from private ECR
**Question:** Which AWS CLI command to pull Docker images from a private ECR repository?

**Answer:**
```bash
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URL
docker pull $ECR_IMAGE_URL
```

- First authenticate Docker CLI with ECR using `get-login-password`
- Then `docker pull` to download the image

**Key:** `aws ecr get-login-password` → `docker login` → `docker pull`. Always authenticate first.

## Section 18 - AWS CloudFormation

### Q16 - What to do after ROLLBACK_COMPLETE
**Question:** An Administrator created a CloudFormation stack for the first time. The stack failed with status `ROLLBACK_COMPLETE`. After fixing the template, how should they continue?

**Answer:** **Delete the failed stack and create a new stack.**

- `ROLLBACK_COMPLETE` = creation failed, CloudFormation rolled everything back. The stack is a dead shell.
- You **cannot** execute a ChangeSet or run `update-stack` on a `ROLLBACK_COMPLETE` stack — those require the stack to be in a valid state (e.g. `CREATE_COMPLETE`, `UPDATE_COMPLETE`).
- `validate-template` only checks syntax — it doesn't deploy anything.
- The only valid action: **delete the stack**, then **create a new one** with the fixed template.

**Key:** `ROLLBACK_COMPLETE` = dead stack. Delete it and start fresh. ChangeSets and updates are not available in this state.

### Q17 - Fn::Join output with a delimiter
**Question:** With parameter `IPAddress` = `10.0.0.1`, what is the output of:
```yaml
Fn::Join:
  - '='
  - [IPAddress, !Ref 'IPAddress']
```

**Answer:** `IPAddress=10.0.0.1`

- `Fn::Join` takes two arguments: **delimiter** first, then the **list of values**
- The `- '='` is the delimiter (YAML list item syntax — the dash just means it's a list element)
- The list resolves to `["IPAddress", "10.0.0.1"]`
- Result: values joined with `=` → `IPAddress=10.0.0.1`
- If delimiter were `''` (empty string): `IPAddress10.0.0.1`
- If delimiter were `','`: `IPAddress,10.0.0.1`

**Key:** `Fn::Join: [delimiter, [val1, val2, ...]]`. Delimiter goes first, list goes second.
