# Section 4 Summary - IAM & AWS CLI

## Lessons Covered
- [4.1 - IAM Introduction: Users, Groups, Policies](./4.1-IAM-Introduction-Users-Groups-Policies.md) — PERFECT 100%
- 4.2 - IAM Users & Groups Hands On — skipped
- [4.3 - AWS Console Simultaneous Sign-in](./4.3-AWS-Console-Simultaneous-Sign-in.md) — skipped (console feature)
- [4.4 - IAM Policies](./4.4-IAM-Policies.md) — REVIEW 67%
- 4.5 - IAM Policies Hands On — skipped
- [4.6 - IAM MFA Overview](./4.6-IAM-MFA-Overview.md) — PERFECT 100%
- 4.7 - IAM MFA Hands On — skipped
- [4.7 - AWS Access Keys, CLI and SDK](./4.7-AWS-Access-Keys-CLI-and-SDK.md) — PERFECT 100%
- 4.9–4.11 - CLI Setup (Windows/Mac/Linux) — skipped
- 4.12 - AWS CLI Hands On — skipped
- 4.13 - AWS CloudShell — skipped
- [4.14 - IAM Roles for AWS Services](./4.14-IAM-Roles-for-AWS-Services.md) — PERFECT 100%
- 4.15 - IAM Roles Hands On — skipped
- [4.16 - IAM Security Tools](./4.16-IAM-Security-Tools.md) — PERFECT 100%
- 4.17–4.20 — skipped (hands-on, best practices, summary)

---

## Core Concepts

### IAM Basics
- IAM = Identity and Access Management — **Global service**
- **Root account:** only for initial setup, never share, never use daily
- **Users** represent individual people; **Groups** organize users
- Groups can only contain users — NOT other groups
- A user can belong to **zero or multiple** groups

### IAM Policies
- JSON documents that define permissions
- Attached to users (inline) or groups (inherited)
- A user's effective permissions = all group policies + inline policies

**Policy structure:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::123456789012:root" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

| Field       | Description                              |
|-------------|------------------------------------------|
| `Effect`    | `Allow` or `Deny`                        |
| `Principal` | Who the policy applies to                |
| `Action`    | API calls allowed or denied              |
| `Resource`  | Resources the actions apply to           |
| `Condition` | Optional — when the statement applies    |

### Password Policy & MFA
- Set rules: min length, character types, expiration, reuse prevention
- **MFA** = password + physical/virtual device

| MFA Device                   | Type     | Key Detail                              |
|------------------------------|----------|-----------------------------------------|
| Virtual MFA (Authenticator)  | Software | Multiple tokens on one device           |
| U2F Security Key (YubiKey)   | Physical | One key supports multiple users         |
| Hardware Key Fob (Gemalto)   | Physical | Third-party hardware                    |
| GovCloud Key Fob (SurePassID)| Physical | Only for AWS GovCloud (US)              |

### Three Ways to Access AWS

| Method      | Protected By          | Used For              |
|-------------|-----------------------|-----------------------|
| Console     | Username + password + MFA | Web interface     |
| CLI         | Access keys           | Terminal commands     |
| SDK         | Access keys           | Application code      |

- **Access Key ID** ≈ username; **Secret Access Key** ≈ password
- NEVER share access keys — treat like passwords
- AWS CLI is built on **Boto** (Python SDK)

### IAM Roles
- Like users, but for **AWS services** (not people)
- A service assumes a role to get temporary credentials
- Common roles: EC2 Instance Role, Lambda Function Role, CloudFormation Role
- **Never put access keys on an EC2 instance** — use IAM Roles instead

### IAM Security Tools

| Tool                 | Scope        | Purpose                                      |
|----------------------|--------------|----------------------------------------------|
| Credentials Report   | Account-level| Lists all users + credential status          |
| Access Advisor       | User-level   | Shows last-accessed services per user        |

- Access Advisor helps enforce **least privilege** — remove unused permissions

---

## Exam Tips
- IAM is **global** — no region selection
- Groups cannot contain other groups
- A user can be in zero or multiple groups
- Inline policy = attached directly to a user; Group policy = inherited from group
- Roles are for services, not people; they provide temporary credentials
- Timeout on EC2 = security group issue; Connection refused = app issue
- Credentials Report = all users; Access Advisor = one user's service access
- Always apply **least privilege principle**
