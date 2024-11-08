/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/api/questoes/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { questionGroups, questions } from '~/server/db/schema';

interface QuestionCreate {
  question: string;
  answer: string;
  topics: string[];
}

interface CreateRequestBody {
  name: string;
  title: string;
  description: string;
  questions: QuestionCreate[];
}

export async function POST(request: Request) {
  try {
    const body: CreateRequestBody = await request.json();
    console.log('Received POST request with body:', body);

    // Validate required fields
    if (!body.name || !body.title) {
      return NextResponse.json(
        { error: 'Name and title are required' },
        { status: 400 }
      );
    }

    // Check if a question group with the same name already exists
    const existingGroup = await db.query.questionGroups.findFirst({
      where: (questionGroups, { eq }) => eq(questionGroups.name, body.name),
    });

    if (existingGroup) {
      return NextResponse.json(
        { error: 'A question group with this name already exists' },
        { status: 409 }
      );
    }

    // Use a transaction to ensure both the questionGroup and questions are created
    const result = await db.transaction(async (tx) => {
      // 1. Insert the new question group without specifying the ID
      // Let the database handle ID generation
      const [newQuestionGroup] = await tx
        .insert(questionGroups)
        .values({
          name: body.name,
          title: body.title,
          description: body.description,
          createdAt: new Date(),
        })
        .returning();

      console.log('Created question group:', newQuestionGroup);

      if (!newQuestionGroup?.id) {
        throw new Error('Failed to create question group');
      }

      // 2. Insert the questions if there are any
      if (body.questions && body.questions.length > 0) {
        // Let the database handle question IDs as well
        const questionsToInsert = body.questions.map((q) => ({
          questionGroupId: newQuestionGroup.id,
          question: q.question,
          answer: q.answer,
          topics: q.topics,
          createdAt: new Date(),
        }));

        console.log('Inserting questions:', questionsToInsert);

        const insertedQuestions = await tx
          .insert(questions)
          .values(questionsToInsert)
          .returning();

        console.log('Created questions:', insertedQuestions);
      }

      // 3. Fetch the complete created group with questions
      const createdGroup = await tx.query.questionGroups.findFirst({
        where: (questionGroups, { eq }) => eq(questionGroups.id, newQuestionGroup.id),
        with: {
          questions: true,
        },
      });

      return createdGroup;
    });

    if (!result) {
      throw new Error('Failed to create question group and questions');
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to create question group:', error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'A question group with this name already exists' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create question group' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allGroups = await db.query.questionGroups.findMany({
      with: {
        questions: true,
      },
    });
    return NextResponse.json(allGroups);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch question groups' },
      { status: 500 }
    );
  }
}