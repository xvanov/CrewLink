import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('Project Structure', () => {
  const projectRoot = path.join(__dirname, '../../..');

  describe('AC-1.1.1: Next.js Project Structure', () => {
    it('should have src/app directory', () => {
      const appDir = path.join(projectRoot, 'src/app');
      expect(fs.existsSync(appDir)).toBe(true);
    });

    it('should have src/app/api directory for API routes', () => {
      const apiDir = path.join(projectRoot, 'src/app/api');
      expect(fs.existsSync(apiDir)).toBe(true);
    });

    it('should have TypeScript configuration', () => {
      const tsconfig = path.join(projectRoot, 'tsconfig.json');
      expect(fs.existsSync(tsconfig)).toBe(true);
    });
  });

  describe('AC-1.1.6: Folder Structure', () => {
    it('should have src/lib directory', () => {
      const libDir = path.join(projectRoot, 'src/lib');
      expect(fs.existsSync(libDir)).toBe(true);
    });

    it('should have components directory structure', () => {
      const componentsDir = path.join(projectRoot, 'src/components');
      expect(fs.existsSync(componentsDir)).toBe(true);
      
      const uiDir = path.join(componentsDir, 'ui');
      const p4pDir = path.join(componentsDir, 'p4p');
      const checklistsDir = path.join(componentsDir, 'checklists');
      const dashboardDir = path.join(componentsDir, 'dashboard');
      const sharedDir = path.join(componentsDir, 'shared');
      
      expect(fs.existsSync(uiDir)).toBe(true);
      expect(fs.existsSync(p4pDir)).toBe(true);
      expect(fs.existsSync(checklistsDir)).toBe(true);
      expect(fs.existsSync(dashboardDir)).toBe(true);
      expect(fs.existsSync(sharedDir)).toBe(true);
    });

    it('should have prisma directory', () => {
      const prismaDir = path.join(projectRoot, 'prisma');
      expect(fs.existsSync(prismaDir)).toBe(true);
    });

    it('should have jobs and workers directories', () => {
      const jobsDir = path.join(projectRoot, 'jobs');
      const workersDir = path.join(projectRoot, 'workers');
      expect(fs.existsSync(jobsDir)).toBe(true);
      expect(fs.existsSync(workersDir)).toBe(true);
    });
  });

  describe('AC-1.1.5: Environment Variables', () => {
    it('should have .env.example file', () => {
      const envExample = path.join(projectRoot, '.env.example');
      expect(fs.existsSync(envExample)).toBe(true);
    });

    it('should contain required environment variables in .env.example', () => {
      const envExample = path.join(projectRoot, '.env.example');
      const content = fs.readFileSync(envExample, 'utf-8');
      
      expect(content).toContain('DATABASE_URL');
      expect(content).toContain('REDIS_URL');
      expect(content).toContain('NEXTAUTH_SECRET');
      expect(content).toContain('NEXTAUTH_URL');
      expect(content).toContain('AWS_REGION');
      expect(content).toContain('OPENAI_API_KEY');
    });
  });
});


