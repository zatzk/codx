/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/cursos/api/modules/by-course/[courseId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { courseModules, courses } from '~/server/db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';

// GET: Fetch all modules for a course
export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  try {
    const courseId = parseInt(params.courseId);
    
    // First fetch the course info
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId)
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Then fetch the modules with their lessons
    const modules = await db.query.courseModules.findMany({
      where: eq(courseModules.courseId, courseId),
      with: { lessons: true },
      orderBy: (modules, { asc }) => [asc(modules.order)],
    });

    // Add course info to each module
    const modulesWithCourseInfo = modules.map(module => ({
      ...module,
      courseTitle: course.title,
      courseDescription: course.description
    }));

    return NextResponse.json(modulesWithCourseInfo);
  } catch (error) {
    console.error('Failed to fetch modules:', error);
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 });
  }
}

// POST: Create a new module with order validation
export async function POST(request: Request, { params }: { params: { courseId: string } }) {
  try {
    const body = await request.json();
    const { title, description, order } = body;
    const courseId = parseInt(params.courseId);

    if (!title || !description || order === undefined) {
      return NextResponse.json(
        { error: 'Title, description, and order are required' },
        { status: 400 }
      );
    }

    // Check for existing order
    const existingModule = await db.query.courseModules.findFirst({
      where: and(
        eq(courseModules.courseId, courseId),
        eq(courseModules.order, order)
      ),
    });

    if (existingModule) {
      // Increment orders for modules with >= order
      await db.update(courseModules)
        .set({ order: sql`${courseModules.order} + 1` })
        .where(and(
          eq(courseModules.courseId, courseId),
          gte(courseModules.order, order)
        ));
    }

    const [newModule] = await db.insert(courseModules).values({
      title,
      description,
      courseId,
      order,
    }).returning();

    return NextResponse.json(newModule);
  } catch (error) {
    console.error('Failed to create module:', error);
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}