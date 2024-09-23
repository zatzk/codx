/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { courseUserProgress, lessons, courseModules, courses } from '~/server/db/schema';
import { and, eq, sql, is } from 'drizzle-orm';

export async function POST(
  request: Request
) {
  const body = await request.json();
  const { userId, lessonId, moduleId, currentLessonIndex } = body;

  if (!userId || !lessonId || !moduleId || currentLessonIndex == null) {
    return NextResponse.json({ error: 'Missing userId, lessonId, moduleId, or currentLessonIndex' }, { status: 400 });
  }

  try {
    const lessonInfo = await db.select({
      courseId: courses.id,
      moduleOrder: courseModules.order,
    })
    .from(lessons)
    .innerJoin(courseModules, eq(lessons.courseModuleId, courseModules.id))
    .innerJoin(courses, eq(courseModules.courseId, courses.id))
    .where(eq(lessons.id, lessonId))
    .execute();

    if (lessonInfo.length === 0) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const { courseId, moduleOrder } = lessonInfo?.[0] ?? {};

    if (courseId === undefined) {
      return NextResponse.json({ error: 'Course ID not found' }, { status: 404 });
    }

    // Fetch total lessons in the course
    const totalLessonsData = await db.select({
      totalLessons: sql<number>`COUNT(${lessons.id})`
    })
    .from(lessons)
    .innerJoin(courseModules, eq(lessons.courseModuleId, courseModules.id))
    .where(eq(courseModules.courseId, courseId))
    .execute();

    const totalLessons = totalLessonsData?.[0]?.totalLessons ?? 0;

    // Fetch the existing user progress
    const existingProgress = await db
      .select()
      .from(courseUserProgress)
      .where(
        and(
          eq(courseUserProgress.userId, userId),
          eq(courseUserProgress.courseId, courseId)
        )
      )
      .execute();

    const moduleProgress: Record<number, number> = existingProgress[0]?.moduleProgress as Record<number, number> || {};

    // Update the moduleProgress field with the current module and lesson index
    moduleProgress[moduleId] = currentLessonIndex;

    // Update or create the progress record
    const result = await db
      .insert(courseUserProgress)
      .values({
        userId,
        courseId,
        currentModuleIndex: moduleOrder ?? 0,
        currentLessonIndex: currentLessonIndex ?? 0,
        moduleProgress, // Save the updated moduleProgress object
        totalLessons,   // Store total lessons count
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [courseUserProgress.userId, courseUserProgress.courseId],
        set: {
          currentModuleIndex: moduleOrder ?? 0,
          currentLessonIndex: currentLessonIndex ?? 0,
          moduleProgress, // Save the updated moduleProgress object
          totalLessons,   // Update total lessons count
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
