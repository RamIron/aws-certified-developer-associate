# Section 23 — AWS Serverless: API Gateway — Complete Summary

## Lessons

| # | Lesson | Status |
|---|--------|--------|
| 23.1 | API Gateway - Section Introduction | ✅ intro |
| 23.2 | API Gateway Overview | ✅ PASSED 75% |
| 23.3 | API Gateway Basics - Hands On | ✅ skipped |
| 23.4 | API Gateway Stages and Deployment | ✅ REVIEW 67% |
| 23.5 | API Gateway Stages and Deployment - Hands On | ✅ skipped |
| 23.6 | API Gateway Stages Configurations - Hands On | ✅ skipped |
| 23.7 | API Gateway Canary Deployments | ✅ PERFECT |
| 23.8 | API Gateway Canary Deployments - Hands On | ✅ skipped |
| 23.9 | API Gateway Integration Types & Mappings | ✅ PERFECT |
| 23.10 | API Gateway Mapping Templates - Hands On | ✅ skipped |
| 23.11 | API Gateway Open API | ✅ no quiz |
| 23.12 | API Gateway Open API - Hands On | ✅ skipped |
| 23.13 | API Gateway Caching | ✅ PERFECT |
| 23.14 | API Gateway Usage Plans & API Keys | ✅ PERFECT |
| 23.15 | API Gateway Monitoring, Logging and Tracing | ✅ PERFECT |
| 23.16 | API Gateway CORS | ✅ no quiz |
| 23.17 | API Gateway Authentication and Authorization | ✅ PERFECT |
| 23.18 | API Gateway Authentication - Hands On | ✅ skipped |
| 23.19 | API Gateway REST API vs HTTP API | ✅ no quiz |
| 23.20 | API Gateway WebSocket API | ✅ PERFECT |
| 23.21 | API Gateway - Architecture | ✅ no quiz |
| Udemy Quiz | Section 23 Quiz | ✅ |

---

## 1. Why API Gateway?

Three ways to expose a Lambda function — and why API Gateway wins:

| Option | Requires | Features |
|--------|----------|----------|
| Direct Lambda invocation | IAM permissions on client | None |
| Application Load Balancer | Infrastructure | Basic HTTP only |
| **API Gateway** | Nothing (serverless) | Full platform ✅ |

**Features:** WebSocket, API versioning, stages (dev/test/prod), auth, API keys, throttling, Swagger/OpenAPI, request/response transformation, caching, SDK generation.

**Integrations:**
1. **Lambda Function** — most common, full serverless stack
2. **HTTP Endpoint** — any backend + API GW features on top
3. **AWS Service directly** — e.g. Client → API GW → Kinesis → Firehose → S3 (no AWS credentials needed by client)

**Endpoint Types:**

| Type | Use Case | Notes |
|------|----------|-------|
| Edge-Optimized (default) | Global clients | Routes via CloudFront Edge; GW still in **one region** |
| Regional | Same-region users | No CloudFront; can add your own |
| Private | VPC-only | Interface VPC Endpoint; resource policy controls access |

**ACM Certificate Rule:** Edge-Optimized → cert must be in **us-east-1**. Regional → cert in same region as stage.

---

## 2. Stages & Deployment

- Changes are **not live until deployed** to a stage
- Each stage gets its own URL: `https://{id}.execute-api.{region}.amazonaws.com/{stage}`
- Full deployment history kept → **rollback anytime**
- Multiple stages can coexist (v1 + v2 simultaneously)

### Stage Variables
- Like env vars, but for API GW stages
- General syntax: `$stageVariables.varName`
- Inside a Lambda ARN string: `${stageVariables.varName}` (curly braces required)
- Passed to Lambda via the **context object**

### Stage Variables + Lambda Aliases Pattern
```
dev stage   → stageVar → dev alias   → $LATEST
test stage  → stageVar → test alias  → v2
prod stage  → stageVar → prod alias  → 95% v1 / 5% v2
```
API GW never changes. All traffic shifting happens at the **Lambda alias level**.

### Canary Deployments
- Test a % of prod traffic on a new version
- Metrics and logs are **separate** for canary vs main stage
- Can override stage variables for the canary channel
- Promote canary → 100% replaces main stage instantly
- = **Blue/Green deployment** with API GW + Lambda

---

## 3. Integration Types & Mapping Templates

### The 5 Integration Types

| Type | Proxy? | Mapping Templates? | Use Case |
|------|--------|-------------------|----------|
| **MOCK** | No | No | Fixed response, no backend. Dev/testing only. |
| **HTTP** | No | ✅ Yes | HTTP backend + modify request/response |
| **AWS** | No | ✅ Yes | AWS service + modify request/response |
| **AWS_PROXY** | ✅ Yes | No | Lambda Proxy — full request as-is to Lambda |
| **HTTP_PROXY** | ✅ Yes | No | HTTP backend as-is; can inject hidden HTTP headers |

### Proxy vs Non-Proxy
- **Proxy:** API GW passes everything as-is. No mapping. Lambda owns the request/response structure.
- **Non-Proxy:** Must configure integration request + response. Mapping templates available.

### Lambda Proxy Event Structure
Lambda receives full event: `resource`, `path`, `httpMethod`, `headers`, `queryStringParameters`, `body`, `stageVariables`...
Lambda must return: `{ statusCode, headers, body }`

### Mapping Templates
- Only for HTTP / AWS (non-proxy) integrations
- Written in **VTL (Velocity Template Language)** — supports for loops, if statements
- Content-Type must be `application/json` or `application/xml`
- Can: rename/modify query params, modify body, add/modify headers, filter response fields

**Classic exam scenarios:**
1. **REST → SOAP:** Client (JSON) → API GW → [VTL: JSON→XML] → SOAP backend → [VTL: XML→JSON] → Client
2. **Rename query params:** `?name=foo&other=bar` → Lambda receives `{ "myVariable": "foo", "otherVariable": "bar" }`

### API Gateway Timeout
- Max: **29 seconds** (regardless of Lambda timeout)
- Lambda can run 15 min, but API GW cuts it at 29s → **504**

---

## 4. OpenAPI Integration

- OpenAPI (v3.0) = industry standard (formerly Swagger), not AWS-specific
- Spec format: **YAML or JSON**
- AWS extensions prefixed with `x-amazon-apigateway-`

| Direction | What it does |
|-----------|-------------|
| **Import** OpenAPI → API GW | Creates methods, integrations, responses automatically |
| **Export** API GW → OpenAPI | Generates spec per stage (for SDK generation, sharing) |

**Request Validation** using `x-amazon-apigateway-request-validator`:
- Validates **before** hitting the backend → rejects with **400** if invalid
- Can validate: URI params, query strings, headers (present/non-blank), request body (JSON Schema)
- Apply `params-only` globally; override with `all` on specific methods

---

## 5. Caching

```
Client → API GW → cache hit? → YES → cached response
                             → NO  → backend → cache → response
```

| Setting | Value |
|---------|-------|
| Default TTL | **300s** (5 min) |
| Min TTL | 0 (no cache) |
| Max TTL | **3600s** (1 hour) |
| Cache size | **0.5 GB → 237 GB** |
| Level | **Stage** (override per method) |

**Cache is expensive → production only.**

### Invalidation
| Method | Who | How |
|--------|-----|-----|
| Flush entire cache | Admin | Via UI |
| Per-request bypass | Client | `Cache-Control: max-age=0` header |

Client invalidation requires **IAM authorization**. Without it, anyone can flush the cache. If unauthorized: ignore header / 403 / warning.

---

## 6. Usage Plans & API Keys

- **API Key:** alphanumeric token sent in `x-api-key` header
- **Usage Plan:** links API stages + API keys, sets throttle (req/sec) + quota (req/period)

**Setup order (exam!):**
1. Create API + configure methods to require API key → deploy to stages
2. Generate or import API keys
3. Create usage plan with throttle + quota limits
4. **Associate API stages + API keys with the usage plan** ← easy to forget!

---

## 7. Monitoring, Logging & Tracing

### CloudWatch Logs
- Enabled at **stage level**, can override per method
- Log levels: ERROR / INFO / DEBUG (debug = most verbose)
- ⚠️ May log sensitive data

### X-Ray
- API GW + Lambda both enabled → full distributed tracing

### CloudWatch Metrics

| Metric | Measures |
|--------|----------|
| CacheHitCount | Requests served from cache |
| CacheMissCount | Requests that hit the backend |
| Count | Total requests in a period |
| **IntegrationLatency** | Time waiting for backend only |
| **Latency** | Full round trip (IntegrationLatency + GW processing) |
| 4XXError | Client errors |
| 5XXError | Server errors |

> Latency > IntegrationLatency always. Max = **29s** → timeout → **504**

### Throttling
- Default account limit: **10,000 req/s** across all APIs (soft limit)
- One overloaded API can throttle others → set stage/method limits
- Throttled: **429 Too Many Requests** → retry with **exponential backoff**

### Error Codes

| Code | Side | Meaning |
|------|------|---------|
| 400 | Client | Bad Request |
| 403 | Client | Access Denied / WAF blocked |
| 429 | Client | Too Many Requests (throttling) |
| 502 | Server | Lambda proxy returned invalid response |
| 503 | Server | Backend unavailable |
| 504 | Server | Integration timeout (29s exceeded) |

---

## 8. CORS

Browser security: blocks cross-origin requests unless server explicitly allows it.

**When needed:** frontend on domain A calls API GW on domain B.

**How it works:**
1. Browser sends **OPTIONS pre-flight request**
2. API GW responds with CORS headers if origin is allowed:
   - `Access-Control-Allow-Methods`
   - `Access-Control-Allow-Headers`
   - `Access-Control-Allow-Origin`
3. Browser proceeds with actual request

Enable via API GW console on any resource.

---

## 9. Authentication & Authorization

### Method 1 — IAM Authorization

- **Auth:** IAM | **Authz:** IAM Policy
- Best for: **internal AWS resources** (EC2, Lambda, IAM users)
- Technology: **Signature v4** — credentials signed and placed in headers
- **Resource Policies** extend this for:
  - Cross-account access (IAM + resource policy required)
  - IP filtering (whitelist/blacklist)
  - VPC Endpoint allow

### Method 2 — Cognito User Pools

- **Auth:** Cognito | **Authz:** API GW method level
- Best for: **external users** (mobile/web apps)
- No custom auth code required
- API GW validates token directly with Cognito
- Authorization logic still lives in **backend Lambda**

### Method 3 — Lambda Authorizer (Custom Authorizer)

- **Auth:** External / 3rd party (Auth0, OAuth, JWT)
- **Authz:** Your Lambda function → returns IAM Policy
- Best for: **third-party auth systems**
- Token passed as Bearer token in header or request params
- IAM Policy is **cached** → still pay per Lambda invocation

### Comparison

| | IAM | Cognito | Lambda Authorizer |
|---|---|---|---|
| Auth | IAM | Cognito | 3rd party |
| Authz | IAM Policy | Method level | Lambda function |
| Best for | Internal AWS | External users | 3rd party auth |
| Cross-account? | Yes (+ resource policy) | No | No |
| Custom code? | No | No | Yes |
| Technology | Sig v4 | Cognito token | JWT/OAuth/Bearer |
| Result cached? | N/A | N/A | ✅ Yes |

---

## 10. REST API vs HTTP API

| Feature | REST API | HTTP API |
|---------|----------|----------|
| Cost | Higher | **Much cheaper** ✅ |
| Mapping templates | ✅ | ❌ |
| Usage plans / API keys | ✅ | ❌ |
| Resource policies | ✅ | ❌ |
| Built-in CORS | ❌ | ✅ |
| Auth | IAM, Cognito, Lambda Authorizer | OIDC / OAuth 2.0 only |
| Native OpenID / OAuth 2.0 | ❌ | ✅ |

**Rule:** If question mentions resource policies, usage plans, API keys, mapping templates → **REST API**. Cheapest/simplest → **HTTP API**.

---

## 11. WebSocket API

- **Two-way, persistent** communication (server can push to client unprompted)
- Use cases: chat apps, multiplayer games, live trading, collaboration tools
- URL: `wss://{id}.execute-api.{region}.amazonaws.com/{stage}`

### Connection Lifecycle
```
Client connects    → $connect Lambda    → store connectionId in DynamoDB
Client sends data  → sendMessage Lambda → same connectionId throughout
Client disconnects → $disconnect Lambda → clean up
```
**connectionId** = stable for the entire connection duration.

### Server → Client (Connection Callback URL)
```
https://{id}.execute-api.{region}.amazonaws.com/{stage}/@connections/{connectionId}
```

| Method | Action |
|--------|--------|
| POST | Push message to client |
| GET | Check connection status |
| DELETE | Disconnect client |

Must sign with **IAM Sig v4**.

### Routing
Route selection expression applied to incoming JSON:
- Built-in routes: `$connect`, `$disconnect`, `$default`
- Custom routes: user-defined (e.g. join, quit, delete)
- If no match → `$default`

Example: `$request.body.action` → `"join"` → routes to `join` backend

---

## 12. API Gateway Architecture

API GW can act as a **unified facade** for multiple backends:

```
customer1.example.com ─┐
                        ├─→ API Gateway ─→ /service1 → ELB → ECS Cluster
customer2.example.com ─┘                 /docs     → S3 Bucket
                                          /service2 → ELB → EC2 Auto Scaling
                         Route 53 handles DNS
```

API GW is not just for Lambda — it can front **any backend**.

---

## Consolidated Exam Tips

| Trigger | Answer |
|---------|--------|
| Changes not live | Forgot to **deploy to a stage** |
| Stage variable syntax (general) | `$stageVariables.varName` |
| Stage variable in Lambda ARN | `${stageVariables.varName}` |
| Stage variables in Lambda | Passed via **context object** |
| Stage vars + versions | Use **Lambda aliases** pattern |
| Canary = | Blue/Green deployment |
| REST → SOAP | **Mapping template** (non-proxy HTTP integration) |
| No backend response needed | **MOCK** integration |
| Secret header from client | **HTTP Proxy** — inject header at GW level |
| API GW timeout | **29 seconds** max → 504 on timeout |
| Edge-Optimized ACM cert | Must be in **us-east-1** |
| Cache invalidation header | `Cache-Control: max-age=0` (needs IAM auth) |
| Default cache TTL | **300s** |
| Max cache TTL | **3600s** |
| Usage plan setup order | Create API → API keys → usage plan → **associate** |
| API key header | `x-api-key` |
| Default account throttle | **10,000 req/s** (soft limit) |
| Throttling error code | **429** → exponential backoff |
| Timeout error code | **504** |
| Internal AWS access | **IAM + Sig v4** |
| External users | **Cognito User Pools** |
| 3rd party auth | **Lambda Authorizer** (returns IAM policy, result cached) |
| Cross-account API access | **IAM + Resource Policy** |
| HTTP API vs REST API | HTTP = cheaper, no mapping templates/usage plans/resource policies |
| WebSocket: push to client | POST to `/@connections/{connectionId}` |
| WebSocket: routing | `$request.body.{field}` → Route Key Table → `$default` fallback |
| CORS pre-flight method | **OPTIONS** |
| CORS headers (3) | `Allow-Methods`, `Allow-Headers`, `Allow-Origin` |
