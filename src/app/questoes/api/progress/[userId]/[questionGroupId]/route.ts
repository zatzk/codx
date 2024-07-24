/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// app/questoes/api/progress/[userId]/[questionGroupId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { eq, and } from 'drizzle-orm';
import { questionUserProgress } from '~/server/db/schema';

export async function GET(request: Request, { params }: { params: { userId: string; questionGroupId: number } }) {
  const { userId, questionGroupId } = params;
  try {
    const res = await db.select()
      .from(questionUserProgress)
      .where(
        and(
          eq(questionUserProgress.userId, userId),
          eq(questionUserProgress.questionGroupId, questionGroupId)
        )
      )
      .limit(1);
    return NextResponse.json(res);
  } catch (error) {
    console.error('Failed to fetch user progress:', error);
    return NextResponse.json({ error: 'Failed to fetch user progress' }, { status: 500 });
  }
}
export async function POST(request: Request, { params }: { params: { userId: string; questionGroupId: number } }) {
  const { userId, questionGroupId } = params;
  const { currentQuestionIndex, currentKnowCount, currentDidntKnowCount, currentSkipCount  } = await request.json();
  try {
    await db
      .insert(questionUserProgress)
      .values({
        userId,
        questionGroupId,
        currentQuestionIndex,
        currentKnowCount,
        currentDidntKnowCount,
        currentSkipCount,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          questionUserProgress.userId,
          questionUserProgress.questionGroupId
        ],
        set: { 
          currentQuestionIndex, 
          currentKnowCount, 
          currentDidntKnowCount, 
          currentSkipCount,
          updatedAt: new Date() 
        },
      });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update user progress:', error);
    return NextResponse.json({ error: 'Failed to update user progress' }, { status: 500 });
  }
}