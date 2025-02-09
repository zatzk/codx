/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/desafios/api/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { desafios, testCases } from '~/server/db/schema';

interface TestCasesCreate {
  input: string;
  target: string;
  expectedOutput: string;
}

interface CreateRequestBody {
  title: string;
  problemStatement: string;
  starterCode: string;
  functionName: string;
  difficulty: string;
  category: string;  
  testCases: TestCasesCreate[];
}

export async function POST(request: Request) {
  try {
    const body: CreateRequestBody = await request.json();
    console.log('Received POST request with body:', body);

    if (!body.title) {
      return NextResponse.json(
        { error: 'Name and title are required' },
        { status: 400 }
      );
  }

    const existingDesafio = await db.query.desafios.findFirst({
      where: (desafios, { eq }) => eq(desafios.title, body.title),
    });

    if (existingDesafio) {
      return NextResponse.json(
        { error: 'A desafio with this title already exists' },
        { status: 409 }
      );
    }

    const result = await db.transaction(async (tx) => {
      const [newDesafio] = await tx
        .insert(desafios)
        .values({
          title: body.title,
          problemStatement: body.problemStatement,
          starterCode: body.starterCode,
          functionName: body.functionName,
          difficulty: body.difficulty,
          category: body.category,
          createdAt: new Date(),
        })
        .returning();

      console.log('Created desafio:', newDesafio);

      if (!newDesafio?.id) {
        throw new Error('Failed to create desafio');
      }

      if (body.testCases && body.testCases.length > 0) {
        const testCasesInsert = body.testCases.map((testCase) => ({
          input: testCase.input,
          target: testCase.target,
          expectedOutput: testCase.expectedOutput,
          desafioId: newDesafio.id,
          createdAt: new Date(),
        }));

        console.log('Inserting test cases:', testCasesInsert);

        const insertedTestCases = await tx
          .insert(testCases)
          .values(testCasesInsert)
          .returning();

        console.log('Inserted test cases:', insertedTestCases);
      }

      const createdDesafio = await db.query.desafios.findFirst({
        where: (desafios, { eq }) => eq(desafios.id, newDesafio.id),
        with: {
          testCases: true,
        },
      });

      return createdDesafio;
    });

    if (!result) {
      throw new Error('Failed to create desafio and test cases');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to create desafio:', error);

    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'A desafio with this name already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ error: 'Failed to create desafio' }, { status: 500 });
  }



}

export async function GET() {
  try {
    const res = await db.query.desafios.findMany({
    });
    return NextResponse.json(res); 
  } catch (error) {
    console.error('Failed to fetch desafios:', error);
    return NextResponse.json({ error: 'Failed to fetch desafios' }, { status: 500 });
  }
}
