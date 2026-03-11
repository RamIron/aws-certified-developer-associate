# Section 12 Summary - AWS CLI, SDK, IAM Roles & Policies

## Lessons

| # | Lesson | Status |
|---|--------|--------|
| 12.1 | AWS EC2 Instance Metadata | PERFECT |
| 12.2 | AWS EC2 Instance Metadata - Hands On | Skipped |
| 12.3 | AWS CLI Profiles | Skipped |
| 12.4 | AWS CLI with MFA | PERFECT |
| 12.5 | AWS SDK Overview | Skipped |
| 12.6 | Exponential Backoff & Service Limit Increase | PERFECT |
| 12.7 | AWS Credentials Provider & Chain | REVIEW |
| 12.8 | AWS Signature v4 Signing (Sigv4) | PERFECT |
| 12.9 | AWS IAM, CLI, & SDK Quiz | Skipped (Udemy quiz) |

---

## EC2 Instance Metadata (IMDS)

- IMDS allows EC2 instances to **learn about themselves** without an IAM Role
- URL: **169.254.169.254**
- Can retrieve: instance name, public/private IP, IAM Role **name**, temporary credentials
- **Cannot** retrieve: IAM **policy** attached to the role
- **Metadata** = info about the instance | **User Data** = launch script

### IMDSv1 vs IMDSv2

| Version | How It Works | Security |
|---------|-------------|----------|
| **IMDSv1** | Direct GET to the URL | Less secure |
| **IMDSv2** | PUT to get token, then GET with token header | More secure (default since 2023) |

---

## AWS CLI with MFA

- To use MFA with CLI → call **STS GetSessionToken**
- Pass: `--serial-number` (MFA device ARN) + `--token-code` (code from app)
- Returns: temporary AccessKeyId + SecretAccessKey + SessionToken + Expiration

---

## AWS SDK

- SDK = performing AWS actions from application code (not CLI)
- Available in Java, .NET, Node.js, PHP, Python, Go, Ruby, C++
- AWS CLI is built on the **Python SDK (Boto3)**

---

## Exponential Backoff & Service Limits

### Two Types of AWS Limits

| Type | What it limits | Solution |
|------|---------------|---------|
| **API Rate Limits** | API calls per second | Exponential Backoff (intermittent) or request limit increase (consistent) |
| **Service Quotas** | Resources you can run | Request increase via ticket or Service Quotas API |

### Exponential Backoff

- Each retry **doubles** the wait time: 1s → 2s → 4s → 8s → 16s
- **AWS SDK** includes it automatically
- **Custom HTTP calls** → you must implement it yourself
- Retry on **5XX** (server errors) and ThrottlingException — **NOT on 4XX** (client errors)

---

## Credentials Provider Chain

### Priority Order (CLI) — first match wins

| Priority | Source |
|----------|--------|
| 1 (highest) | Command line options |
| 2 | Environment variables |
| 3 | CLI credentials file (`~/.aws/credentials`) |
| 4 | CLI configuration file (`~/.aws/config`) |
| 5 | Container credentials (ECS) |
| 6 (lowest) | EC2 Instance Profile |

### Classic Exam Scenario

- EC2 has env vars (broad IAM user) + Instance Profile (restricted role)
- App has too many permissions → **env vars win** over Instance Profile
- Fix: **unset environment variables**

### Best Practices

- **NEVER** store credentials in code
- **Inside AWS** → IAM Roles (EC2 Role, ECS Role, Lambda Role)
- **Outside AWS** → environment variables or named profiles

---

## AWS Signature v4 (SigV4)

- All AWS API requests must be **signed** using SigV4
- CLI and SDK sign automatically
- Two ways to transmit the signature:
  1. **Authorization HTTP header** (what CLI/SDK does)
  2. **Query string** with `X-Amz-Signature` parameter (what S3 pre-signed URLs use)

---

## Consolidated Exam Tips

1. IMDS URL: **169.254.169.254** — can get role name, NOT policy
2. IMDSv2 = token-based (PUT then GET), default since 2023
3. MFA with CLI → **STS GetSessionToken**
4. ThrottlingException → **Exponential Backoff**
5. Retry only on **5XX**, never on **4XX**
6. SDK has Exponential Backoff built-in; custom HTTP calls don't
7. Credentials chain: **env vars beat Instance Profile**
8. "EC2 has too many permissions" → leftover environment variables
9. Inside AWS = **IAM Roles** | Outside AWS = env vars or profiles
10. SigV4: **Authorization header** or **X-Amz-Signature query string**
