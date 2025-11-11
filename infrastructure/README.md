# Infrastructure Configuration

This directory contains infrastructure as code (IaC) configurations for the CrewLink application.

## ECS Task Definitions

### Staging (`ecs-task-definition-staging.json`)
- **CPU**: 512 (0.5 vCPU)
- **Memory**: 1024 MB (1 GB)
- **Family**: `crewlink-web-staging`
- **Network Mode**: `awsvpc` (required for Fargate)

### Production (`ecs-task-definition-production.json`)
- **CPU**: 1024 (1 vCPU)
- **Memory**: 2048 MB (2 GB)
- **Family**: `crewlink-web-production`
- **Network Mode**: `awsvpc` (required for Fargate)

## Setup Instructions

### Before First Deployment

1. **Replace Placeholders in Task Definitions:**
   - `ACCOUNT_ID`: Your AWS account ID
   - `REGION`: Your AWS region (e.g., `us-east-1`)
   - `IMAGE_TAG`: Will be replaced dynamically during deployment

2. **Create AWS Secrets Manager Secrets:**
   Create the following secrets in AWS Secrets Manager for each environment:

   **Staging:**
   - `crewlink/staging/database-url`
   - `crewlink/staging/redis-url`
   - `crewlink/staging/nextauth-secret`
   - `crewlink/staging/nextauth-url`
   - `crewlink/staging/aws-region`
   - `crewlink/staging/aws-access-key-id`
   - `crewlink/staging/aws-secret-access-key`
   - `crewlink/staging/openai-api-key`

   **Production:**
   - `crewlink/production/database-url`
   - `crewlink/production/redis-url`
   - `crewlink/production/nextauth-secret`
   - `crewlink/production/nextauth-url`
   - `crewlink/production/aws-region`
   - `crewlink/production/aws-access-key-id`
   - `crewlink/production/aws-secret-access-key`
   - `crewlink/production/openai-api-key`

3. **Create IAM Roles:**
   - `ecsTaskExecutionRole`: For ECS to pull images and access secrets
   - `ecsTaskRole`: For the application to access AWS services

4. **Create CloudWatch Log Groups:**
   - `/ecs/crewlink-web-staging`
   - `/ecs/crewlink-web-production`

5. **Register Task Definitions:**
   ```bash
   # Staging
   aws ecs register-task-definition --cli-input-json file://infrastructure/ecs-task-definition-staging.json

   # Production
   aws ecs register-task-definition --cli-input-json file://infrastructure/ecs-task-definition-production.json
   ```

## Deployment Workflow

The GitHub Actions workflows (`.github/workflows/deploy-*.yml`) will:
1. Build and push Docker images to ECR
2. Update task definitions with new image tags
3. Deploy updated task definitions to ECS services
4. Monitor deployment and rollback on failure

## Notes

- Task definitions use AWS Secrets Manager for secure environment variable management
- Health checks are configured to verify application availability
- Logs are sent to CloudWatch Logs for monitoring
- Production uses higher CPU/memory allocation for better performance

