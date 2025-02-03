/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/cursos/api/courses/unlink/[pathId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { pathCourses } from '~/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function POST(request: Request, { params }: { params: { pathId: string } }) {
  try {
    const pathId = parseInt(params.pathId);
    const body = await request.json();
    const { courseIds } = body;

    if (!courseIds || courseIds?.length === 0) {
      return NextResponse.json(
        { error: 'At least one course ID is required' },
        { status: 400 }
      );
    }

    // Delete the links from the pathCourses table
    await db
      .delete(pathCourses)
      .where(
        and(
          eq(pathCourses.pathId, pathId),
          eq(pathCourses.courseId, courseIds) // Assuming courseIds is an array
        )
      );

    return NextResponse.json({ message: 'Courses unlinked successfully' });
  } catch (error) {
    console.error('Failed to unlink courses:', error);
    return NextResponse.json({ error: 'Failed to unlink courses' }, { status: 500 });
  }
}