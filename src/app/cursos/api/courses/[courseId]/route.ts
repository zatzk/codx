/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// api/courses/[courseId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { courses, pathCourses } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

interface UpdateRequestBody {
  title: string;
  description: string;
}

// PUT: Update a course
export async function PUT(request: Request, { params }: { params: { courseId: string } }) {
  try {
    const body: UpdateRequestBody = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const updatedCourse = await db
      .update(courses)
      .set({ title, description })
      .where(eq(courses.id, parseInt(params.courseId)))
      .returning();

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Failed to update course:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

// DELETE: Delete a course and its links in pathCourses
export async function DELETE(request: Request, { params }: { params: { courseId: string } }) {
  try {
    const courseId = parseInt(params.courseId);

    // Delete the course
    await db.delete(courses).where(eq(courses.id, courseId));

    // Delete all links in pathCourses
    await db.delete(pathCourses).where(eq(pathCourses.courseId, courseId));

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Failed to delete course:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}