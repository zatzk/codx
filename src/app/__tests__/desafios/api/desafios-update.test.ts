/* eslint-disable drizzle/enforce-delete-with-where */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { testApiHandler } from 'next-test-api-route-handler'
import { desafios, testCases } from '~/server/db/schema'
import { db } from '~/server/db'
import * as appHandler from '../../../../app/desafios/api/[id]/route'
import { eq } from 'drizzle-orm'

describe('/api/desafios/[id]', () => {
  let desafioId: number

  beforeEach(async () => {
    // Create a desafio with a test case
    const [desafio] = await db.insert(desafios).values({
      title: 'Update Desafio',
      problemStatement: 'Initial problem',
      starterCode: 'initial code',
      functionName: 'initFunc',
      difficulty: 'hard',
      category: 'algorithms',
      createdAt: new Date(),
    }).returning()
    if (!desafio) throw new Error('Failed to create desafio')
    desafioId = desafio.id

    // Insert a test case for the desafio
    await db.insert(testCases).values({
      input: '1,2',
      target: '3',
      expectedOutput: '3',
      desafioId: desafio.id,
      createdAt: new Date(),
    })
  })

  afterEach(async () => {
    await db.delete(testCases).where(eq(testCases.desafioId, desafioId));
    await db.delete(desafios).where(eq(desafios.id, desafioId));
  })

  it('should delete a desafio (DELETE)', async () => {
    await testApiHandler({
      appHandler,
      params: { 
        desafioId: desafioId.toString() 
      },
      test: async ({ fetch }) => {
        const res = await fetch({ 
          method: 'DELETE'
        })
        expect(res.status).toBe(200)
        const result = await res.json()
        expect(result.success).toBe(true)
      }
    })
  })

  it('should update a desafio with test case updates (PUT)', async () => {
    const updateBody = {
      title: 'Updated Desafio',
      problemStatement: 'Updated problem',
      starterCode: 'updated code',
      functionName: 'updatedFunc',
      difficulty: 'medium',
      category: 'math',
      testCases: [
        // Assuming we update the existing test case; you may add new ones as needed.
        { id: 1, input: '2,3', target: '5', expectedOutput: '5' }
      ]
    }
    await testApiHandler({
      appHandler,
      url: `/api/desafios/${desafioId}`,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateBody)
        })
        expect(res.status).toBe(200)
        const updatedDesafio = await res.json()
        expect(updatedDesafio.title).toBe('Updated Desafio')
        expect(Array.isArray(updatedDesafio.testCases)).toBe(true)
      }
    })
  })

  it('should GET desafio by name (GET)', async () => {
    // The GET handler here expects the desafio title (with dashes replaced by spaces) as the last part of the URL.
    const groupName = 'Update Desafio'.replace(/\s/g, '-')
    await testApiHandler({
      appHandler,
      url: `/api/desafios/${groupName}`,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' })
        expect(res.status).toBe(200)
        const result = await res.json()
        expect(Array.isArray(result)).toBe(true)
      }
    })
  })
})
