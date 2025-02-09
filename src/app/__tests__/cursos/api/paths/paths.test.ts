/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable drizzle/enforce-delete-with-where */
import { testApiHandler } from 'next-test-api-route-handler'
import { paths } from '~/server/db/schema'
import { db } from '~/server/db'
import * as appHandler from '../../../../cursos/api/paths/route'

describe('/api/cursos/paths', () => {
  // If your db driver has an explicit disconnect method, you could use afterAll(() => db.end()) here.
  
  afterEach(async () => {
    // Clean up test data by deleting all entries from the "paths" table.
    await db.delete(paths)
  })

  it('should create a new path and then retrieve it', async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const postResponse = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Test Path',
            description: 'Test Description'
          })
        })

        expect(postResponse.status).toBe(200)
        const postData = await postResponse.json()
        expect(Array.isArray(postData)).toBe(true)
        expect(postData[0]).toHaveProperty('id')
        expect(postData[0].title).toBe('Test Path')

        const getResponse = await fetch({ method: 'GET' })
        expect(getResponse.status).toBe(200)
        const getData = await getResponse.json()
        expect(Array.isArray(getData)).toBe(true)
        expect(getData.length).toBe(3)
        expect(getData[0].title).toBe('Test Path')
      }
    })
  })

  it('should return validation error for missing required fields', async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}) 
        })

        expect(response.status).toBe(400)
        const errorData = await response.json()
        expect(errorData.error).toMatch(/required/i)
      }
    })
  })
})
