/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { testApiHandler } from 'next-test-api-route-handler'
import { paths } from '~/server/db/schema'
import { db } from '~/server/db'
import { eq } from 'drizzle-orm'
import * as appHandler from '../../../../cursos/api/paths/[pathId]/route'

describe('/api/cursos/paths/[pathId]', () => {
  let testPathId: number

  beforeEach(async () => {
    const [path] = await db.insert(paths).values({
      title: 'Test Path',
      description: 'Test Description'
    }).returning()
    if (!path) throw new Error('Failed to create test path')
    testPathId = path.id
  })

  afterEach(async () => {
    await db.delete(paths).where(eq(paths.id, testPathId))
  })

  it('should update a path successfully', async () => {
    await testApiHandler({
      params: { pathId: testPathId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const updateResponse = await fetch({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Updated Path',
            description: 'Updated Description'
          })
        })
        expect(updateResponse.status).toBe(200)
        const updateData = await updateResponse.json()
        expect(Array.isArray(updateData)).toBe(true)
        expect(updateData[0].title).toBe('Updated Path')

      const [updatedPath] = await db.select()
        .from(paths)
        .where(eq(paths.id, testPathId))
      
      if (!updatedPath) {
        throw new Error('Updated path not found in database')
      }
        expect(updatedPath.title).toBe('Updated Path')
      }
    })
  })

  it('should delete a path and return 404 on subsequent GET', async () => {
    await testApiHandler({
      params: { pathId: testPathId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const deleteResponse = await fetch({ method: 'DELETE' })
        expect(deleteResponse.status).toBe(200)
        const deleteData = await deleteResponse.json()
        expect(deleteData).toHaveProperty('message')

        const getResponse = await fetch({ method: 'GET' })
        expect(getResponse.status).toBe(404)
      }
    })
  })

  it('should return 404 when updating a non-existent path', async () => {
    await db.delete(paths).where(eq(paths.id, testPathId))
    await testApiHandler({
      params: { pathId: testPathId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Should Not Update',
            description: 'Non-existent path'
          })
        })
        expect(response.status).toBe(404)
      }
    })
  })
})
