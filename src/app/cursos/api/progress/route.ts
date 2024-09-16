/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { courseUserProgress, lessons, courseModules, courses } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: Request
) {
  const body = await request.json();
  const { userId, lessonId } = body;

  if (!userId || !lessonId) {
    return NextResponse.json({ error: 'Missing userId or lessonId' }, { status: 400 });
  }

  try {
    const lessonInfo = await db.select({
      courseId: courses.id,
      moduleId: courseModules.id,
      moduleOrder: courseModules.order,
      lessonOrder: lessons.order,
    })
    .from(lessons)
    .innerJoin(courseModules, eq(lessons.courseModuleId, courseModules.id))
    .innerJoin(courses, eq(courseModules.courseId, courses.id))
    .where(eq(lessons.id, lessonId))
    .execute();

    if (lessonInfo.length === 0) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const { courseId, moduleOrder, lessonOrder } = lessonInfo?.[0] ?? {};

    // Update or create progress
    const result = await db
      .insert(courseUserProgress)
      .values({
        userId,
        courseId,
        currentModuleIndex: moduleOrder ?? 0,
        currentLessonIndex: lessonOrder ?? 0,
      })
      .onConflictDoUpdate({
        target: [courseUserProgress.userId, courseUserProgress.courseId],
      set: {
          currentModuleIndex: moduleOrder ?? 0,
          currentLessonIndex: lessonOrder ?? 0,
          updatedAt: new Date(),
        },
      })
      .execute();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}