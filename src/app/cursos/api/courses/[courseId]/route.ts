import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { courses, courseModules } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = parseInt(params.courseId);
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        modules: {
          orderBy: (modules, { asc }) => [asc(modules.order)],
          with: {
            lessons: {
              orderBy: (lessons, { asc }) => [asc(lessons.order)],
            },
          },
        },
      },
    });
    console.log('course', course);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Failed to fetch course:', error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}