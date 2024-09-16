// app/cursos/api/progress/[userId]/route.ts
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { courseUserProgress } from '~/server/db/schema';


export async function GET( request: Request, { params }: { params: { userId: string } } ) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const progress = await db.select()
      .from(courseUserProgress)
      .where(
        eq(courseUserProgress.userId, userId)
      );

    return NextResponse.json(progress);
    
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}
