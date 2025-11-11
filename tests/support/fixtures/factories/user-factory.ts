/**
 * User Factory - Data Factory Pattern
 * 
 * This factory follows TEA best practices:
 * - Faker-based dynamic data generation (parallel-safe)
 * - Override pattern for explicit test intent
 * - API seeding for fast test setup
 * - Auto-cleanup to prevent test pollution
 * 
 * Reference: .bmad/bmm/testarch/knowledge/data-factories.md
 */

import { faker } from '@faker-js/faker';

export type User = {
  id?: string;
  email: string;
  name: string;
  password: string;
  role?: 'admin' | 'manager' | 'foreman' | 'worker';
  createdAt?: Date;
  isActive?: boolean;
};

export class UserFactory {
  private createdUsers: string[] = [];

  /**
   * Create a user object with sensible defaults
   * Override any field to show explicit test intent
   */
  createUser(overrides: Partial<User> = {}): User {
    return {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password({ length: 12 }),
      role: 'worker',
      isActive: true,
      ...overrides,
    };
  }

  /**
   * Create and seed a user via API
   * Returns the created user with server-assigned ID
   */
  async seedUser(overrides: Partial<User> = {}): Promise<User> {
    const user = this.createUser(overrides);

    // API call to create user
    const apiUrl = process.env.API_URL || process.env.BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.status} ${await response.text()}`);
    }

    const created = await response.json();
    if (created.id) {
      this.createdUsers.push(created.id);
    }
    return created;
  }

  /**
   * Cleanup all users created during test execution
   * Called automatically by fixture teardown
   */
  async cleanup(): Promise<void> {
    const apiUrl = process.env.API_URL || process.env.BASE_URL || 'http://localhost:3000';
    
    // Delete all created users
    for (const userId of this.createdUsers) {
      try {
        await fetch(`${apiUrl}/api/users/${userId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        // Log but don't fail cleanup
        console.warn(`Failed to cleanup user ${userId}:`, error);
      }
    }
    this.createdUsers = [];
  }
}

