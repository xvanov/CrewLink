/**
 * CI/CD Pipeline Validation Tests
 * 
 * These tests verify that CI/CD configuration is correct and
 * that the application can be built and tested in CI environment.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('CI/CD Pipeline Configuration', () => {
  const projectRoot = path.join(__dirname, '../../..');
  const workflowsDir = path.join(projectRoot, '.github/workflows');
  const dockerfilePath = path.join(projectRoot, 'apps/web/Dockerfile');
  const dockerComposePath = path.join(projectRoot, 'docker-compose.yml');

  describe('AC-1.4.1: CI Pipeline Configuration', () => {
    it('should have CI workflow file', () => {
      const ciWorkflow = path.join(workflowsDir, 'ci.yml');
      expect(fs.existsSync(ciWorkflow)).toBe(true);
    });

    it('should have test execution in CI workflow', () => {
      const ciWorkflow = path.join(workflowsDir, 'ci.yml');
      const content = fs.readFileSync(ciWorkflow, 'utf-8');
      
      expect(content).toContain('test-unit');
      expect(content).toContain('test-e2e');
      expect(content).toContain('npm test');
      expect(content).toContain('npm run test:e2e');
    });

    it('should configure CI to run on push and pull_request', () => {
      const ciWorkflow = path.join(workflowsDir, 'ci.yml');
      const content = fs.readFileSync(ciWorkflow, 'utf-8');
      
      expect(content).toContain('on:');
      expect(content).toContain('push:');
      expect(content).toContain('pull_request:');
    });
  });

  describe('AC-1.4.2: Linting and Formatting Configuration', () => {
    it('should have lint job in CI workflow', () => {
      const ciWorkflow = path.join(workflowsDir, 'ci.yml');
      const content = fs.readFileSync(ciWorkflow, 'utf-8');
      
      expect(content).toContain('lint:');
      expect(content).toContain('npm run lint');
    });

    it('should have Prettier format check in CI workflow', () => {
      const ciWorkflow = path.join(workflowsDir, 'ci.yml');
      const content = fs.readFileSync(ciWorkflow, 'utf-8');
      
      expect(content).toContain('prettier');
      expect(content).toContain('--check');
    });
  });

  describe('AC-1.4.3: Build Process Configuration', () => {
    it('should have build job in CI workflow', () => {
      const ciWorkflow = path.join(workflowsDir, 'ci.yml');
      const content = fs.readFileSync(ciWorkflow, 'utf-8');
      
      expect(content).toContain('build:');
      expect(content).toContain('npm run build');
    });

    it('should upload build artifacts', () => {
      const ciWorkflow = path.join(workflowsDir, 'ci.yml');
      const content = fs.readFileSync(ciWorkflow, 'utf-8');
      
      expect(content).toContain('upload-artifact');
      expect(content).toContain('nextjs-build');
    });
  });

  describe('AC-1.4.4: Deployment Pipeline Configuration', () => {
    it('should have staging deployment workflow', () => {
      const stagingWorkflow = path.join(workflowsDir, 'deploy-staging.yml');
      expect(fs.existsSync(stagingWorkflow)).toBe(true);
    });

    it('should have production deployment workflow', () => {
      const productionWorkflow = path.join(workflowsDir, 'deploy-production.yml');
      expect(fs.existsSync(productionWorkflow)).toBe(true);
    });

    it('should require manual approval for production', () => {
      const productionWorkflow = path.join(workflowsDir, 'deploy-production.yml');
      const content = fs.readFileSync(productionWorkflow, 'utf-8');
      
      expect(content).toContain('workflow_dispatch');
      expect(content).toContain('confirm');
    });
  });

  describe('AC-1.4.5: Environment Variable Management', () => {
    it('should use GitHub Secrets for sensitive data', () => {
      const stagingWorkflow = path.join(workflowsDir, 'deploy-staging.yml');
      const content = fs.readFileSync(stagingWorkflow, 'utf-8');
      
      expect(content).toContain('secrets.');
      expect(content).toContain('AWS_ACCESS_KEY_ID');
      expect(content).toContain('AWS_SECRET_ACCESS_KEY');
    });

    it('should not hardcode secrets in workflow files', () => {
      const workflows = ['ci.yml', 'deploy-staging.yml', 'deploy-production.yml'];
      
      workflows.forEach(workflow => {
        const workflowPath = path.join(workflowsDir, workflow);
        const content = fs.readFileSync(workflowPath, 'utf-8');
        
        // Check for common hardcoded secret patterns
        expect(content).not.toMatch(/password\s*=\s*["'][^"']+["']/i);
        expect(content).not.toMatch(/secret\s*=\s*["'][^"']{20,}["']/i);
        expect(content).not.toMatch(/key\s*=\s*["']sk-[^"']+["']/i);
      });
    });
  });

  describe('AC-1.4.6: Docker Containerization', () => {
    it('should have Dockerfile for Next.js application', () => {
      expect(fs.existsSync(dockerfilePath)).toBe(true);
    });

    it('should use multi-stage build in Dockerfile', () => {
      const content = fs.readFileSync(dockerfilePath, 'utf-8');
      
      expect(content).toContain('FROM');
      expect(content).toContain('AS');
      expect(content).toMatch(/FROM.*AS\s+(deps|builder|runner)/i);
    });

    it('should have docker-compose.yml for local development', () => {
      expect(fs.existsSync(dockerComposePath)).toBe(true);
    });

    it('should configure Docker build in CI workflow', () => {
      const stagingWorkflow = path.join(workflowsDir, 'deploy-staging.yml');
      const content = fs.readFileSync(stagingWorkflow, 'utf-8');
      
      expect(content).toContain('docker build');
      expect(content).toContain('Dockerfile');
    });
  });

  describe('AC-1.4.7: Single-Command Deployment', () => {
    it('should support workflow_dispatch for manual deployment', () => {
      const stagingWorkflow = path.join(workflowsDir, 'deploy-staging.yml');
      const content = fs.readFileSync(stagingWorkflow, 'utf-8');
      
      expect(content).toContain('workflow_dispatch');
    });

    it('should have deployment script or workflow trigger', () => {
      const stagingWorkflow = path.join(workflowsDir, 'deploy-staging.yml');
      const content = fs.readFileSync(stagingWorkflow, 'utf-8');
      
      expect(content).toContain('Deploy to Staging');
      expect(content).toContain('deploy-staging');
    });
  });
});

