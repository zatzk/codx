/* eslint-disable drizzle/enforce-delete-with-where */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { testApiHandler } from 'next-test-api-route-handler'
import { desafios, testCases } from '~/server/db/schema'
import { db } from '~/server/db'
import * as appHandler from '../../../../app/desafios/api/route'

describe('/api/desafios', () => {
  afterEach(async () => {
    // Clean up: delete all desafios and associated test cases
    await db.delete(testCases)
    await db.delete(desafios)
  })

  it('should return 400 for POST if title is missing', async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            problemStatement: 'Some problem',
            starterCode: 'function foo() {}',
            functionName: 'foo',
            difficulty: 'easy',
            category: 'algorithms',
            testCases: [],
          })
        })
        expect(res.status).toBe(400)
      }
    })
  })

  it('should create a new desafio with test cases (POST)', async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Unique Desafio',
            problemStatement: 'Solve this problem',
            starterCode: 'function solve() {}',
            functionName: 'solve',
            difficulty: 'medium',
            category: 'math',
            testCases: [
              { input: '1,2', target: '3', expectedOutput: '3' },
              { input: '2,3', target: '5', expectedOutput: '5' }
            ]
          })
        })
        expect(res.status).toBe(200)
        const result = await res.json()
        expect(result).toHaveProperty('id')
      }
    })
  })

  it('should GET all desafios', async () => {
    // Pre-insert a desafio
    await db.insert(desafios).values({
      title: 'Desafio1',
      problemStatement: 'Problem',
      starterCode: 'code',
      functionName: 'func',
      difficulty: 'easy',
      category: 'algorithms',
      createdAt: new Date(),
    })
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' })
        expect(res.status).toBe(200)
        const desafiosList = await res.json()
        expect(Array.isArray(desafiosList)).toBe(true)
      }
    })
  })
})
