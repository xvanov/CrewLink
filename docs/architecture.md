# Architecture

## Executive Summary

CrewLink is built as a modern full-stack application using Next.js for the web dashboard and React Native for the mobile app. The architecture leverages AWS infrastructure for scalability, Prisma for type-safe database access, and OpenAI for AI-driven features. The system is designed to handle 10,000 concurrent users with 99.9% uptime, processing payroll data for 500 employees and supporting real-time checklist management with AI-powered voice, photo, and video processing.

## Project Initialization

**First Implementation Story**: Project initialization using Create Next App

```bash
npx create-next-app@latest crewlink --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

This establishes the base architecture with these decisions:
- ✅ Next.js framework with App Router
- ✅ TypeScript enabled
- ✅ Tailwind CSS for styling
- ✅ ESLint for code quality
- ✅ `src/` directory structure
- ✅ Import alias `@/*` configured

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| Framework | Next.js (App Router) | Latest (verify) | All web epics | Modern React framework with SSR/SSG, API routes, excellent DX |
| Database | PostgreSQL | Latest stable (verify) | All data persistence epics | Reliable, scalable, supports complex relationships |
| ORM | Prisma | Latest stable (verify) | All data persistence epics | Type-safe queries, excellent Next.js integration, robust migrations |
| Authentication | NextAuth.js (v5) | Latest stable (verify) | All auth epics | Native Next.js integration, JWT support, flexible session management |
| Background Jobs | BullMQ | Latest stable (verify) | P4P processing, AI processing, notifications | Reliable job processing, good scheduling, retry logic |
| File Storage | AWS S3 | Latest (via @aws-sdk/client-s3 v3) | Checklist photo/video uploads | Scalable, cost-effective, integrates with AWS |
| Push Notifications | AWS SNS | Latest (via @aws-sdk/client-sns v3) | Mobile notifications | Matches AWS infrastructure, supports multiple channels |
| Email Service | AWS SES | Latest (via @aws-sdk/client-ses v3) | Email notifications | Cost-effective, AWS-native, good deliverability |
| AI/ML Service | OpenAI API | Latest stable (verify) | Voice, photo, video processing | Strong NLP models, good vision API, reliable service |
| Caching | Redis (ElastiCache) | Latest stable (verify) | Performance optimization | Required for BullMQ, high performance, scalable |
| Mobile Framework | React Native | Latest stable (verify) | Mobile app epics | Cross-platform, good ecosystem, matches web stack |
| Logging | Winston/Pino | Latest stable (verify) | All epics | Structured JSON logging, CloudWatch integration |
| Testing | Jest + Playwright | Latest stable (verify) | All epics | Comprehensive testing coverage |

## Project Structure

```
crewlink/
├── apps/
│   ├── web/                          # Next.js Web Dashboard
│   │   ├── src/
│   │   │   ├── app/                  # App Router
│   │   │   │   ├── (auth)/            # Auth routes
│   │   │   │   │   ├── login/
│   │   │   │   │   └── callback/
│   │   │   │   ├── (dashboard)/      # Protected routes
│   │   │   │   │   ├── admin/        # Admin dashboard
│   │   │   │   │   ├── manager/      # Manager dashboard
│   │   │   │   │   ├── foreman/      # Foreman dashboard
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── api/              # API Routes
│   │   │   │   │   ├── auth/         # NextAuth routes
│   │   │   │   │   ├── p4p/          # P4P endpoints
│   │   │   │   │   ├── checklists/   # Checklist endpoints
│   │   │   │   │   ├── users/        # User management
│   │   │   │   │   ├── notifications/
│   │   │   │   │   └── integrations/ # External integrations
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/          # React components
│   │   │   │   ├── ui/               # Base UI components
│   │   │   │   ├── p4p/              # P4P-specific components
│   │   │   │   ├── checklists/       # Checklist components
│   │   │   │   ├── dashboard/        # Dashboard components
│   │   │   │   └── shared/           # Shared components
│   │   │   ├── lib/                  # Utilities
│   │   │   │   ├── prisma.ts         # Prisma client
│   │   │   │   ├── redis.ts          # Redis client
│   │   │   │   ├── auth.ts           # NextAuth config
│   │   │   │   ├── s3.ts             # S3 client
│   │   │   │   ├── sns.ts            # SNS client
│   │   │   │   ├── ses.ts            # SES client
│   │   │   │   ├── openai.ts         # OpenAI client
│   │   │   │   ├── bullmq.ts         # BullMQ setup
│   │   │   │   ├── logger.ts         # Winston/Pino logger
│   │   │   │   ├── errors.ts         # Error handling
│   │   │   │   └── utils.ts         # General utilities
│   │   │   ├── hooks/                # React hooks
│   │   │   ├── types/                # TypeScript types
│   │   │   └── styles/               # Global styles
│   │   ├── public/                   # Static assets
│   │   ├── prisma/                   # Prisma schema & migrations
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── jobs/                     # BullMQ job definitions
│   │   │   ├── p4p/
│   │   │   ├── ai-processing/
│   │   │   └── notifications/
│   │   ├── workers/                  # BullMQ workers
│   │   ├── .env.local
│   │   ├── .env.example
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── mobile/                       # React Native Mobile App
│       ├── src/
│       │   ├── app/                  # App navigation
│       │   ├── screens/              # Screen components
│       │   │   ├── auth/
│       │   │   ├── p4p/
│       │   │   ├── checklists/
│       │   │   └── profile/
│       │   ├── components/           # Reusable components
│       │   ├── services/             # API services
│       │   ├── hooks/                # React hooks
│       │   ├── utils/                # Utilities
│       │   ├── types/                # TypeScript types
│       │   └── i18n/                 # Internationalization (EN/ES)
│       ├── assets/                   # Images, fonts, etc.
│       ├── .env.local
│       ├── app.json
│       ├── tsconfig.json
│       └── package.json
│
├── packages/                          # Shared packages (optional)
│   ├── shared-types/                 # Shared TypeScript types
│   └── shared-utils/                 # Shared utilities
│
├── infrastructure/                   # Infrastructure as Code
│   ├── aws/                          # AWS CDK/Terraform
│   │   ├── ecs/                      # ECS/EKS config
│   │   ├── rds/                      # RDS config
│   │   ├── s3/                       # S3 buckets
│   │   ├── elasticache/              # ElastiCache config
│   │   └── iam/                      # IAM roles
│   └── docker/                       # Docker configs
│
├── docs/                             # Documentation
│   ├── PRD.md
│   ├── architecture.md               # This document
│   └── technical/
│
├── .github/                          # CI/CD workflows
│   └── workflows/
│
├── .gitignore
├── package.json                      # Root package.json (monorepo)
└── README.md
```

## Epic to Architecture Mapping

### P4P Core Epics

| Epic | Architecture Location | Key Components |
|------|----------------------|----------------|
| Data Integration & Processing | `apps/web/jobs/p4p/`, `apps/web/src/app/api/p4p/` | BullMQ jobs, Service Autopilot/Paychex integrations |
| Web Dashboard (Admin/Manager) | `apps/web/src/app/(dashboard)/admin/`, `apps/web/src/app/(dashboard)/manager/` | Next.js pages, React components |
| Mobile App (Field Workers) | `apps/mobile/src/screens/p4p/` | React Native screens, API services |
| Communication & Notifications | `apps/web/jobs/notifications/`, `apps/web/src/lib/sns.ts`, `apps/web/src/lib/ses.ts` | BullMQ jobs, AWS SNS/SES clients |

### Checklist Core Epics

| Epic | Architecture Location | Key Components |
|------|----------------------|----------------|
| Project & Checklist Management | `apps/web/src/app/api/checklists/`, `apps/mobile/src/screens/checklists/` | API routes, React Native screens |
| Natural Language Processing | `apps/web/src/lib/openai.ts`, `apps/web/jobs/ai-processing/` | OpenAI client, BullMQ jobs |
| Photo & Video Processing | `apps/web/src/lib/s3.ts`, `apps/web/jobs/ai-processing/` | S3 client, AI processing jobs |
| Checklist Query & Search | `apps/web/src/app/api/checklists/` | API routes with Prisma queries |

### Integration Points

- **Service Autopilot** → `apps/web/src/app/api/integrations/service-autopilot/`
- **Paychex** → `apps/web/src/app/api/integrations/paychex/`
- **Push Notifications** → `apps/web/src/lib/sns.ts` (web), `apps/mobile/src/services/notifications.ts` (mobile)
- **File Storage** → `apps/web/src/lib/s3.ts` (web), `apps/mobile/src/services/storage.ts` (mobile)

### Shared Services

- **Database** → `apps/web/src/lib/prisma.ts` (shared via API)
- **Authentication** → `apps/web/src/lib/auth.ts` (NextAuth), `apps/mobile/src/services/auth.ts` (mobile)
- **Caching** → `apps/web/src/lib/redis.ts`
- **Background Jobs** → `apps/web/jobs/`, `apps/web/workers/`

## Technology Stack Details

### Core Technologies

**Frontend (Web):**
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (server state), React useState/useReducer (local state)
- **UI Components**: Custom components with Tailwind CSS

**Frontend (Mobile):**
- **Framework**: React Native
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: React Query (server state), React useState/useReducer (local state)
- **Internationalization**: react-i18next (English/Spanish)

**Backend:**
- **Runtime**: Node.js (Next.js API Routes / Serverless Functions)
- **API Framework**: Next.js API Routes (RESTful)
- **Database**: PostgreSQL (AWS RDS)
- **ORM**: Prisma
- **Authentication**: NextAuth.js (v5)
- **Background Jobs**: BullMQ (with Redis)
- **Caching**: Redis (AWS ElastiCache)

**Infrastructure:**
- **Cloud Provider**: AWS
- **Compute**: ECS/EKS or Lambda (for serverless)
- **Database**: RDS PostgreSQL
- **Cache**: ElastiCache Redis
- **Storage**: S3 (for media files)
- **CDN**: CloudFront (optional, for static assets)
- **Monitoring**: CloudWatch

**External Services:**
- **AI/ML**: OpenAI API (GPT-4, GPT-4 Vision)
- **Push Notifications**: AWS SNS
- **Email**: AWS SES
- **File Storage**: AWS S3

### Integration Points

**Service Autopilot Integration:**
- **Method**: API or file export (to be determined)
- **Location**: `apps/web/src/app/api/integrations/service-autopilot/`
- **Processing**: BullMQ job for daily data collection
- **Schedule**: Daily at 10:30 AM

**Paychex Integration:**
- **Method**: API integration
- **Location**: `apps/web/src/app/api/integrations/paychex/`
- **Processing**: BullMQ job for payroll export
- **Workflow**: Admin approval → Export to Paychex

**OpenAI Integration:**
- **Services**: GPT-4 (NLP), GPT-4 Vision (image analysis)
- **Location**: `apps/web/src/lib/openai.ts`
- **Processing**: BullMQ jobs for async AI processing
- **Use Cases**: Voice commands, photo analysis, video frame analysis

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Naming Patterns

**API Routes:**
- Use plural nouns, kebab-case: `/api/users`, `/api/p4p/performance-scores`
- Route parameters: `[id]` format in Next.js App Router

**Database Tables (Prisma):**
- Singular nouns, PascalCase: `User`, `PerformanceScore`, `ChecklistItem`
- Columns: camelCase (`userId`, `createdAt`)
- Foreign keys: `{modelName}Id` format

**React Components:**
- PascalCase: `UserCard.tsx`, `PerformanceDashboard.tsx`
- File name matches component name exactly

**TypeScript Types:**
- PascalCase: `User`, `CreateUserRequest`, `ApiResponse<T>`

**Utility Functions:**
- camelCase, verb-noun: `formatDate()`, `calculatePerformanceScore()`

**Environment Variables:**
- UPPER_SNAKE_CASE: `DATABASE_URL`, `OPENAI_API_KEY`

### Structure Patterns

**Test Organization:**
- Co-located with source files: `route.test.ts`, `UserCard.test.tsx`
- Use `.test.ts` for unit tests, `.test.tsx` for component tests

**Component Organization:**
- Organize by feature, not by type:
  ```
  components/
    p4p/              # Feature-based
    checklists/       # Feature-based
    shared/           # Shared components
  ```

**Shared Utilities:**
- Place in `src/lib/` directory
- One file per service: `prisma.ts`, `redis.ts`, `auth.ts`

**API Route Organization:**
- Use Next.js App Router structure:
  ```
  app/api/users/route.ts          # GET, POST /api/users
  app/api/users/[id]/route.ts     # GET, PUT, DELETE /api/users/:id
  ```

### Format Patterns

**API Response Format:**
```typescript
// Success
{
  success: true,
  data: <response_data>
}

// Error
{
  success: false,
  error: {
    code: string,        // "VALIDATION_ERROR", "NOT_FOUND"
    message: string      // User-friendly message
  }
}
```

**Error Format:**
```typescript
{
  code: string,           // UPPER_SNAKE_CASE
  message: string,         // User-friendly
  details?: any           // Optional additional details
}
```

**Date Format:**
- Database: UTC `timestamptz` in PostgreSQL
- API: ISO 8601 format (`2025-01-27T10:30:00Z`)
- UI: Use `date-fns` or `dayjs` for timezone-aware formatting

**JSON Format:**
- camelCase for all JSON properties: `{ "userId": 123, "performanceScore": 85.5 }`

### Communication Patterns

**API Client Calls:**
```typescript
const response = await fetch('/api/users', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
});

if (!response.ok) {
  const error = await response.json();
  throw new ApiError(error.error.code, error.error.message);
}

const result = await response.json();
return result.data;
```

**State Management:**
- Server state: React Query
- Local state: React useState/useReducer

**Event Handlers:**
- Use `handle` prefix: `handleSubmit`, `handleUserClick`

### Lifecycle Patterns

**Loading States:**
```typescript
const { data, isLoading, error } = useQuery(...);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <DataDisplay data={data} />;
```

**Error Recovery:**
- Retry logic in BullMQ jobs (configurable retries)
- API retry with exponential backoff
- User-friendly error messages

**Retry Logic:**
- BullMQ: Configurable retry attempts with exponential backoff
- API calls: 3 retries with exponential backoff for transient errors

### Location Patterns

**API Route Structure:**
- `/api/{resource}` for collections
- `/api/{resource}/[id]` for individual resources
- `/api/{resource}/[id]/{action}` for actions

**Static Assets:**
- Place in `public/` directory
- Reference as `/asset-name.png` (no `/public` in path)

**Config Files:**
- Environment variables: `.env.local` (gitignored)
- Example: `.env.example` (committed)

## Consistency Rules

### Naming Conventions

- **API Routes**: Plural nouns, kebab-case (`/api/users`, `/api/performance-scores`)
- **Database Models**: Singular nouns, PascalCase (`User`, `PerformanceScore`)
- **Components**: PascalCase (`UserCard`, `PerformanceDashboard`)
- **Functions**: camelCase (`formatDate`, `calculateScore`)
- **Types**: PascalCase (`User`, `ApiResponse<T>`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `DEFAULT_TIMEOUT`)

### Code Organization

- **Components**: Feature-based organization (`components/p4p/`, `components/checklists/`)
- **Utilities**: Single file per service in `lib/` directory
- **Tests**: Co-located with source files (`.test.ts`, `.test.tsx`)
- **Types**: Shared types in `types/` directory

### Error Handling

**Pattern:**
```typescript
try {
  // Operation
} catch (error) {
  logger.error('Operation failed', { error, context });
  throw new ApiError('OPERATION_FAILED', 'User-friendly message', error);
}
```

**Error Types:**
- `ValidationError`: User input validation failures
- `NotFoundError`: Resource not found
- `UnauthorizedError`: Authentication/authorization failures
- `InternalError`: Server-side errors

**User-Facing Messages:**
- Non-technical, actionable messages
- Localized (English/Spanish)
- Consistent tone

### Logging Strategy

**Library**: Winston or Pino (structured JSON logging)

**Format**: JSON structured logs
```json
{
  "level": "error",
  "message": "Operation failed",
  "timestamp": "2025-01-27T10:30:00Z",
  "requestId": "req-123",
  "userId": "user-456",
  "context": { ... }
}
```

**Levels**: `error`, `warn`, `info`, `debug`

**Destination**: CloudWatch Logs (AWS-native)

**Context**: Include request ID, user ID, timestamp, and relevant context

## Data Architecture

### Core Models

**User Model:**
- `id`, `email`, `name`, `role`, `languagePreference`, `createdAt`, `updatedAt`
- Roles: `ADMIN`, `MANAGER`, `FOREMAN`, `CREW_MEMBER`, `CONSTRUCTION_MANAGER`, `FIELD_TECHNICIAN`, `PROJECT_COORDINATOR`

**Performance Score Model:**
- `id`, `userId`, `date`, `score`, `payout`, `chr`, `budgetedHours`, `actualHours`, `lateStart`, `lunchBreakCompliant`, `createdAt`

**Project Model:**
- `id`, `name`, `description`, `status`, `createdAt`, `updatedAt`

**Checklist Model:**
- `id`, `projectId`, `name`, `description`, `createdAt`, `updatedAt`

**ChecklistItem Model:**
- `id`, `checklistId`, `description`, `status`, `assignedToId`, `dueDate`, `completedAt`, `createdAt`, `updatedAt`

**Media Model:**
- `id`, `checklistItemId`, `type` (photo/video), `s3Key`, `url`, `createdAt`

### Relationships

- `User` → `PerformanceScore` (one-to-many)
- `Project` → `Checklist` (one-to-many)
- `Checklist` → `ChecklistItem` (one-to-many)
- `ChecklistItem` → `User` (assignedTo, many-to-one)
- `ChecklistItem` → `Media` (one-to-many)

### Data Flow

1. **P4P Processing**: Service Autopilot → BullMQ Job → Prisma → Database → Notification
2. **Checklist Updates**: Mobile App → API → BullMQ Job (AI processing) → Prisma → Database → Notification
3. **File Uploads**: Mobile App → API → S3 → Database (metadata) → Notification

## API Contracts

### Authentication

**POST /api/auth/login**
- Request: `{ email: string, password: string }`
- Response: `{ success: true, data: { user: User, token: string } }`

**POST /api/auth/logout**
- Request: None (uses session)
- Response: `{ success: true }`

### P4P Endpoints

**GET /api/p4p/performance-scores**
- Query params: `userId?`, `startDate?`, `endDate?`
- Response: `{ success: true, data: PerformanceScore[] }`

**GET /api/p4p/performance-scores/:id**
- Response: `{ success: true, data: PerformanceScore }`

**POST /api/p4p/process-daily**
- Admin only
- Response: `{ success: true, data: { jobId: string } }`

### Checklist Endpoints

**GET /api/checklists**
- Query params: `projectId?`, `status?`, `assignedTo?`
- Response: `{ success: true, data: Checklist[] }`

**POST /api/checklists**
- Request: `{ projectId: string, name: string, description?: string }`
- Response: `{ success: true, data: Checklist }`

**PUT /api/checklists/items/:id**
- Request: `{ status: string, completedAt?: Date }`
- Response: `{ success: true, data: ChecklistItem }`

**POST /api/checklists/items/:id/upload**
- Request: FormData with file
- Response: `{ success: true, data: { mediaId: string, url: string } }`

### Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message"
  }
}
```

HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security Architecture

### Authentication

- **Strategy**: NextAuth.js (v5) with JWT
- **Methods**: Email/password, optional MFA
- **Session Management**: JWT tokens with refresh tokens
- **Password Security**: Bcrypt hashing

### Authorization

- **Model**: Role-Based Access Control (RBAC)
- **Roles**: Admin, Manager, Foreman, Crew Member, Construction Manager, Field Technician, Project Coordinator
- **Implementation**: Middleware in Next.js API routes
- **Feature Access**: Single-tenant application with role-based feature access

### Data Protection

- **Encryption in Transit**: TLS 1.3+
- **Encryption at Rest**: AWS RDS encryption, S3 encryption
- **Sensitive Data**: PII encrypted, secure password storage

### Compliance

- **Standards**: GDPR, CCPA compliance
- **Audit Logging**: Comprehensive logs for sensitive operations (payroll, user management)
- **Data Retention**: Policies defined per data type

## Performance Considerations

### Caching Strategy

- **API Responses**: Redis cache with TTL (5-15 minutes depending on data)
- **Session Data**: Redis for session storage
- **Static Assets**: CloudFront CDN
- **Database Queries**: Prisma query optimization, connection pooling

### Optimization

- **API Response Time**: Target <500ms (p95)
- **Dashboard Load**: Target <2 seconds initial load
- **Mobile App Load**: Target <3 seconds on 4G
- **Database**: Indexed queries, connection pooling
- **Background Jobs**: BullMQ for async processing

### Scalability

- **Horizontal Scaling**: ECS/EKS for container orchestration
- **Database**: RDS with read replicas if needed
- **Cache**: ElastiCache Redis cluster mode
- **Load Balancing**: Application Load Balancer

## Deployment Architecture

### Infrastructure

- **Cloud Provider**: AWS
- **Compute**: ECS/EKS or Lambda (serverless)
- **Database**: RDS PostgreSQL (multi-AZ for high availability)
- **Cache**: ElastiCache Redis
- **Storage**: S3 (for media files)
- **CDN**: CloudFront (for static assets)

### Environment Strategy

- **Development**: Local development with Docker Compose
- **Staging**: AWS ECS/EKS staging environment
- **Production**: AWS ECS/EKS production environment with auto-scaling

### CI/CD

- **Source Control**: Git (GitHub/GitLab)
- **CI/CD Pipeline**: GitHub Actions or GitLab CI
- **Deployment**: Automated deployment to staging, manual approval for production
- **Testing**: Automated tests run in CI pipeline

## Development Environment

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm/yarn/pnpm**: Latest version
- **Docker**: For local database and Redis (optional)
- **AWS CLI**: For AWS service configuration
- **Git**: Version control

### Setup Commands

```bash
# 1. Initialize Next.js project
npx create-next-app@latest crewlink --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Install dependencies
cd crewlink
npm install prisma @prisma/client
npm install next-auth@beta
npm install bullmq ioredis
npm install @aws-sdk/client-s3 @aws-sdk/client-sns @aws-sdk/client-ses
npm install openai
npm install winston  # or pino
npm install date-fns  # or dayjs
npm install @tanstack/react-query

# 3. Initialize Prisma
npx prisma init

# 4. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 5. Run database migrations
npx prisma migrate dev

# 6. Generate Prisma Client
npx prisma generate

# 7. Start development server
npm run dev
```

### Environment Variables

Required environment variables:
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/crewlink"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AWS
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET_NAME="crewlink-media"

# OpenAI
OPENAI_API_KEY="your-openai-key"

# External Integrations
SERVICE_AUTOPILOT_API_KEY="your-key"
PAYCHEX_API_KEY="your-key"
```

## Architecture Decision Records (ADRs)

### ADR-001: Next.js App Router over Pages Router

**Decision**: Use Next.js App Router instead of Pages Router

**Rationale**: 
- Modern routing with better performance
- Better TypeScript support
- Improved developer experience
- Future-proof (App Router is the recommended approach)

**Consequences**:
- Must use Server Components and Client Components appropriately
- API routes use `route.ts` instead of `api/` directory structure

### ADR-002: Prisma over TypeORM

**Decision**: Use Prisma as the ORM instead of TypeORM

**Rationale**:
- Better TypeScript integration
- Strong Next.js integration
- Excellent developer experience
- Robust migration system

**Consequences**:
- Must use Prisma Client for all database operations
- Schema defined in `schema.prisma` file

### ADR-003: BullMQ over AWS SQS

**Decision**: Use BullMQ for background job processing instead of AWS SQS

**Rationale**:
- More control over job processing
- Better scheduling capabilities
- Retry logic built-in
- Required for Redis anyway (caching)

**Consequences**:
- Must maintain Redis infrastructure
- More operational complexity than managed service

### ADR-004: OpenAI API for AI/ML

**Decision**: Use OpenAI API for NLP and image analysis

**Rationale**:
- Strong NLP models (GPT-4)
- Good vision API
- Reliable service
- Supports multiple languages (English/Spanish)

**Consequences**:
- Third-party dependency
- Cost scales with usage
- Video analysis may require additional processing

### ADR-005: AWS-Native Services

**Decision**: Use AWS-native services (S3, SNS, SES, ElastiCache) for infrastructure

**Rationale**:
- Consistent infrastructure
- Cost-effective at scale
- Good integration between services
- Matches deployment target (AWS)

**Consequences**:
- Vendor lock-in to AWS
- Must manage AWS infrastructure

### ADR-006: Monorepo Structure

**Decision**: Use monorepo structure with separate apps for web and mobile

**Rationale**:
- Shared code between web and mobile
- Consistent development workflow
- Easier code sharing

**Consequences**:
- More complex build setup
- Need to manage dependencies across packages

---

_Generated by BMAD Decision Architecture Workflow v1.3.2_
_Date: 2025-01-27_
_For: xvanov_
