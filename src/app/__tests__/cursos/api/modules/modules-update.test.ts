/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// tests/api/modules/module-route.test.ts
import { testApiHandler } from 'next-test-api-route-handler'
import { courseModules } from '~/server/db/schema'
import { db } from '~/server/db'
import { eq } from 'drizzle-orm'
import * as appHandler from '../../../../cursos/api/modules/[moduleId]/route'

describe('/api/modules/[moduleId] route', () => {
  let moduleId: number

  beforeEach(async () => {
    const [module] = await db.insert(courseModules).values({
      title: 'Original Module',
      description: 'Original Module Description',
      courseId: 1, // assuming a valid course id exists
      order: 1,
      createdAt: new Date(),
    }).returning()
    if (!module) throw new Error('Failed to create module')
    moduleId = module.id
  })

  afterEach(async () => {
    await db.delete(courseModules).where(eq(courseModules.id, moduleId))
  })

  it('should update a module', async () => {
    await testApiHandler({
      params: { moduleId: moduleId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Updated Module',
            description: 'Updated Description',
            order: 2,
          })
        })
        expect(response.status).toBe(200)
        const updatedModule = await response.json()
        expect(updatedModule[0].title).toBe('Updated Module')
      }
    })
  })

  it('should delete a module', async () => {
    await testApiHandler({
      params: { moduleId: moduleId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'DELETE' })
        expect(response.status).toBe(200)
        const result = await response.json()
        expect(result.message).toMatch(/deleted successfully/i)
      }
    })
  })
})
