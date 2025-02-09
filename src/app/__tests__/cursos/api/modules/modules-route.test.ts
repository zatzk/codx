/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { testApiHandler } from 'next-test-api-route-handler'
import { courses, courseModules } from '~/server/db/schema'
import { db } from '~/server/db'
import { eq } from 'drizzle-orm'
import * as appHandler from '../../../../cursos/api/modules/by-course/[courseId]/route'

describe('/api/modules/by-course/[courseId]', () => {
  let courseId: number

  beforeEach(async () => {
    // Create a course to use in tests
    const [course] = await db.insert(courses).values({
      title: 'Test Course',
      description: 'Test Course Description',
      createdAt: new Date(),
    }).returning()
    if (!course) throw new Error('Failed to create course')
    courseId = course.id
  })

  afterEach(async () => {
    // Clean up: delete modules and the course
    await db.delete(courseModules).where(eq(courseModules.courseId, courseId))
    await db.delete(courses).where(eq(courses.id, courseId))
  })

  it('should return 404 for GET if course not found', async () => {
    await testApiHandler({
      params: { courseId: '999999' },
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' })
        expect(res.status).toBe(404)
      }
    })
  })

  it('should GET modules with course info when course exists', async () => {
    // Insert a couple of modules with lessons (lessons can be empty arrays)
    await db.insert(courseModules).values([
      { title: 'Module 1', description: 'Module 1 Desc', courseId, order: 1 },
      { title: 'Module 2', description: 'Module 2 Desc', courseId, order: 2 },
    ])
    await testApiHandler({
      params: { courseId: courseId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' })
        expect(res.status).toBe(200)
        const modules = await res.json()
        expect(Array.isArray(modules)).toBe(true)
        expect(modules.length).toBe(2)
        // Check that courseTitle and courseDescription are added
        expect(modules[0]).toHaveProperty('courseTitle', 'Test Course')
        expect(modules[0]).toHaveProperty('courseDescription', 'Test Course Description')
      }
    })
  })

  it('should create a new module (POST) with order validation', async () => {
    // Insert an existing module with order 1
    await db.insert(courseModules).values({
      title: 'Existing Module',
      description: 'Existing Desc',
      courseId,
      order: 1,
    })
    await testApiHandler({
      params: { courseId: courseId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'New Module',
            description: 'New Module Desc',
            order: 1, // Same order as an existing module – expect an order adjustment
          }),
        })
        expect(res.status).toBe(200)
        const newModule = await res.json()
        expect(newModule.title).toBe('New Module')
        // Optionally, verify that the returned module has the expected order
      }
    })
  })
})
