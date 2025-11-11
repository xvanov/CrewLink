import { prisma } from '../prisma'
import { UserRole, ItemStatus } from '@prisma/client'

describe('Prisma Client', () => {
  it('should export prisma client instance', () => {
    expect(prisma).toBeDefined()
    expect(prisma.user).toBeDefined()
    expect(prisma.project).toBeDefined()
    expect(prisma.checklist).toBeDefined()
    expect(prisma.checklistItem).toBeDefined()
    expect(prisma.userProjectAssignment).toBeDefined()
  })

  it('should have correct UserRole enum values', () => {
    expect(UserRole.ADMIN).toBe('ADMIN')
    expect(UserRole.MANAGER).toBe('MANAGER')
    expect(UserRole.FOREMAN).toBe('FOREMAN')
    expect(UserRole.CREW_MEMBER).toBe('CREW_MEMBER')
    expect(UserRole.CONSTRUCTION_MANAGER).toBe('CONSTRUCTION_MANAGER')
    expect(UserRole.FIELD_TECHNICIAN).toBe('FIELD_TECHNICIAN')
    expect(UserRole.PROJECT_COORDINATOR).toBe('PROJECT_COORDINATOR')
  })

  it('should have correct ItemStatus enum values', () => {
    expect(ItemStatus.NOT_STARTED).toBe('NOT_STARTED')
    expect(ItemStatus.IN_PROGRESS).toBe('IN_PROGRESS')
    expect(ItemStatus.COMPLETED).toBe('COMPLETED')
  })
})


