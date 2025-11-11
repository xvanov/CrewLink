import { PrismaClient, UserRole, ItemStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create sample users with different roles
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      passwordHash: 'hashed_password_here', // In production, use bcrypt
      role: UserRole.ADMIN,
      languagePreference: 'en',
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      name: 'Manager User',
      passwordHash: 'hashed_password_here',
      role: UserRole.MANAGER,
      languagePreference: 'en',
    },
  })

  const foreman = await prisma.user.upsert({
    where: { email: 'foreman@example.com' },
    update: {},
    create: {
      email: 'foreman@example.com',
      name: 'Foreman User',
      passwordHash: 'hashed_password_here',
      role: UserRole.FOREMAN,
      languagePreference: 'en',
    },
  })

  const crewMember = await prisma.user.upsert({
    where: { email: 'crew@example.com' },
    update: {},
    create: {
      email: 'crew@example.com',
      name: 'Crew Member',
      passwordHash: 'hashed_password_here',
      role: UserRole.CREW_MEMBER,
      languagePreference: 'en',
    },
  })

  const constructionManager = await prisma.user.upsert({
    where: { email: 'cm@example.com' },
    update: {},
    create: {
      email: 'cm@example.com',
      name: 'Construction Manager',
      passwordHash: 'hashed_password_here',
      role: UserRole.CONSTRUCTION_MANAGER,
      languagePreference: 'en',
    },
  })

  const fieldTechnician = await prisma.user.upsert({
    where: { email: 'ft@example.com' },
    update: {},
    create: {
      email: 'ft@example.com',
      name: 'Field Technician',
      passwordHash: 'hashed_password_here',
      role: UserRole.FIELD_TECHNICIAN,
      languagePreference: 'en',
    },
  })

  const projectCoordinator = await prisma.user.upsert({
    where: { email: 'pc@example.com' },
    update: {},
    create: {
      email: 'pc@example.com',
      name: 'Project Coordinator',
      passwordHash: 'hashed_password_here',
      role: UserRole.PROJECT_COORDINATOR,
      languagePreference: 'en',
    },
  })

  console.log('✅ Created users')

  // Create sample projects
  const project1 = await prisma.project.upsert({
    where: { id: 'project-1' },
    update: {},
    create: {
      id: 'project-1',
      name: 'Downtown Office Building',
      description: 'Construction of a new 10-story office building in downtown',
      status: 'active',
    },
  })

  const project2 = await prisma.project.upsert({
    where: { id: 'project-2' },
    update: {},
    create: {
      id: 'project-2',
      name: 'Residential Complex',
      description: 'Multi-unit residential complex development',
      status: 'active',
    },
  })

  console.log('✅ Created projects')

  // Create user-project assignments
  await prisma.userProjectAssignment.upsert({
    where: {
      userId_projectId: {
        userId: admin.id,
        projectId: project1.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      projectId: project1.id,
    },
  })

  await prisma.userProjectAssignment.upsert({
    where: {
      userId_projectId: {
        userId: manager.id,
        projectId: project1.id,
      },
    },
    update: {},
    create: {
      userId: manager.id,
      projectId: project1.id,
    },
  })

  await prisma.userProjectAssignment.upsert({
    where: {
      userId_projectId: {
        userId: foreman.id,
        projectId: project1.id,
      },
    },
    update: {},
    create: {
      userId: foreman.id,
      projectId: project1.id,
    },
  })

  await prisma.userProjectAssignment.upsert({
    where: {
      userId_projectId: {
        userId: crewMember.id,
        projectId: project1.id,
      },
    },
    update: {},
    create: {
      userId: crewMember.id,
      projectId: project1.id,
    },
  })

  await prisma.userProjectAssignment.upsert({
    where: {
      userId_projectId: {
        userId: constructionManager.id,
        projectId: project2.id,
      },
    },
    update: {},
    create: {
      userId: constructionManager.id,
      projectId: project2.id,
    },
  })

  console.log('✅ Created user-project assignments')

  // Create checklists
  const checklist1 = await prisma.checklist.create({
    data: {
      projectId: project1.id,
      name: 'Daily Safety Inspection',
      description: 'Daily safety checklist for construction site',
    },
  })

  const checklist2 = await prisma.checklist.create({
    data: {
      projectId: project1.id,
      name: 'Equipment Maintenance',
      description: 'Weekly equipment maintenance checklist',
    },
  })

  const checklist3 = await prisma.checklist.create({
    data: {
      projectId: project2.id,
      name: 'Site Preparation',
      description: 'Pre-construction site preparation checklist',
    },
  })

  console.log('✅ Created checklists')

  // Create checklist items
  await prisma.checklistItem.create({
    data: {
      checklistId: checklist1.id,
      description: 'Check all safety equipment is in place',
      status: ItemStatus.COMPLETED,
      assignedToId: foreman.id,
      completedAt: new Date(),
    },
  })

  await prisma.checklistItem.create({
    data: {
      checklistId: checklist1.id,
      description: 'Verify all workers have proper safety gear',
      status: ItemStatus.IN_PROGRESS,
      assignedToId: foreman.id,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    },
  })

  await prisma.checklistItem.create({
    data: {
      checklistId: checklist1.id,
      description: 'Inspect scaffolding for stability',
      status: ItemStatus.NOT_STARTED,
      assignedToId: crewMember.id,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    },
  })

  await prisma.checklistItem.create({
    data: {
      checklistId: checklist2.id,
      description: 'Inspect crane equipment',
      status: ItemStatus.NOT_STARTED,
      assignedToId: fieldTechnician.id,
    },
  })

  await prisma.checklistItem.create({
    data: {
      checklistId: checklist2.id,
      description: 'Check generator fuel levels',
      status: ItemStatus.COMPLETED,
      assignedToId: fieldTechnician.id,
      completedAt: new Date(),
    },
  })

  await prisma.checklistItem.create({
    data: {
      checklistId: checklist3.id,
      description: 'Clear construction site',
      status: ItemStatus.IN_PROGRESS,
      assignedToId: projectCoordinator.id,
    },
  })

  console.log('✅ Created checklist items')

  console.log('🎉 Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

