/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/questoes/api/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { eq, inArray } from 'drizzle-orm';
import { desafios, testCases } from '~/server/db/schema';


interface TestCasesUpdate {
  id?: number;
  input: string;
  target: string;
  expectedOutput: string;
}

interface UpdateRequestBody {
  title: string;
  problemStatement: string;
  starterCode: string;
  functionName: string;
  difficulty: string;
  category: string;
  testCases: TestCasesUpdate[];
  testCasesToDelete?: number[];
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const desafioId = parseInt(url.pathname.split('/').pop() ?? '', 10);

    if (isNaN(desafioId)) {
      return NextResponse.json(
        { error: 'Invalid desafio ID' },
        { status: 400 }
      );
    }

    await db.transaction(async (tx) => {
      // First delete all related test cases
      await tx
        .delete(testCases)
        .where(eq(testCases.desafioId, desafioId));

      // Then delete the desafio
      await tx
        .delete(desafios)
        .where(eq(desafios.id, desafioId));
    })

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete desafio:', error);
    return NextResponse.json(
      { error: 'Failed to delete desafio' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const desafioId = parseInt(url.pathname.split('/').pop() ?? '', 10);

    if (isNaN(desafioId)) {
      return NextResponse.json(
        { error: 'Invalid desafio ID' },
        { status: 400 }
      );
    }

    const body: UpdateRequestBody = await request.json();
    console.log('Received PUT request with body:', body);

    const result = await db.transaction(async (tx) => {
      // 1. Delete test cases if any are marked for deletion
      if (body.testCasesToDelete && body.testCasesToDelete.length > 0) {
        console.log('Deleting test cases:', body.testCasesToDelete);
        await tx
          .delete(testCases)
          .where(inArray(testCases.id, body.testCasesToDelete));
      }

      // 2. Update the desafio
      console.log('Updating desafio:', desafioId);
      await tx
        .update(desafios)
        .set({
          title: body.title,
          problemStatement: body.problemStatement,
          starterCode: body.starterCode,
          functionName: body.functionName,
          difficulty: body.difficulty,
          category: body.category,
          updatedAt: new Date(),
        })
        .where(eq(desafios.id, desafioId));

      for (const tesCaseData of body.testCases) {
        if (tesCaseData.id) {
          console.log('Updating test case:', tesCaseData.id);
          await tx
            .update(testCases)
            .set({
              input: tesCaseData.input,
              target: tesCaseData.target,
              expectedOutput: tesCaseData.expectedOutput,
              updatedAt: new Date(),
            })
            .where(eq(testCases.id, tesCaseData.id));
        } else {
          console.log('Creating new test case:');
          await tx
            .insert(testCases)
            .values({
              input: tesCaseData.input,
              target: tesCaseData.target,
              expectedOutput: tesCaseData.expectedOutput,
              desafioId: desafioId,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
        }
      }

      const updatedDesafio = await tx.query.desafios.findFirst({
        where: eq(desafios.id, desafioId),
        with: {
          testCases: true,
        },
      });

      return updatedDesafio;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to update desafio:', error);
    return NextResponse.json(
      { error: 'Failed to update desafio' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  console.log('Received request for ID:', request);
  const url = new URL(request.url);
  const replaceDashes = url.pathname.split('/').pop();
  const name = replaceDashes?.replace(/-/g, ' ');

  console.log('Name:', name);
  try {
    const res = await db.query.desafios.findMany({
      where: eq(desafios.title, name ?? ''),
      with: {
        testCases: true
      }
    });
    return NextResponse.json(res);
  } catch (error) {
    console.error('Failed to fetch desafios:', error);
    return NextResponse.json({ error: 'Failed to fetch desafios' }, { status: 500 });
  }
}
