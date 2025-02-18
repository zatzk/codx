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
          orderBy: (lessons, { asc }) => [asc(lessons.lessonOrder )],
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
    if (
      !body.title?.trim() || 
      !body.content?.trim() || 
      !body.description?.trim() || 
      typeof body.lessonOrder  !== 'number' || 
      body.lessonOrder  < 1
    ) {
      return NextResponse.json(
        { error: 'Title, content, description, and valid lessonOrder  are required' },
        { status: 400 }
      );
    }

    // Handle lessonOrder  conflicts
    const existingLesson = await db.query.lessons.findFirst({
      where: and(
        eq(lessons.moduleId, moduleId),
        eq(lessons.lessonOrder , body.lessonOrder )
      ),
    });

    if (existingLesson) {
      await db.update(lessons)
        .set({ lessonOrder : sql`${lessons.lessonOrder } + 1` })
        .where(and(
          eq(lessons.moduleId, moduleId),
          gte(lessons.lessonOrder , body.lessonOrder )
        ));
    }

    const newLesson = await db.insert(lessons).values({
      moduleId,
      title: body.title,
      content: body.content,
      videoUrl: body.videoUrl || null,
      description: body.description,
      lessonOrder : body.lessonOrder ,
      createdAt: new Date(),
    }).returning({
      id: lessons.id,
      title: lessons.title,
      content: lessons.content,
      videoUrl: lessons.videoUrl,
      description: lessons.description,
      lessonOrder : lessons.lessonOrder ,
    });

    return NextResponse.json(newLesson);
  } catch (error) {
    console.error('Failed to create lesson:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}