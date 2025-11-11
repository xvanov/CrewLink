# PRD-1 to PRD-2 Technical Alignment Guide

**Purpose:** Identify what must be added to PRD-1's technical requirements to ensure PRD-2 can be added without refactoring.

**Strategy:** Build PRD-1 with PRD-2's requirements in mind, even if not used initially.

---

## Executive Summary

To add PRD-2 (Talk, Photo, & Video for Checklists) after PRD-1 without refactoring, PRD-1 must include:

1. **Cloud Infrastructure:** AWS hosting (not just "cloud")
2. **Backend Framework:** Ruby/Rails OR choose unified stack (Node.js/TypeScript recommended)
3. **Mobile Framework:** React Native (not native Swift)
4. **File Storage:** S3-compatible storage for media files
5. **AI Services:** OpenAI/Google Cloud AI integration layer
6. **Real-time Processing:** Async job queue for sub-2-second responses
7. **Scalability Architecture:** Designed for 10,000 concurrent users
8. **Multi-language Infrastructure:** i18n framework supporting NLP

---

## Detailed Gap Analysis

### 1. Cloud Infrastructure & Hosting

**PRD-1 Current:** No specific cloud provider mentioned
**PRD-2 Requires:** AWS infrastructure

**Action Required:**
- ✅ Specify AWS as hosting platform in PRD-1
- ✅ Design microservices for AWS deployment (ECS/EKS, Lambda, etc.)
- ✅ Use AWS services from start: S3, RDS, CloudWatch, etc.

**Why Critical:** Moving from generic cloud to AWS later requires infrastructure refactoring.

---

### 2. Backend Framework Decision

**PRD-1 Current:** No backend language/framework specified
**PRD-2 Requires:** Ruby/Rails

**Decision Point:** Choose ONE approach:

#### Option A: Use Ruby/Rails for PRD-1 (Matches PRD-2)
- ✅ Use Ruby/Rails from start
- ✅ PRD-2 adds features, not new framework
- ⚠️ Ruby/Rails may be overkill for PRD-1's batch processing needs

#### Option B: Unified Stack (RECOMMENDED)
- ✅ Use Node.js/TypeScript for both PRDs
- ✅ Better for real-time processing (PRD-2's 2-second requirement)
- ✅ Strong ecosystem for AI integrations
- ✅ React Native works seamlessly with Node.js backends
- ⚠️ Requires updating PRD-2's tech spec to Node.js

**Recommendation:** Choose Node.js/TypeScript + Express/Fastify for unified stack. Update PRD-2 to match.

---

### 3. Mobile App Framework

**PRD-1 Current:** "Crew mobile app" - no framework specified
**PRD-2 Requires:** React Native (or Swift native)

**Action Required:**
- ✅ Use React Native for PRD-1 mobile app
- ✅ Design component architecture for feature modules
- ✅ Set up navigation structure to accommodate multiple features

**Why Critical:** Switching from native Swift to React Native (or vice versa) requires complete mobile app rewrite.

---

### 4. File Storage & Media Handling

**PRD-1 Current:** No file storage mentioned
**PRD-2 Requires:** Photo/video upload, storage, and processing

**Action Required:**
- ✅ Add AWS S3 (or S3-compatible) to PRD-1 tech stack
- ✅ Design file upload API endpoints (even if unused in PRD-1)
- ✅ Implement file storage service in microservices architecture
- ✅ Set up CDN for media delivery (CloudFront)

**Why Critical:** Adding file storage later requires new service, API changes, and infrastructure setup.

---

### 5. AI/ML Services Integration

**PRD-1 Current:** "ML models for anomaly detection" - no specific service
**PRD-2 Requires:** OpenAI or Google Cloud AI for NLP and image analysis

**Action Required:**
- ✅ Add AI service integration layer to PRD-1
- ✅ Use same AI provider for PRD-1's anomaly detection (OpenAI/Google Cloud)
- ✅ Design abstract AI service interface (allows switching providers)
- ✅ Set up API keys, rate limiting, error handling

**Why Critical:** Adding AI services later requires new microservice, API design, and integration patterns.

---

### 6. Real-time Processing Architecture

**PRD-1 Current:** Batch processing (10-minute window acceptable)
**PRD-2 Requires:** 2-second latency for NLP/image processing

**Action Required:**
- ✅ Design async job queue system (BullMQ, Sidekiq, or AWS SQS)
- ✅ Separate batch processing (PRD-1) from real-time processing (PRD-2)
- ✅ Implement worker pool architecture
- ✅ Set up monitoring for processing times

**Why Critical:** Adding real-time processing to batch-only system requires architectural changes.

---

### 7. Scalability Requirements

**PRD-1 Current:** ~50 employees (small scale)
**PRD-2 Requires:** 10,000 concurrent users

**Action Required:**
- ✅ Design for horizontal scaling from start
- ✅ Use stateless microservices
- ✅ Implement connection pooling, caching (Redis)
- ✅ Design database for scale (read replicas, sharding strategy)
- ✅ Load balancing architecture

**Why Critical:** Scaling from 50 to 10,000 users requires different architecture patterns.

---

### 8. Multi-language Support Infrastructure

**PRD-1 Current:** Bilingual (EN/ES) - likely hardcoded
**PRD-2 Requires:** Multi-language NLP (P1 requirement)

**Action Required:**
- ✅ Implement i18n framework (react-i18next, i18next)
- ✅ Design language detection and switching
- ✅ Store translations in database or translation service
- ✅ Design API to support language parameters
- ✅ Prepare for NLP multi-language support

**Why Critical:** Adding multi-language NLP requires language infrastructure already in place.

---

### 9. Database Architecture

**PRD-1 Current:** Not specified
**PRD-2 Requires:** Project/checklist data, user data, media metadata

**Action Required:**
- ✅ Choose database (PostgreSQL recommended for both)
- ✅ Design schema to accommodate both PRDs
- ✅ Use migrations from start
- ✅ Plan for JSON fields (checklist data, NLP results)

**Why Critical:** Database schema changes later require migrations and potential data loss.

---

### 10. Authentication & Authorization

**PRD-1 Current:** "Secure authentication" - not specified
**PRD-2 Requires:** User management, roles, permissions

**Action Required:**
- ✅ Implement comprehensive auth system (Auth0, Clerk, or custom)
- ✅ Design role-based access control (RBAC)
- ✅ Support multiple user types (crew, admin, manager, etc.)
- ✅ JWT tokens or session management

**Why Critical:** Adding auth later requires retrofitting all endpoints and frontend.

---

## Updated PRD-1 Technical Requirements (Recommended)

Add these sections to PRD-1's Technical Requirements:

### 9. Technical Requirements (UPDATED)

**Architecture:**
- Modular microservices architecture hosted on AWS
- Services: ECS/EKS for container orchestration
- Load balancing: Application Load Balancer
- Auto-scaling groups for dynamic scaling

**Backend:**
- **Language:** Node.js/TypeScript (or Ruby/Rails if preferred)
- **Framework:** Express.js/Fastify (or Rails)
- **API Style:** RESTful APIs with GraphQL consideration for future
- **Job Queue:** BullMQ (Node.js) or Sidekiq (Rails) for async processing
- **Database:** PostgreSQL with read replicas for scaling

**Frontend:**
- **Mobile:** React Native (iOS and Android)
- **Web Dashboard:** React.js or Next.js
- **State Management:** Redux Toolkit or Zustand
- **i18n:** react-i18next for multi-language support

**Infrastructure:**
- **Cloud Provider:** AWS
- **File Storage:** AWS S3 with CloudFront CDN
- **Caching:** Redis (ElastiCache)
- **Monitoring:** CloudWatch, DataDog, or New Relic
- **CI/CD:** GitHub Actions or AWS CodePipeline

**AI/ML Services:**
- **Provider:** OpenAI API or Google Cloud AI
- **Services:** 
  - Anomaly detection (PRD-1)
  - NLP processing (PRD-2 future)
  - Image/video analysis (PRD-2 future)
- **Architecture:** Abstract AI service layer for provider flexibility

**Performance:**
- **Batch Processing:** Up to 10 minutes for daily payroll runs (PRD-1)
- **Real-time Processing:** Sub-2-second response time capability (PRD-2 future)
- **Scalability:** Designed for 10,000+ concurrent users
- **Availability:** 99.9% uptime SLA

**Security:**
- Authentication: OAuth 2.0 / JWT tokens
- Authorization: Role-based access control (RBAC)
- Data encryption: At rest (AWS KMS) and in transit (TLS 1.3)
- API security: Rate limiting, input validation

**Integration Capabilities:**
- RESTful API endpoints for future integrations
- Webhook support for event-driven architecture
- File upload API endpoints (prepared for PRD-2)
- Real-time notification system (WebSockets or Server-Sent Events)

---

## Implementation Checklist for PRD-1

When building PRD-1, ensure these are included:

### Infrastructure Setup
- [ ] AWS account and IAM roles configured
- [ ] ECS/EKS cluster or Lambda functions set up
- [ ] S3 buckets created (even if unused initially)
- [ ] RDS PostgreSQL instance with read replica capability
- [ ] Redis/ElastiCache cluster
- [ ] CloudFront CDN configured
- [ ] CloudWatch monitoring and alerts

### Backend Services
- [ ] Microservices architecture with service discovery
- [ ] API Gateway or load balancer configured
- [ ] Job queue system implemented (BullMQ/Sidekiq)
- [ ] File upload service created (even if not used)
- [ ] AI service integration layer implemented
- [ ] Authentication/authorization service
- [ ] Database migrations system

### Mobile App
- [ ] React Native project initialized
- [ ] Navigation structure designed for multiple features
- [ ] i18n framework integrated (react-i18next)
- [ ] Component library/design system
- [ ] API client with language support
- [ ] Image picker library (for future PRD-2 use)

### Web Dashboard
- [ ] React/Next.js application
- [ ] i18n support
- [ ] File upload component (prepared for PRD-2)
- [ ] Real-time update capability

### Shared Services
- [ ] User management service
- [ ] Notification service (email, push, SMS)
- [ ] Logging and error tracking (Sentry, etc.)
- [ ] Analytics service (optional)

---

## Cost Considerations

Adding these to PRD-1 may increase initial costs:

- **AWS Infrastructure:** ~$200-500/month (vs. $50-100 for basic)
- **S3 Storage:** Minimal if unused, but buckets cost ~$0.023/GB
- **AI Services:** Only pay for what you use (OpenAI/Google Cloud)
- **Redis Cache:** ~$15-50/month for ElastiCache

**Trade-off:** Higher initial cost vs. avoiding expensive refactoring later.

---

## Risk Mitigation

**Risk:** Over-engineering PRD-1 for PRD-2 that may never come
**Mitigation:** 
- Build infrastructure, not features
- Use "prepared but unused" approach
- Document why each component exists

**Risk:** PRD-2 requirements change
**Mitigation:**
- Abstract interfaces (AI service, file storage)
- Use dependency injection
- Design for flexibility

---

## Next Steps

1. **Update PRD-1** with recommended technical requirements
2. **Decide on unified stack** (Node.js vs Ruby/Rails)
3. **Update PRD-2** if choosing unified stack
4. **Create architecture document** showing how PRD-2 fits
5. **Build PRD-1** with checklist items above
6. **Document** unused components for PRD-2

---

## Questions to Resolve

1. **Backend Stack:** Node.js/TypeScript or Ruby/Rails?
2. **AI Provider:** OpenAI or Google Cloud AI?
3. **Mobile:** React Native only, or also native Swift?
4. **Timeline:** How long between PRD-1 and PRD-2?
5. **Budget:** Acceptable increase in PRD-1 costs?


