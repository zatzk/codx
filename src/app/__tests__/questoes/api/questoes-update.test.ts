/* eslint-disable drizzle/enforce-delete-with-where */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { testApiHandler } from 'next-test-api-route-handler'
import { questionGroups, questions } from '~/server/db/schema'
import { db } from '~/server/db'
import { eq, inArray } from 'drizzle-orm'
import * as appHandler from '../../../../app/questoes/api/[id]/route'

describe('/api/questoes/[id]', () => {
  let groupId: number

  beforeEach(async () => {
    // Create a question group with one question
    const [group] = await db.insert(questionGroups).values({
      name: 'GroupToUpdate',
      description: 'Initial Desc',
      createdAt: new Date(),
    }).returning()
    if (!group) throw new Error('Failed to create group')
    groupId = group.id

    await db.insert(questions).values({
      questionGroupId: groupId,
      question: 'Initial Question?',
      answer: 'Initial Answer',
      topics: ['topic'],
      createdAt: new Date(),
    })
  })

  afterEach(async () => {
    await db.delete(questions).where(eq(questions.questionGroupId, groupId))
    await db.delete(questionGroups).where(eq(questionGroups.id, groupId))
  })

  it('should delete a question group (DELETE)', async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'DELETE', url: `/api/questoes/${groupId}` })
        expect(res.status).toBe(200)
        const result = await res.json()
        expect(result.success).toBe(true)
      }
    })
  })

  it('should update a question group (PUT)', async () => {
    const updateBody: {
      name: string;
      description: string;
      questions: Array<{
        id: number;
        question: string;
        answer: string;
        topics: string[];
      }>;
    } = {
      name: 'Updated Group',
      description: 'Updated Desc',
      questions: []
    }
    // Retrieve the inserted question id:
    const existingQuestions = await db.select().from(questions).where(eq(questions.questionGroupId, groupId))
    if (!existingQuestions.length) throw new Error('No questions found')
    const firstQuestion = existingQuestions[0]
    if (!firstQuestion) throw new Error('First question is undefined')
    updateBody.questions.push({
      id: firstQuestion.id,
      question: 'Updated Question?',
      answer: 'Updated Answer',
      topics: ['newtopic']
    })
    await testApiHandler({
      params: { id: groupId.toString() },
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateBody)
        })
        expect(res.status).toBe(200)
        const updatedGroup = await res.json()
        expect(updatedGroup.name).toBe('Updated_Group')
        expect(Array.isArray(updatedGroup.questions)).toBe(true)
        expect(updatedGroup.questions[0].question).toBe('Updated Question?')
      }
    })
  })

  it('should GET a question group by name (GET)', async () => {
    // The GET handler expects the group name (without spaces) as the last part of the URL.
    const groupName = 'GroupToUpdate'
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET', url: `/api/questoes/${groupName}` })
        expect(res.status).toBe(200)
        const result = await res.json()
        expect(Array.isArray(result)).toBe(true)
      }
    })
  })
})
