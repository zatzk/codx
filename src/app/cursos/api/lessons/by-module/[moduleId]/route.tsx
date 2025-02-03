/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/cursos/api/lessons/[moduleId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { courseModules, lessons } from '~/server/db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: { moduleId: string } }) {
  try {
    const moduleId = parseInt(params.moduleId);
    
    const moduleData = await db.query.courseModules.findFirst({
      where: eq(courseModules.id, moduleId),
      with: {
        lessons: {
          orderBy: (lessons, { asc }) => [asc(lessons.order)],
        },
      },
    });

    if (!moduleData) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Ensure lessons array exists
    const normalizedModule = {
      ...moduleData,
      lessons: moduleData.lessons || []
    };

    return NextResponse.json(normalizedModule);
  } catch (error) {
    console.error('Failed to fetch module:', error);
    return NextResponse.json({ error: 'Failed to fetch module' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { moduleId: string } }) {
  try {
    const body = await request.json();
    const moduleId = parseInt(params.moduleId);

    // Validate required fields
    if (!body.title?.trim() || !body.content?.trim() || !body.description?.trim() || body.order === undefined) {
      return NextResponse.json(
        { error: 'Title, content, description, and order are required' },
        { status: 400 }
      );
    }

    // Handle order conflicts
    const existingLesson = await db.query.lessons.findFirst({
      where: and(
        eq(lessons.moduleId, moduleId),
        eq(lessons.order, body.order)
      ),
    });

    if (existingLesson) {
      await db.update(lessons)
        .set({ order: sql`${lessons.order} + 1` })
        .where(and(
          eq(lessons.moduleId, moduleId),
          gte(lessons.order, body.order)
        ));
    }

    const newLesson = await db.insert(lessons).values({
      moduleId,
      title: body.title,
      content: body.content,
      videoUrl: body.videoUrl || null,
      description: body.description,
      order: body.order,
      createdAt: new Date(),
    }).returning();

    return NextResponse.json(newLesson);
  } catch (error) {
    console.error('Failed to create lesson:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}