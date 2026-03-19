# Section 17 - AWS Elastic Beanstalk: Summary

## Lessons

| Lesson | Status |
|--------|--------|
| 17.1 - Section Introduction | Skipped (intro) |
| 17.2 - Elastic Beanstalk Overview | ✓ PERFECT |
| 17.3 - Beanstalk First Environment | Skipped (hands-on) |
| 17.4 - Beanstalk Second Environment | Skipped (hands-on) |
| 17.5 - Beanstalk Deployment Modes | ✓ PERFECT |
| 17.6 - Deployment Modes Hands On | Skipped (hands-on) |
| 17.7 - Beanstalk CLI and Deployment Process | Skipped (low exam relevance) |
| 17.8 - Beanstalk Lifecycle Policy | ✓ PERFECT |
| 17.9 - Beanstalk Extensions | ✓ PERFECT |
| 17.10 - Beanstalk & CloudFormation | ✓ PERFECT |
| 17.11 - Beanstalk Cloning | ✓ PERFECT |
| 17.12 - Beanstalk Migrations | ✓ PERFECT |
| 17.13 - Beanstalk Cleanup | Skipped (hands-on cleanup) |
| 17.14 - Elastic Beanstalk Quiz | Skipped |

---

## Key Concepts

### What is Elastic Beanstalk?
- **Managed service** — developer only worries about code
- Reuses EC2, ASG, ELB, RDS, ElastiCache under the hood
- **Free** — you pay for underlying resources
- Built on top of **CloudFormation** (each environment = one CloudFormation stack)

### Components
| Component | Description |
|-----------|-------------|
| **Application** | Collection of Beanstalk components |
| **Application Version** | An iteration of your code (v1, v2...) |
| **Environment** | AWS resources running ONE application version |
| **Tier** | Web Server or Worker |

### Tiers
- **Web Server Tier**: Users → ELB → ASG → EC2 (HTTP traffic)
- **Worker Tier**: SQS Queue → ASG → EC2 (background jobs, scales on queue depth)

### Environment Modes
| Mode | Architecture | Use case |
|------|-------------|----------|
| **Single Instance** | 1 EC2 + Elastic IP | Development |
| **High Availability** | ELB + ASG + multi-AZ | Production |

> ⚠️ RDS created **inside** Beanstalk = tied to environment lifecycle. Create RDS **outside** for production.

---

### Deployment Modes

| Mode | Downtime? | Capacity | Cost | Rollback | Speed |
|------|-----------|----------|------|----------|-------|
| **All at once** | YES | Zero | No extra | Redeploy | Fastest |
| **Rolling** | No | Below capacity | No extra | Manual | Slow |
| **Rolling + extra batch** | No | At capacity | Small extra | Manual | Slow |
| **Immutable** | No | Double (temp ASG) | High | Quick (terminate temp ASG) | Longest |
| **Blue/Green** | No | Double (2 envs) | High | Quick (swap URL) | Manual |
| **Traffic Splitting** | No | Double (temp ASG) | High | Automatic | Automated |

**Key exam triggers:**
- "Only mode with downtime" → **All at once**
- "No downtime + no extra cost" → **Rolling**
- "Always at capacity + minimal cost" → **Rolling with additional batches**
- "Fastest rollback" → **Immutable** or **Traffic Splitting**
- "Canary testing" → **Traffic Splitting**
- "Manual, Route 53" → **Blue/Green**
- "Only mode with DNS change" → **Blue/Green**

---

### Lifecycle Policy
- Max **1000 application versions** — lifecycle policy prevents hitting the limit
- Phase out by **count** (keep last N) or **time** (delete older than N days)
- Active versions (deployed to environment) are **never deleted**
- Option to retain or delete the **S3 source bundle**
- Executed by Beanstalk **service role** (needs IAM permissions)

---

### EB Extensions
- Configure anything from the UI as **code** inside your zip file
- Requirements:
  - Directory: `.ebextensions/` at root of source code
  - Format: YAML or JSON
  - File extension: must end in `.config`
- Use `option_settings` to set environment variables
- Can provision RDS, ElastiCache, DynamoDB via CloudFormation resources
- Resources created by EB extensions are **deleted when environment is deleted**

---

### Beanstalk & CloudFormation
- Every Beanstalk environment = one **CloudFormation stack**
- CloudFormation provisions: ASG, ELB, EC2, Security Groups, etc.
- EB Extensions + CloudFormation = provision **any AWS resource**

---

### Cloning
- Clone environment = identical copy (same LB config, same RDS config, same env vars)
- **RDS data is NOT copied** — only configuration
- Use case: create test/staging from production

---

### Migrations

**Load Balancer migration (can't change LB type after creation):**
1. Create new environment manually (same config, different LB type)
2. Cannot use Clone (copies LB type too)
3. Deploy app to new environment
4. CNAME swap or Route 53 update to shift traffic
5. Terminate old environment

**Decouple RDS from Beanstalk:**
1. Snapshot RDS (safety net)
2. Enable RDS deletion protection
3. Create new Beanstalk env without RDS
4. Point new env to existing RDS via env variable
5. CNAME swap to shift traffic
6. Terminate old environment
7. CloudFormation stack → **DELETE_FAILED** (expected — deletion protection worked)
8. Manually delete the CloudFormation stack

---

## Tricky Quiz Questions

### Q: Full capacity + quick rollback deployment option
**Trap:** "Rolling with Additional Batches" also maintains full capacity, so it's easy to pick it. The differentiator is **rollback speed** — Rolling with Additional Batches requires another full rolling update to revert. Immutable just terminates the new ASG instantly.
**Answer: Immutable**

### Q: Create a test environment similar to production
**Trap:** Remembering "RDS data is not copied" and treating it as a limitation — but the question only asks for a similar environment structure, not a copy of production data. RDS data not being copied is fine for testing.
**Wrong instinct:** "Manually create another environment" — Cloning does this automatically. "Download CloudFormation template" — that's a workaround, not a Beanstalk feature.
**Answer: Elastic Beanstalk Cloning**

### Q: Slow deploys due to dependency resolution on each instance
**Not explicitly covered in the course.** Each EC2 instance downloads the zip and resolves dependencies from the internet on every deploy — that's what's slow.
**Fix:** Bundle dependencies **inside the zip file** before uploading. Beanstalk unpacks everything locally with no package manager calls.
**Trap:** Putting dependencies in S3 doesn't help — S3 is already where Beanstalk stores the zip. The problem is the install step on each instance.
**Answer: Package dependencies in the zip file**

---

## Consolidated Exam Tips

- Beanstalk = **managed service**, developer only worries about **code**
- Beanstalk is **free** — pay for underlying resources (EC2, RDS, etc.)
- **Web Server Tier** = ELB + ASG | **Worker Tier** = SQS + ASG
- **Single Instance** = dev | **High Availability** = prod
- Beanstalk uses **CloudFormation** under the hood
- **All at once** = only mode with **downtime**
- **Canary testing** = **Traffic Splitting** (ALB, automated)
- **Blue/Green** = only mode with **DNS change** (Route 53, manual)
- **EB extensions**: `.ebextensions/` + `.config` + YAML/JSON
- **Lifecycle policy**: 1000 version limit, phase out by count or time, active versions never deleted
- **Cannot change LB type** after creation → must migrate manually (can't use Clone)
- **Decoupling RDS**: snapshot → deletion protection → new env → CNAME swap → DELETE_FAILED → manual cleanup
- Resources in EB extensions = **deleted with environment**
