/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/questoes/api/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { eq, inArray } from 'drizzle-orm';
import { questionGroups, questions } from '~/server/db/schema';

interface QuestionUpdate {
  id?: number;
  question: string;
  answer: string;
  topics: string[];
}

interface UpdateRequestBody {
  name: string;
  title: string;
  description: string;
  questions: QuestionUpdate[];
  questionsToDelete?: number[];
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const groupId = parseInt(url.pathname.split('/').pop() ?? '', 10);
    
    if (isNaN(groupId)) {
      return NextResponse.json(
        { error: 'Invalid question group ID' },
        { status: 400 }
      );
    }

    await db.transaction(async (tx) => {
      // First delete all related questions
      await tx
        .delete(questions)
        .where(eq(questions.questionGroupId, groupId));

      // Then delete the question group
      await tx
        .delete(questionGroups)
        .where(eq(questionGroups.id, groupId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete question group:', error);
    return NextResponse.json(
      { error: 'Failed to delete question group' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const groupId = parseInt(url.pathname.split('/').pop() ?? '', 10);
    
    if (isNaN(groupId)) {
      return NextResponse.json(
        { error: 'Invalid question group ID' },
        { status: 400 }
      );
    }

    const body: UpdateRequestBody = await request.json();
    console.log('Received PUT request with body:', body);

    const result = await db.transaction(async (tx) => {
      // 1. Delete questions if any are marked for deletion
      if (body.questionsToDelete && body.questionsToDelete.length > 0) {
        console.log('Deleting questions:', body.questionsToDelete);
        await tx
          .delete(questions)
          .where(inArray(questions.id, body.questionsToDelete));
      }

      // 2. Update the question group
      await tx
        .update(questionGroups)
        .set({
          name: body.name,
          title: body.title,
          description: body.description,
          updatedAt: new Date(),
        })
        .where(eq(questionGroups.id, groupId));

      // 3. Handle questions updates and insertions
      for (const questionData of body.questions) {
        if (questionData.id) {
          // Update existing question
          await tx
            .update(questions)
            .set({
              question: questionData.question,
              answer: questionData.answer,
              topics: questionData.topics,
              updatedAt: new Date(),
            })
            .where(eq(questions.id, questionData.id));
        } else {
          // Insert new question
          await tx.insert(questions).values({
            questionGroupId: groupId,
            question: questionData.question,
            answer: questionData.answer,
            topics: questionData.topics,
            createdAt: new Date(),
          });
        }
      }

      // 4. Fetch updated data
      const updatedGroup = await tx.query.questionGroups.findFirst({
        where: eq(questionGroups.id, groupId),
        with: {
          questions: true,
        },
      });

      return updatedGroup;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to update question group:', error);
    return NextResponse.json(
      { error: 'Failed to update question group' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  console.log('Received request for ID:', request);
  const url = new URL(request.url);
  const name = url.pathname.split('/').pop();


  try {
    const res = await db.query.questionGroups.findMany({
      where: eq(questionGroups.name, name ?? ''),
      with: {
        questions: true
      }
    });
    return NextResponse.json(res); 
  } catch (error) {
    console.error('Failed to fetch questionGroup:', error);
    return NextResponse.json({ error: 'Failed to fetch questionGroup' }, { status: 500 });
  }
}
