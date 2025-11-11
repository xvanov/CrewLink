# CrewLink

A modern full-stack application for Pay-for-Performance (P4P) tracking and checklist management with AI-powered features.

## Prerequisites

- **Node.js**: 18+ (verify with `node --version`)
- **npm**: Latest version (comes with Node.js)
- **PostgreSQL**: For database (to be configured in Story 1.2)
- **Redis**: For caching and background jobs (to be configured)

## Project Structure

This is a monorepo containing:

- `apps/web/` - Next.js web dashboard
- `apps/mobile/` - React Native mobile app
- `infrastructure/` - Infrastructure as Code (AWS, Docker)
- `docs/` - Project documentation

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd crewlink
```

### 2. Install Dependencies

Install dependencies for both web and mobile apps:

```bash
# Install web app dependencies
cd apps/web
npm install

# Install mobile app dependencies
cd ../mobile
npm install
```

### 3. Configure Environment Variables

Copy the example environment files and fill in your values:

```bash
# Web app
cd apps/web
cp .env.example .env.local
# Edit .env.local with your configuration

# Mobile app
cd ../mobile
cp .env.example .env.local
# Edit .env.local with your configuration
```

Required environment variables for web app:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `NEXTAUTH_URL` - Base URL for the application
- AWS credentials (S3, SNS, SES)
- API keys (OpenAI, Service Autopilot, Paychex)

### 4. Build Commands

```bash
# Web app
cd apps/web
npm run build    # Build for production
npm run dev      # Start development server

# Mobile app
cd apps/mobile
npm start        # Start Metro bundler
npm run android  # Run on Android
npm run ios      # Run on iOS
```

### 5. Run Tests

```bash
# E2E tests (from root)
npm run test:e2e

# Unit tests (from app directories)
cd apps/web
npm test
```

## Technology Stack

- **Web Framework**: Next.js 16+ (App Router)
- **Mobile Framework**: React Native 0.82+
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Background Jobs**: BullMQ with Redis
- **Cloud Services**: AWS (S3, SNS, SES)
- **AI/ML**: OpenAI API
- **Testing**: Jest, Playwright

## Development

### Code Style

- ESLint is configured for both projects
- Prettier is configured for consistent formatting
- Run `npm run lint` to check code quality

### TypeScript

Both projects use TypeScript with strict mode enabled. Run type checking:

```bash
cd apps/web
npx tsc --noEmit

cd ../mobile
npx tsc --noEmit
```

## Architecture

See `docs/architecture.md` for detailed architecture documentation.

## Documentation

- `docs/PRD.md` - Product Requirements Document
- `docs/architecture.md` - System Architecture
- `docs/epics.md` - Epic Breakdown and Stories

## License

[Add license information]


