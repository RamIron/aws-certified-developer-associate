# Section 16 - ECS, ECR & Fargate - Docker in AWS — Summary

## Lessons

| # | Lesson | Status |
|---|--------|--------|
| 16.1 | Docker Introduction | ✅ Completed |
| 16.2 | Amazon ECS | ✅ Completed |
| 16.3 | Creating ECS Cluster - Hands On | ✅ Skipped (hands-on) |
| 16.4 | Creating ECS Service - Hands On | ✅ Skipped (hands-on) |
| 16.5 | Amazon ECS - Auto Scaling | ✅ Completed |
| 16.6 | Amazon ECS - Rolling Updates | ✅ Completed |
| 16.7 | Amazon ECS - Solutions Architectures | ✅ Completed |
| 16.8 | Amazon ECS Task Definitions - Deep Dive | ✅ Completed |
| 16.9 | Amazon ECS Task Definitions - Hands On | ✅ Skipped (hands-on) |
| 16.10 | Amazon ECS - Task Placements | ✅ Completed |
| 16.11 | Amazon ECS - Clean Up - Hands On | ✅ Skipped (hands-on) |
| 16.12 | Amazon ECR | ✅ Completed |
| 16.13 | Amazon ECR - Hands On | ✅ Skipped (hands-on) |
| 16.14 | AWS CoPilot - Overview | ✅ Skipped (low exam relevance) |
| 16.15 | AWS CoPilot - Hands On | ✅ Skipped (hands-on) |
| 16.16 | Amazon EKS | ✅ Completed |
| 16.17 | Containers on AWS Quiz | ✅ Completed |

---

## Key Concepts

### Docker

- Packages apps into **containers** — standardized, portable, lightweight
- **Image** = blueprint (stored), **Container** = running instance
- Workflow: Dockerfile → Build → Push → Pull → Run
- "Microservices architecture" → think Docker/containers

### Container Services on AWS

| Service | What it does |
|---------|-------------|
| **ECS** | AWS-native container platform |
| **EKS** | Managed Kubernetes (open-source, cloud-agnostic) |
| **Fargate** | Serverless containers (works with ECS and EKS) |
| **ECR** | Docker image registry (private/public) |
| **Copilot** | CLI tool to simplify deploying containers |

### ECS Launch Types

| | EC2 Launch Type | Fargate Launch Type |
|---|----------------|-------------------|
| **Infrastructure** | You manage EC2 instances | AWS manages everything |
| **ECS Agent** | Required on each EC2 | Not needed |
| **Scaling** | Task scaling + EC2 scaling | Task scaling only |
| **Exam preference** | Less preferred | **Always preferred** |

### ECS Hierarchy

```
ECS Cluster
  └── Service (keeps desired tasks running)
       └── Tasks (running containers, from task definitions)
            └── Containers (1-10 per task definition)
```

### IAM Roles for ECS

| Role | Who uses it | Applies to |
|------|------------|------------|
| **EC2 Instance Profile** | ECS Agent (register, pull images, logs) | EC2 Launch Type only |
| **ECS Task Role** | Container itself (access S3, DynamoDB, etc.) | Both EC2 and Fargate |
| **Task Execution Role** | Pull images from ECR, fetch secrets | Both EC2 and Fargate |

- Task Role defined at **task definition** level (not service)
- Hotel analogy: Agent = manager, Tasks = guests

### ECS Auto Scaling

- Uses **AWS Application Auto Scaling**
- 3 metrics: **CPU**, **Memory**, **ALB Request Count Per Target**
- Types: Target Tracking, Step Scaling, Scheduled Scaling
- EC2 Launch Type: use **ECS Cluster Capacity Provider** (not plain ASG scaling)
- Task scaling ≠ EC2 scaling (two separate things)

### ECS Rolling Updates (Deployment Strategy)

- Replace old tasks (v1) with new tasks (v2) gradually
- **Min Healthy %**: how low capacity can go
- **Max %**: how high capacity can go
- Min < 100% = terminate first, then create | Min 100% = create first, then terminate

### ECS Task Definitions — Deep Dive

- JSON blueprint: image, ports, CPU/RAM, IAM role, env vars, logging
- Up to **10 containers** per definition, at least one **essential**
- **EC2 port mapping**: Dynamic Host Port Mapping (host port = 0, ALB finds it)
- **Fargate port mapping**: each task gets unique private IP via ENI
- **Environment variables**: hardcoded, SSM Parameter Store, Secrets Manager, S3 file
- **Sidecar pattern**: bind mount shares data between containers in same task

### ECS Task Placements (EC2 Launch Type Only)

| Strategy | Goal |
|----------|------|
| **Binpack** | Cost saving (fill instances, minimize count) |
| **Spread** | High availability (distribute across AZs) |
| **Random** | No optimization |

| Constraint | What it does |
|-----------|-------------|
| **distinctInstance** | One task per EC2 instance (hard rule) |
| **memberOf** | Only on instances matching a condition (e.g., t2 types) |

### ECS Solutions Architectures

- **Event-driven**: S3 → EventBridge → ECS Fargate Task
- **Scheduled**: EventBridge Schedule → ECS Fargate Task
- **Queue-driven**: SQS → ECS Service (auto-scales on queue depth)
- **Lifecycle events**: ECS task stops → EventBridge → SNS alert

### Amazon ECR

- Store Docker images on AWS (private or public)
- Access controlled by **IAM** (permission error? check policies)
- Images stored on **S3** behind the scenes
- CLI: `aws ecr get-login-password` → `docker login` → `docker push/pull`

### Amazon EKS

- Managed **Kubernetes** (open-source, cloud-agnostic)
- ECS Task = EKS **Pod**
- Node types: Managed Node Groups, Self-Managed, Fargate
- EKS + Fargate storage → only **EFS** works

### Load Balancer Integration

- **ALB** = recommended (works with EC2 and Fargate)
- **NLB** = high throughput / AWS Private Link only
- **CLB** = not recommended, does NOT work with Fargate

### Data Persistence

- **EFS** = shared persistent storage across AZs (both EC2 and Fargate)
- **Bind mounts** = temporary shared storage within one task (sidecar pattern)
- **Fargate + EFS** = fully serverless combo

---

## Consolidated Exam Tips

- **Fargate** = exam's preferred answer for "least operational overhead"
- **ECS Task Role** = container permissions, defined in **task definition**
- **EC2 Instance Profile** = ECS Agent permissions (EC2 launch type only)
- **ECR** = "store Docker images on AWS"
- **EKS** = "already using Kubernetes" or "multi-cloud"
- ECS auto scaling: **CPU, Memory, ALB Request Count** (3 metrics)
- Predictable traffic pattern → **Scheduled Scaling**
- Tasks stuck PENDING → **Capacity Provider** (need more EC2 capacity)
- **Binpack** = cost saving, **Spread** = high availability
- **distinctInstance** = one task per instance (hard constraint)
- EC2 Dynamic Host Port Mapping = host port 0, ALB discovers ports
- Fargate = each task gets own **private IP via ENI**
- Secrets in containers → **SSM Parameter Store** or **Secrets Manager**
- Sidecar containers share data via **bind mounts**
- Rolling updates: Min 100% = no capacity loss during deploy
- "Process S3 uploads with Docker" → EventBridge + ECS Fargate
- **Fargate + EFS** = serverless compute + serverless storage
- **CLB** does NOT work with Fargate
- EKS + Fargate storage → only **EFS**
- **Copilot** = CLI tool to simplify container deployments
