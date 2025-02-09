/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// tests/api/courses/path-courses.test.ts
import { testApiHandler } from 'next-test-api-route-handler'
import { courses, pathCourses, paths } from '~/server/db/schema'
import { db } from '~/server/db'
import { eq } from 'drizzle-orm'
import * as appHandler from '../../../../cursos/api/courses/by-path/[pathId]/route'

describe('/api/courses/[pathId] route', () => {
  let testPathId: number
  let testCourseId: number

  beforeEach(async () => {
    // Create a test path and course link context
    // (Assuming you have a paths table and you can insert into it)
    const [path] = await db.insert(paths).values({
      title: 'Test Path',
      description: 'Test Path Description'
    }).returning()
    if (!path) throw new Error('Failed to create test path')
    testPathId = path.id
  })

  afterEach(async () => {
    // Clean up both courses and pathCourses; also delete test path
    if (testCourseId) {
      await db.delete(courses).where(eq(courses.id, testCourseId))
      await db.delete(pathCourses).where(eq(pathCourses.courseId, testCourseId))
    }
    await db.delete(paths).where(eq(paths.id, testPathId))
  })

  it('should create a new course and link it to the path (POST)', async () => {
    await testApiHandler({
      params: { pathId: testPathId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'New Course',
            description: 'New Course Description'
          })
        })
        expect(response.status).toBe(200)
        const newCourse = await response.json()
        expect(newCourse.title).toBe('New Course')
        testCourseId = newCourse.id // store for cleanup
      }
    })
  })

  it('should fetch courses for the given path (GET)', async () => {
    // First, create a course linked to the path
    const [course] = await db.insert(courses).values({
      title: 'Linked Course',
      description: 'Course linked to path',
      createdAt: new Date(),
    }).returning()
    if (!course) throw new Error('Failed to create course')
    testCourseId = course.id
    await db.insert(pathCourses).values({
      pathId: testPathId,
      courseId: course.id,
      order: 0,
    })
    
    await testApiHandler({
      params: { pathId: testPathId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' })
        expect(response.status).toBe(200)
        const coursesList = await response.json()
        expect(Array.isArray(coursesList)).toBe(true)
        expect(coursesList.length).toBeGreaterThanOrEqual(1)
        expect(coursesList[0].title).toBe('Linked Course')
      }
    })
  })
})
