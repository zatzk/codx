/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/cursos/api/progress/[userId]/[courseId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { courseUserProgress } from '~/server/db/schema';
import { eq, and } from 'drizzle-orm';



export async function GET(request: Request, { params }: { params: { userId: string; courseId: string } }) {
  const { userId, courseId } = params;

  if (!userId || !courseId) {
    return NextResponse.json({ error: 'Missing userId or courseId' }, { status: 400 });
  }
  try {
    const progress = await db.select()
      .from(courseUserProgress)
      .where(
        and(
          eq(courseUserProgress.userId, userId),
          eq(courseUserProgress.courseId, parseInt(courseId))
        )
      )
      .limit(1);

    return NextResponse.json(progress[0]);

  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}