import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { courseUserProgress, lessons, courseModules, courses } from '~/server/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: Request
) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const courseId = searchParams.get('courseId');

  if (!userId || !courseId) {
    return NextResponse.json({ error: 'Missing userId or courseId' }, { status: 400 });
  }

  try {
    const progress = await db.query.courseUserProgress.findFirst({
      where: and(
        eq(courseUserProgress.userId, userId),
        eq(courseUserProgress.courseId, parseInt(courseId))
      ),
    });

    if (!progress) {
      return NextResponse.json({ progress: 0 });
    }

    // Calculate progress percentage
    const totalLessons = await db.select({ count: sql`count(*)` })
      .from(lessons)
      .innerJoin(courseModules, eq(lessons.courseModuleId, courseModules.id))
      .where(eq(courseModules.courseId, parseInt(courseId)))
      .execute();

    const progressPercentage = (progress.currentLessonIndex / totalLessons[0].count) * 100;

    return NextResponse.json({ progress: Math.round(progressPercentage) });
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(
  request: Request
) {
  const body = await request.json();
  const { userId, lessonId } = body;

  if (!userId || !lessonId) {
    return NextResponse.json({ error: 'Missing userId or lessonId' }, { status: 400 });
  }

  try {
    // Get the course and module for the lesson
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

    const { courseId, moduleId, moduleOrder, lessonOrder } = lessonInfo[0];

    // Update or create progress
    const result = await db
      .insert(courseUserProgress)
      .values({
        userId,
        courseId,
        currentModuleIndex: moduleOrder,
        currentLessonIndex: lessonOrder,
      })
      .onConflictDoUpdate({
        target: [courseUserProgress.userId, courseUserProgress.courseId],
        set: {
          currentModuleIndex: moduleOrder,
          currentLessonIndex: lessonOrder,
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