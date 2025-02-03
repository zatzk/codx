/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/cursos/api/progress/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { courseUserProgress, lessons, courseModules, courses } from '~/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, lessonId, moduleId, currentLesson } = body; // Updated parameter name

  if (!userId || !lessonId || !moduleId || currentLesson == null) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const lessonInfo = await db.select({
      courseId: courses.id,
      moduleOrder: courseModules.order,
    })
      .from(lessons)
      .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
      .innerJoin(courses, eq(courseModules.courseId, courses.id))
      .where(eq(lessons.id, lessonId))
      .execute();

    if (!lessonInfo[0]?.courseId) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const { courseId, moduleOrder } = lessonInfo[0];

    // Update or create progress
    await db
      .insert(courseUserProgress)
      .values({
        userId,
        courseId,
        courseTitle: '',
        currentModule: moduleOrder!,
        currentLesson: currentLesson,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [courseUserProgress.userId, courseUserProgress.courseId],
        set: {
          currentModule: moduleOrder!,
          currentLesson: currentLesson,
          updatedAt: new Date(),
        },
      })
      .execute();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}