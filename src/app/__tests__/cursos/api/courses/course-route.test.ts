/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// tests/api/courses/course-route.test.ts
import { testApiHandler } from 'next-test-api-route-handler'
import { courses } from '~/server/db/schema'
import { db } from '~/server/db'
import { eq } from 'drizzle-orm'
import * as appHandler from '../../../../cursos/api/courses/[courseId]/route'

describe('/api/courses/[courseId] route', () => {
  let courseId: number

  beforeEach(async () => {
    // Create a course to update/delete
    const [course] = await db.insert(courses).values({
      title: 'Original Course',
      description: 'Original Description',
      createdAt: new Date(),
    }).returning()
    if (!course) throw new Error('Failed to create course')
    courseId = course.id
  })

  afterEach(async () => {
    // Clean up the created course
    await db.delete(courses).where(eq(courses.id, courseId))
  })

  it('should update a course', async () => {
    await testApiHandler({
      params: { courseId: courseId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Updated Course',
            description: 'Updated Description'
          })
        })
        expect(response.status).toBe(200)
        const data = await response.json()
        expect(data[0].title).toBe('Updated Course')
      }
    })
  })

  it('should delete a course', async () => {
    await testApiHandler({
      params: { courseId: courseId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const deleteResponse = await fetch({ method: 'DELETE' })
        expect(deleteResponse.status).toBe(200)
        const result = await deleteResponse.json()
        expect(result.message).toMatch(/deleted successfully/i)
        // Optionally, verify that the course no longer exists
        const [course] = await db.select().from(courses).where(eq(courses.id, courseId))
        expect(course).toBeUndefined()
      }
    })
  })
})
