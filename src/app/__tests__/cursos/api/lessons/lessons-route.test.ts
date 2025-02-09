/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { testApiHandler } from 'next-test-api-route-handler'
import { courseModules, lessons } from '~/server/db/schema'
import { db } from '~/server/db'
import { eq } from 'drizzle-orm'
import * as appHandler from '../../../../cursos/api/lessons/by-module/[moduleId]/route'

describe('/api/lessons/[moduleId]', () => {
  let moduleId: number

  beforeEach(async () => {
    // Create a module (with no lessons initially)
    const [module] = await db.insert(courseModules).values({
      title: 'Module for Lessons',
      description: 'Module Desc',
      courseId: 1, // Adjust as needed
      order: 1,
      createdAt: new Date(),
    }).returning()
    if (!module) throw new Error('Failed to create module')
    moduleId = module.id
  })

  afterEach(async () => {
    // Clean up: delete lessons and module
    await db.delete(lessons).where(eq(lessons.moduleId, moduleId))
    await db.delete(courseModules).where(eq(courseModules.id, moduleId))
  })

  it('should return 404 for GET if module not found', async () => {
    await testApiHandler({
      params: { moduleId: '999999' },
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' })
        expect(res.status).toBe(404)
      }
    })
  })

  it('should GET module with lessons (even if lessons array is empty)', async () => {
    await testApiHandler({
      params: { moduleId: moduleId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' })
        expect(res.status).toBe(200)
        const moduleData = await res.json()
        expect(moduleData).toHaveProperty('id', moduleId)
        expect(Array.isArray(moduleData.lessons)).toBe(true)
      }
    })
  })

  it('should create a new lesson (POST) and handle order conflicts', async () => {
    // Insert a lesson with order 1 to force order adjustment
    await db.insert(lessons).values({
      moduleId,
      title: 'Existing Lesson',
      content: 'Existing Content',
      videoUrl: null,
      description: 'Existing Desc',
      order: 1,
      createdAt: new Date(),
    })
    await testApiHandler({
      params: { moduleId: moduleId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'New Lesson',
            content: 'New Content',
            videoUrl: 'http://example.com/video',
            description: 'New Desc',
            order: 1, // same order as an existing lesson
          })
        })
        expect(res.status).toBe(200)
        const newLesson = await res.json()
        expect(newLesson.title).toBe('New Lesson')
      }
    })
  })
})
