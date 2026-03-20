# Section 18 - AWS CloudFormation: Complete Reference

## Lessons

| # | Lesson | Udemy # | Status |
|---|--------|---------|--------|
| 18.1 | CloudFormation Overview | 196 | ✅ |
| 18.2 | CloudFormation Create Stack Hands-On | 197 | ✅ |
| 18.3 | CloudFormation Update & Delete Stack Hands-On | 198 | ✅ |
| 18.4 | YAML Crash Course | 199 | ✅ |
| 18.5 | CloudFormation Resources | 200 | ✅ |
| 18.6 | CloudFormation Parameters | 201 | ✅ |
| 18.7 | CloudFormation Mappings | 202 | ✅ |
| 18.8 | CloudFormation Outputs & Exports | 203 | ✅ |
| 18.9 | CloudFormation Conditions | 204 | ✅ |
| 18.10 | CloudFormation Intrinsic Functions | 205 | ✅ |
| 18.11 | CloudFormation Rollbacks | 206 | ✅ |
| 18.12 | CloudFormation Service Role | 207 | ✅ |
| 18.13 | CloudFormation Capabilities | 208 | ✅ |
| 18.14 | CloudFormation Deletion Policy | 209 | ✅ |
| 18.15 | CloudFormation Stack Policies | 210 | ✅ |
| 18.16 | CloudFormation Termination Protection | 211 | ✅ |
| 18.17 | CloudFormation Custom Resources | 212 | ✅ |
| 18.18 | CloudFormation StackSets | 213 | ✅ |
| — | CloudFormation Quiz | — | ✅ |

---

## Key Concepts

### 1. What Is CloudFormation?
- **Infrastructure as Code (IaC)** — declare AWS infrastructure in a YAML/JSON template; CloudFormation creates it
- **Declarative** — you define WHAT, CloudFormation figures out HOW and ORDER
- Templates are stored in **Amazon S3**, referenced by CloudFormation to create a **Stack** — this is always true, even if you upload via the console (AWS uploads it to S3 behind the scenes automatically)
- Delete a stack → **all resources created by it are deleted**
- To update: must **re-upload a new version** (cannot edit the previous template)

### 2. Template Structure

| Section | Description | Required? |
|---------|-------------|-----------|
| `AWSTemplateFormatVersion` | Template format version | No |
| `Description` | Comments about the template | No |
| `Resources` | AWS resources to create | **YES — only mandatory section** |
| `Parameters` | Dynamic inputs for the template | No |
| `Mappings` | Fixed/static variables | No |
| `Outputs` | References to created values | No |
| `Conditions` | Control resource creation | No |

---

### 3. Resources
- The **only mandatory section** in every CloudFormation template
- Over **700 resource types** supported; unsupported services → use **Custom Resources**
- Type format: `AWS::ServiceName::ResourceType`
  - Examples: `AWS::EC2::Instance`, `AWS::Kinesis::Stream`, `AWS::ElasticLoadBalancingV2::LoadBalancer`
- Dynamic resource counts → **CloudFormation Macros and Transform** (not on DVA-C02)

---

### 4. Parameters

Key settings:

| Setting | Purpose |
|---------|---------|
| `Type` | String, Number, CommaDelimitedList, AWS-Specific, SSM, etc. |
| `AllowedValues` | Restricts to a fixed set (creates console dropdown) |
| `NoEcho: true` | Hides value from logs — use for passwords/secrets |
| `Default` | Value used if none is provided |
| `AllowedPattern` | Regex validation |

**`!Ref`** — reference a parameter (returns its value) or a resource (returns its physical ID).

**Pseudo Parameters** — built-in, no need to define:

| Reference | Returns |
|-----------|---------|
| `AWS::AccountId` | Your AWS account ID |
| `AWS::Region` | Region the stack is in |
| `AWS::StackId` | Stack ARN |
| `AWS::StackName` | Stack name |
| `AWS::NotificationARNs` | List of SNS topic ARNs for stack notifications |
| `AWS::NoValue` | Removes a property (used with conditions) |

---

### 5. Mappings
- **Fixed, hardcoded** variables known ahead of time (e.g. AMI IDs per region)
- Safer than Parameters when the set of valid values is finite and predictable

Structure: `MapName → TopLevelKey → SecondLevelKey → Value`

```yaml
Mappings:
  RegionMap:
    us-east-1:
      HVM64: ami-0ff8a91507f77f867
    eu-west-1:
      HVM64: ami-047bb4163c506cd98
```

**Access with `!FindInMap`:**
```yaml
ImageId: !FindInMap [RegionMap, !Ref "AWS::Region", HVM64]
```

| | Mappings | Parameters |
|--|----------|-----------|
| Values defined | In the template (hardcoded) | By the user at deploy time |
| When to use | Values are known in advance | Values depend on user input |

---

### 6. Outputs & Exports

```yaml
Outputs:
  SSHSecurityGroup:
    Description: The SSH Security Group for our company
    Value: !Ref MySSHSecurityGroup
    Export:
      Name: SSHSecurityGroup   # unique per region
```

- Export names must be **unique within a region**
- Import in another stack with `!ImportValue`:

```yaml
SecurityGroups:
  - !ImportValue SSHSecurityGroup
```

**Cross-stack deletion rule:** Cannot delete a stack whose exports are still referenced by other stacks.

---

### 7. Conditions

```yaml
Conditions:
  CreateProdResources: !Equals [!Ref EnvType, prod]
```

Apply a condition to a resource:
```yaml
MountPoint:
  Type: AWS::EC2::VolumeAttachment
  Condition: CreateProdResources
```

**Condition functions:**

| Function | Description |
|----------|-------------|
| `!Equals` | True if two values are equal |
| `!And` | True if all conditions are true |
| `!Or` | True if at least one condition is true |
| `!Not` | Inverts a condition |
| `!If` | Returns one value if true, another if false |

---

### 8. Intrinsic Functions

⭐ = exam-critical per Stephane

| Function | Purpose |
|----------|---------|
| `!Ref` ⭐ | Resource → physical ID; Parameter → value |
| `!GetAtt` ⭐ | Get a specific attribute of a resource (e.g. EC2 `AvailabilityZone`, `PublicIp`) |
| `!FindInMap` ⭐ | Retrieve a value from a Mapping |
| `!ImportValue` ⭐ | Import an exported value from another stack |
| `!Base64` ⭐ | Encode a string to Base64 — used for EC2 UserData |
| `!If` / `!Not` / `!Equals` / `!And` / `!Or` ⭐ | Condition functions |
| `!Join` | Concatenate values with a delimiter — syntax: `!Join [delimiter, [val1, val2, ...]]` e.g. `!Join ['=', [IPAddress, !Ref 'IPAddress']]` → `IPAddress=10.0.0.1` |
| `!Sub` | Substitute variables in a string |
| `!Select` | Select a value from a list by index |

**`!Ref` vs `!GetAtt`:**

| | `!Ref` | `!GetAtt` |
|--|--------|----------|
| Returns | Resource ID or parameter value | A specific attribute (IP, AZ, DNS, etc.) |
| Example | EC2 Instance ID | `EC2Instance.AvailabilityZone` |

---

### 9. Rollbacks

| Scenario | Behavior |
|----------|---------|
| **Creation failure (default)** | All resources deleted; logs available |
| **Creation failure (preserve)** | Successfully provisioned resources kept; stack must be deleted to clean up |
| **Update failure** | Auto rollback to last known working state |
| **Rollback failure** | Fix resources manually, then call `ContinueUpdateRollback` |

Root cause of rollback failure → resources were **manually modified** outside CloudFormation.

> ⚠️ **`ROLLBACK_COMPLETE` status (exam trap):** After a creation failure, the stack ends up in `ROLLBACK_COMPLETE`. In this state you **cannot** run `update-stack` or execute a ChangeSet — those require a healthy stack state. The only valid action is to **delete the stack and create a new one** with the fixed template.

---

### 10. Service Role

- An IAM Role that allows CloudFormation to create/update/delete resources **on your behalf**
- Enables **least privilege**: users can deploy stacks without direct permissions on the underlying resources
- User must have **`iam:PassRole`** to assign a service role to CloudFormation
- Without a service role → CloudFormation uses **your personal permissions**
- With a service role → CloudFormation uses **the role's permissions**

```
User: cloudformation:CreateStack + iam:PassRole ✅
Service Role: s3:* + ec2:* ✅
→ User deploys a stack that creates S3/EC2 without having s3:* or ec2:* directly
```

---

### 11. Capabilities

Must be explicitly acknowledged to proceed when a template contains sensitive operations:

| Capability | When Required |
|-----------|--------------|
| `CAPABILITY_IAM` | Template creates/updates **unnamed** IAM resources |
| `CAPABILITY_NAMED_IAM` | Template creates/updates **named** IAM resources |
| `CAPABILITY_AUTO_EXPAND` | Template uses **macros or nested stacks** |

Missing capability → `InsufficientCapabilitiesException`.

Capabilities are acknowledged in the console (checkbox), CLI (`--capabilities`), or API.

---

### 12. Deletion Policy

Applied per-resource:

| Policy | Behavior | Default? |
|--------|---------|---------|
| `Delete` | Resource deleted when stack is deleted | ✅ Yes |
| `Retain` | Resource preserved; must be manually deleted | ❌ |
| `Snapshot` | Final snapshot taken before resource deletion | ❌ |

- **S3 + Delete**: fails if bucket is **not empty** → empty manually or use a Custom Resource
- **Snapshot** supported resources: EBS Volumes, ElastiCache, RDS, Redshift, Neptune, DocumentDB

---

### 13. Stack Policies

- A **JSON document** that controls update actions on individual resources
- Default when no policy: all resources can be updated
- Default when a policy IS set: **all resources are protected (deny all)**
- Must explicitly **Allow** what can be updated; **Deny overrides Allow**

Typical pattern:
```json
{
  "Statement": [
    { "Effect": "Allow", "Action": "Update:*", "Principal": "*", "Resource": "*" },
    { "Effect": "Deny",  "Action": "Update:*", "Principal": "*", "Resource": "LogicalResourceId/ProductionDatabase" }
  ]
}
```

Stack policies only apply to **stack updates** (not creation or deletion).

---

### 14. Termination Protection

- Prevents **accidental deletion** of an entire stack
- **Disabled by default** — must be explicitly enabled
- To delete a protected stack → first disable protection, then delete

| | Stack Policy | Termination Protection |
|--|-------------|----------------------|
| Protects against | Accidental **updates** | Accidental **deletion** |
| Scope | Per-resource | Entire stack |
| Default | No policy | Disabled |

---

### 15. Custom Resources

Used when CloudFormation doesn't natively support a service, or you need custom provisioning logic.

Two valid type formats:
- `AWS::CloudFormation::CustomResource` — generic
- `Custom::MyCustomResourceTypeName` — **recommended**, more descriptive

```yaml
MyCustomResource:
  Type: Custom::MyCustomResourceTypeName
  Properties:
    ServiceToken: arn:aws:lambda:us-east-1:123456789012:function:MyLambdaFunction
    InputParam1: value1
```

- `ServiceToken` = Lambda ARN or SNS ARN — **must be in the same region**
- Lambda is invoked on **Create**, **Update**, and **Delete** lifecycle events

**Classic exam pattern — empty S3 bucket before deletion:**
```
Delete Stack → Custom Resource (Lambda) invoked → Lambda empties S3 bucket → CloudFormation deletes empty bucket ✅
```

---

### 16. StackSets

- Deploy the **same stack to multiple AWS accounts and multiple regions** in a single operation
- Managed from a single **administrator account**
- Update the StackSet once → **all stack instances updated automatically**
- Commonly used with **AWS Organizations** to enforce baseline infrastructure across all accounts

```
Administrator Account
  └── StackSet (template)
        ├── Account A → us-east-1, eu-west-1
        ├── Account B → us-east-1, ap-southeast-1
        └── Account C → us-east-1
```

---

## Consolidated Exam Tips

- **Only mandatory section:** `Resources`
- **Resource type format:** `AWS::ServiceName::ResourceType`
- **Unsupported services** → Custom Resources
- **NoEcho: true** → passwords and secrets (hides from logs)
- **!Ref** on resource → physical ID; on parameter → value
- **!GetAtt** → attributes beyond ID (IP, AZ, DNS); check "Return values" in docs
- **!Base64** → almost exclusively for EC2 UserData
- **!FindInMap** + `AWS::Region` → automatic region-specific config (e.g. AMI selection)
- **Export names** must be unique per region; **cannot delete** a stack with referenced exports
- **Conditions** can be applied to resources and outputs; functions: `Equals`, `And`, `Or`, `Not`, `If`
- **Creation failure default** → everything deleted; **preserve option** → keep for debugging
- **Update failure** → auto rollback to last working state
- **ContinueUpdateRollback** → when rollback itself fails (due to manual resource changes)
- **Service role + iam:PassRole** → least privilege deployments; user needs PassRole to assign the role
- **CAPABILITY_NAMED_IAM** → named IAM resources; **CAPABILITY_IAM** → unnamed; **CAPABILITY_AUTO_EXPAND** → macros/nested stacks
- **InsufficientCapabilitiesException** → missing capability acknowledgement
- **DeletionPolicy Delete** (default) → S3 must be empty or deletion fails
- **DeletionPolicy Snapshot** → stateful resources only (EBS, RDS, ElastiCache, Redshift, Neptune, DocumentDB)
- **Stack Policy** = JSON, protects against **updates**; Deny beats Allow; default deny once set
- **Termination Protection** = protects against **deletion**; disabled by default
- **Custom Resource ServiceToken** must be in the **same region** as the stack
- **Classic Custom Resource exam pattern**: empty S3 bucket before stack deletion via Lambda
- **StackSets** = same stack → multiple accounts/regions → managed from single admin account
