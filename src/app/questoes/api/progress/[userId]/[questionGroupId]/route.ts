/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// app/questoes/api/progress/[userId]/[questionGroupId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { eq, and } from 'drizzle-orm';
import { questionUserProgress, questionGroups } from '~/server/db/schema';

export async function GET(
  request: Request,
  { params }: { params: { userId: string; questionGroupId: number } }
) {
  const { userId, questionGroupId } = params;
  try {
    const progress = await db
      .select()
      .from(questionUserProgress)
      .where(
        and(
          eq(questionUserProgress.userId, userId),
          eq(questionUserProgress.questionGroupId, questionGroupId)
        )
      )
      .limit(1);

    return NextResponse.json(progress[0] ?? null);
  } catch (error) {
    console.error('Failed to fetch user progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user progress' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string; questionGroupId: number } }
) {
  const { userId, questionGroupId } = params;
  const { responses, stats } = await request.json();

  try {
    // Get question group with proper type casting
    const [questionGroup] = await db
      .select()
      .from(questionGroups)
      .where(eq(questionGroups.id, questionGroupId))
      .limit(1);

    if (!questionGroup) {
      return NextResponse.json(
        { error: 'Question group not found' },
        { status: 404 }
      );
    }

    // Ensure we have the required denormalized data
    if (!questionGroup.name) {
      return NextResponse.json(
        { error: 'Question group name is required' },
        { status: 400 }
      );
    }

    await db
      .insert(questionUserProgress)
      .values({
        userId: userId,
        questionGroupId: questionGroupId,
        questionGroupName: questionGroup.name,
        responses: responses,
        stats: stats,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          questionUserProgress.userId,
          questionUserProgress.questionGroupId,
        ],
        set: {
          responses: responses,
          stats: stats,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update user progress:', error);
    return NextResponse.json(
      { error: 'Failed to update user progress' },
      { status: 500 }
    );
  }
}