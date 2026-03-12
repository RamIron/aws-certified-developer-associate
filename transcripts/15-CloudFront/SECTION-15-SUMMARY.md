# Section 15 - CloudFront — Summary

## Lessons

| # | Lesson | Status |
|---|--------|--------|
| 15.1 | CloudFront - Overview | ✅ Completed |
| 15.2 | CloudFront Hands On | ✅ Skipped (hands-on) |
| 15.3 | CloudFront - Caching & Caching Policies | ✅ Completed |
| 15.4 | CloudFront - Cache Invalidations | ✅ Completed |
| 15.5 | CloudFront - Cache Behaviors | ✅ Completed |
| 15.6 | CloudFront - Caching & Caching Invalidations - Hands On | ✅ Skipped (hands-on) |
| 15.7 | CloudFront - ALB/EC2 as an Origin | ✅ Completed |
| 15.8 | CloudFront - Geo Restriction | ✅ Skipped (low exam relevance) |
| 15.9 | CloudFront Signed URL / Cookies | ✅ Completed |
| 15.10 | CloudFront Signed URL - Key Groups + Hands On | ✅ Skipped (hands-on, key info in 15.9) |
| 15.11 | CloudFront Advanced Concepts | ✅ Completed |
| 15.12 | CloudFront - Real Time Logs | ✅ Skipped (low exam relevance) |
| 15.13 | CloudFront Quiz | ✅ Completed |

---

## Key Concepts

### What is CloudFront?

- **CDN** (Content Delivery Network) — CDN in the exam = CloudFront
- Caches content at **~216 edge locations** worldwide
- Improves read performance → lower latency globally
- Provides **DDoS protection** (AWS Shield + WAF)

### CloudFront Origins

| Origin Type | Description | Access |
|-------------|-------------|--------|
| **S3 Bucket** | Files cached at edge, or upload via CloudFront | **OAC** + S3 bucket policy |
| **VPC Origin** | Private ALB, NLB, or EC2 in private subnets | Most secure, recommended |
| **Custom HTTP** | Any public HTTP endpoint (S3 website, public ALB) | Direct HTTP |

### CloudFront vs S3 Cross-Region Replication

| | CloudFront | S3 CRR |
|---|-----------|--------|
| **Scope** | ~216 edge locations globally | Per-region setup |
| **Data** | Cached (~1 day TTL) | Near real-time replication |
| **Best for** | Static content everywhere | Dynamic content in a few regions |

### Cache Key

- Default = **hostname + resource portion of URL**
  - Hostname: domain name (e.g., `mywebsite.com`)
  - Resource portion: path after domain (e.g., `/content/story.html`)
- Enhanced: add headers, cookies, query strings via **Cache Policy**
- More items in key = more granular but worse hit ratio

### Cache Policy vs Origin Request Policy

| | Cache Policy | Origin Request Policy |
|---|-------------|----------------------|
| **Purpose** | Defines Cache Key + TTL | Extra data for origin |
| **Affects caching?** | Yes | No |
| **Forwarded to origin?** | Yes | Yes |

### Cache Invalidation

- Force-remove cached files from all edge locations
- Paths: `/*` (all), `/images/*` (pattern), `/index.html` (specific)
- "Updated origin but users see old content" → invalidation

### Cache Behaviors

- Route different URL patterns to different origins with different cache policies
- Default behavior (`/*`) always processed **last**
- Use case: `/login` → EC2 (auth + signed cookies), `/*` → S3 (requires cookies)

### VPC Origins vs Public Origins

| | VPC Origins (recommended) | Public Origins (old) |
|---|--------------------------|---------------------|
| **Visibility** | Private subnets | Must be public |
| **Security** | Most secure | Must whitelist CloudFront IPs in security group |

### Geo Restriction

- Allow list or block list of countries
- Country determined by third-party Geo-IP database

### Signed URL vs Signed Cookie

| | Signed URL | Signed Cookie |
|---|-----------|---------------|
| **Scope** | One file per URL | Multiple files per cookie |

- Policy includes: expiration, IP range, trusted signers
- **Trusted Key Groups** (recommended): any IAM user, API-managed
- **CloudFront Key Pairs** (old): root account only, no APIs

### CloudFront Signed URL vs S3 Pre-signed URL

| | CloudFront Signed URL | S3 Pre-signed URL |
|---|----------------------|-------------------|
| **Works with** | Any origin | S3 only |
| **Access** | Via CloudFront (with caching) | Direct to S3 |
| **Use when** | S3 behind CloudFront with OAC | No CloudFront, direct S3 access |

### Price Classes

| Price Class | Regions |
|-------------|---------|
| **100** | North America + Europe (cheapest) |
| **200** | Most regions (excludes most expensive) |
| **All** | Entire world (best performance) |

### Origin Groups (Failover)

- Primary + secondary origin → automatic failover on error
- With S3 CRR = **regional disaster recovery**

### Field-Level Encryption

- Encrypt specific fields (up to 10) at edge with public key
- Only web server with private key can decrypt
- CloudFront and ALB cannot read encrypted fields

### Real-Time Logs

- CloudFront logs → **Kinesis Data Streams** (only destination)
- Configurable sampling rate and path filters

---

## Consolidated Exam Tips

- **CDN** = CloudFront
- **OAC** = secure S3 origin (only CloudFront can access bucket)
- **VPC origin** = most secure way to connect to private ALB/NLB/EC2
- Default Cache Key = **hostname + resource URL**
- **Cache Policy** = what's in Cache Key + TTL (also forwarded to origin)
- **Origin Request Policy** = forwarded to origin but NOT in Cache Key
- "Users see old content after update" → **Cache Invalidation**
- Cache behaviors route URL patterns to different origins; `/*` is always last
- "Require auth before S3 content" → cache behavior with signed cookies
- **Signed URL** = one file, **Signed Cookie** = multiple files
- S3 behind CloudFront with OAC → **CloudFront Signed URL** (not S3 pre-signed)
- No CloudFront, direct S3 → **S3 Pre-signed URL**
- **Trusted Key Groups** = recommended (IAM-managed, APIs), old way = root account only
- **Price Class 100** = cheapest (NA + Europe), **All** = global
- **Origin Groups** = failover (primary + secondary), with S3 CRR = regional DR
- **Field-Level Encryption** = encrypt fields at edge, only web server decrypts
- CloudFront real-time logs → Kinesis Data Streams
