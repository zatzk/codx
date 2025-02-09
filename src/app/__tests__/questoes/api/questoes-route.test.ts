/* eslint-disable drizzle/enforce-delete-with-where */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { testApiHandler } from 'next-test-api-route-handler'
import { questionGroups, questions } from '~/server/db/schema'
import { db } from '~/server/db'
import * as appHandler from '../../../questoes/api/route'

describe('/api/questoes', () => {
  afterEach(async () => {
    await db.delete(questions)
    await db.delete(questionGroups)
  })

  it('should return 400 for POST if name is missing', async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: 'Some description',
            questions: []
          })
        })
        expect(res.status).toBe(400)
      }
    })
  })

  it('should create a new question group with questions (POST)', async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Unique Group',
            description: 'Group Desc',
            questions: [
              { question: 'Q1?', answer: 'A1', topics: ['topic1'] },
              { question: 'Q2?', answer: 'A2', topics: ['topic2'] },
            ]
          })
        })
        expect(res.status).toBe(200)
        const group = await res.json()
        expect(group.name).toBe('Unique_Group') // spaces replaced by underscores
        expect(Array.isArray(group.questions)).toBe(true)
        expect(group.questions.length).toBe(2)
      }
    })
  })

  it('should GET all question groups with questions', async () => {
    // Pre-insert a group
    await db.insert(questionGroups).values({
      name: 'TestGroup',
      description: 'Desc',
      createdAt: new Date(),
    })
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' })
        expect(res.status).toBe(200)
        const groups = await res.json()
        expect(Array.isArray(groups)).toBe(true)
      }
    })
  })
})
