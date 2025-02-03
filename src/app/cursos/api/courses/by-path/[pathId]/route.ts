/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// app/cursos/api/courses/[pathId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { courses, pathCourses, paths } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

// GET: Fetch all courses for a specific path
export async function GET(request: Request, { params }: { params: { pathId: string } }) {
  try {
    const pathId = parseInt(params.pathId);
    const path = await db.query.paths.findFirst({
      where: eq(paths?.id, pathId),
      with: {
        pathCourses: {
          with: {
            course: {
              with: {
                modules: true,
              },
            },
          },
        },
      },
    });

    if (!path) {
      return NextResponse.json({ error: 'Path not found' }, { status: 404 });
    }

    return NextResponse.json(path.pathCourses.map((pc) => pc.course));
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

// POST: Create a new course and link it to the path
export async function POST(request: Request, { params }: { params: { pathId: string } }) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const pathId = parseInt(params.pathId);

    // Create the new course
    const [newCourse] = await db.insert(courses).values({
      title,
      description,
      createdAt: new Date(),
    }).returning();

    // Link the new course to the path
    await db.insert(pathCourses).values({
      pathId,
      courseId: newCourse?.id,
      order: 0, // Default order
    });

    return NextResponse.json(newCourse);
  } catch (error) {
    console.error('Failed to create course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}