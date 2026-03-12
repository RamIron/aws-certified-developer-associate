# Section 14 - Amazon S3 Security — Summary

## Lessons

| # | Lesson | Status |
|---|--------|--------|
| 14.1 | S3 Encryption | ✅ Completed |
| 14.2 | S3 Encryption - DSSE-KMS (Article) | ✅ Skipped (article, optional) |
| 14.3 | S3 Encryption - Hands On | ✅ Skipped (hands-on) |
| 14.4 | S3 Default Encryption | ✅ Completed (merged into 14.1) |
| 14.5 | S3 CORS | ✅ Completed |
| 14.6 | S3 CORS - Hands On | ✅ Skipped (hands-on) |
| 14.7 | S3 MFA Delete | ✅ Completed |
| 14.8 | S3 MFA Delete - Hands On | ✅ Skipped (hands-on) |
| 14.9 | S3 Access Logs | ✅ Completed |
| 14.10 | S3 Access Logs - Hands On | ✅ Skipped (hands-on) |
| 14.11 | S3 Pre-signed URLs | ✅ Completed |
| 14.12 | S3 Pre-signed URLs - Hands On | ✅ Skipped (hands-on) |
| 14.13 | S3 Access Points | ✅ Completed |
| 14.14 | S3 Object Lambda | ✅ Completed |
| 14.15 | S3 Security - Quiz | ✅ Completed |

---

## Key Concepts

### S3 Encryption (4 Methods)

| Method | Key Managed By | Header | Notes |
|--------|---------------|--------|-------|
| **SSE-S3** | AWS (S3-owned key) | `"x-amz-server-side-encryption": "AES256"` | Default for new buckets/objects |
| **SSE-KMS** | You (via KMS service) | `"x-amz-server-side-encryption": "aws:kms"` | Audit key usage via CloudTrail |
| **SSE-C** | You (provide key in request) | Key in HTTP headers | HTTPS required, key never stored by AWS |
| **Client-Side** | You (encrypt before upload) | N/A | You encrypt/decrypt, S3 stores the blob |

- **SSE-S3**: AES-256, default, no config needed
- **SSE-KMS**: CloudTrail audit trail, KMS quota (5,000–30,000 req/sec per region) — can throttle high-throughput buckets
- **SSE-C**: Key sent with every request, HTTPS mandatory, CLI/SDK only
- **Client-Side**: You fully manage encryption/decryption before upload/after download

### Default Encryption vs Bucket Policies

- All new buckets have **SSE-S3 by default** (can change to SSE-KMS)
- Bucket policies can force a specific encryption type
- **Bucket policies are evaluated BEFORE default encryption settings**

### Encryption in Transit (SSL/TLS)

- Force HTTPS via bucket policy: `aws:SecureTransport` condition
- HTTPS required for SSE-C

### S3 CORS

```
Origin = scheme + host + port
```

- **Web browser** security mechanism (not server-side)
- Uses `Access-Control-Allow-Origin` header
- Cross-origin request to S3 → configure CORS on the **target** bucket
- Allow specific origin or `*` for all

### S3 MFA Delete

- Extra protection for **permanent deletion** of object versions
- Versioning must be enabled
- Only **root account** can enable/disable
- Only manageable via **CLI** (not AWS Console)
- MFA required for: permanent version delete + suspend versioning

### S3 Access Logs

- Logs **all requests** (authorized + denied, any account)
- Stored in **another S3 bucket** (same region)
- **NEVER** log to the same bucket → infinite loop → huge bill
- Analyze logs with **Amazon Athena**

### S3 Pre-signed URLs

- URL with **temporary credentials baked in**
- User inherits the **generator's permissions**
- Works for GET (download) and PUT (upload)

| Method | Max Expiration |
|--------|---------------|
| S3 Console | 12 hours |
| CLI | 168 hours (7 days) |

### S3 Access Points

- Simplify security for buckets with many users/data types
- Each access point has its own **DNS name** and **policy**
- VPC origin = private access, requires **VPC Endpoint**
- "Bucket policy too complex" → use Access Points

### S3 Object Lambda

- Modify objects **on retrieval** without duplicating buckets
- Built on **S3 Access Points** + **Lambda functions**

```
Caller → S3 Object Lambda Access Point → Lambda (transform) → S3 Access Point → S3 Bucket
```

- Use cases: redact PII, format conversion (XML → JSON), image watermarking, data enrichment (queries external DB)

---

## Consolidated Exam Tips

- **SSE-S3** = default, AES-256, header `AES256`
- **SSE-KMS** = audit via CloudTrail, header `aws:kms`, watch for KMS throttling (5k–30k req/sec)
- **SSE-C** = you provide key every request, HTTPS mandatory, key never stored
- **Client-Side** = you encrypt before upload, S3 stores encrypted blob
- **Default encryption** = SSE-S3, but bucket policies evaluated **before** default encryption
- **Force HTTPS** = bucket policy with `aws:SecureTransport` condition
- **CORS** = web browser security, configure on the **target** bucket, header `Access-Control-Allow-Origin`
- **MFA Delete** = root account only, CLI only, versioning required, protects permanent deletion
- **Access Logs** = same region, different bucket (never same bucket!), analyze with Athena
- **Pre-signed URLs** = temporary private access, Console max 12h, CLI max 168h (7 days)
- **Access Points** = simplify complex bucket policies, each has DNS + policy, VPC origin needs VPC Endpoint
- **S3 Object Lambda** = transform objects on retrieval, one bucket + multiple Lambda views
- "Different apps need different versions of same S3 data" → S3 Object Lambda
- "S3 bucket policy too complex" → S3 Access Points
- "Cross-origin request blocked on S3" → CORS not configured on target bucket
- "Temporary access to private S3 file" → Pre-signed URL
