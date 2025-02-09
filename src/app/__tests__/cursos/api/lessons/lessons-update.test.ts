/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { testApiHandler } from 'next-test-api-route-handler'
import { lessons } from '~/server/db/schema'
import { db } from '~/server/db'
import { eq } from 'drizzle-orm'
import * as appHandler from '../../../../cursos/api/lessons/[lessonId]/route'

describe('/api/lessons/[lessonId]', () => {
  let lessonId: number

  beforeEach(async () => {
    // Insert a lesson to update/delete
    const [lesson] = await db.insert(lessons).values({
      moduleId: 1, // adjust as needed
      title: 'Original Lesson',
      content: 'Original Content',
      videoUrl: 'http://example.com/original',
      description: 'Original Desc',
      order: 1,
      createdAt: new Date(),
    }).returning()
    if (!lesson) throw new Error('Failed to create lesson')
    lessonId = lesson.id
  })

  afterEach(async () => {
    await db.delete(lessons).where(eq(lessons.id, lessonId))
  })

  it('should update a lesson with valid fields (PUT)', async () => {
    await testApiHandler({
      params: { lessonId: lessonId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Updated Lesson',
            content: 'Updated Content',
            videoUrl: 'http://example.com/updated',
            description: 'Updated Desc',
            order: 2,
          })
        })
        expect(res.status).toBe(200)
        const updatedLesson = await res.json()
        expect(updatedLesson[0].title).toBe('Updated Lesson')
      }
    })
  })

  it('should return 404 for PUT if lesson not found', async () => {
    // Delete the lesson first
    await db.delete(lessons).where(eq(lessons.id, lessonId))
    await testApiHandler({
      params: { lessonId: lessonId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Should Not Update',
            content: 'No Content',
            videoUrl: '',
            description: 'No Desc',
            order: 1,
          })
        })
        expect(res.status).toBe(404)
      }
    })
  })

  it('should delete a lesson (DELETE)', async () => {
    await testApiHandler({
      params: { lessonId: lessonId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'DELETE' })
        expect(res.status).toBe(200)
        const result = await res.json()
        expect(result.message).toMatch(/deleted successfully/i)
      }
    })
  })
})
