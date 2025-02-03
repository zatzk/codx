/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/cursos/api/lessons/[lessonId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { lessons } from '~/server/db/schema';
import { and, eq, gt, gte, lt, lte, sql } from 'drizzle-orm';

interface UpdateRequestBody {
  title: string;
  content?: string;
  videoUrl?: string;
  description?: string;
  order: number;
}

export async function PUT(request: Request, { params }: { params: { lessonId: string } }) {
  try {
    const body: UpdateRequestBody = await request.json();
    
    // Validate required fields (content must be non-empty string)
    if (!body.title?.trim() || !body.content?.trim() || !body.description?.trim() || body.order === undefined) {
      return NextResponse.json(
        { error: 'Title, content, description, and order are required' },
        { status: 400 }
      );
    }

    const existingLesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, parseInt(params.lessonId))
    });
    
    if (!existingLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    
    // Handle order changes
    if (body.order !== existingLesson.order) {
      // Decrement higher orders when moving down
      if (existingLesson.order !== null && body.order < existingLesson.order) {
        await db.update(lessons)
          .set({ order: sql`${lessons.order} + 1` })
          .where(and(
            eq(lessons.moduleId, existingLesson.moduleId!),
            gte(lessons.order, body.order),
            lt(lessons.order, existingLesson.order ?? 0)
          ));
      }
      // Increment lower orders when moving up
      else {
        await db.update(lessons)
          .set({ order: sql`${lessons.order} - 1` })
          .where(and(
            eq(lessons.moduleId, existingLesson.moduleId!),
            gt(lessons.order, existingLesson.order ?? 0),
            lte(lessons.order, body.order)
          ));
      }
    }

    if (existingLesson && existingLesson.id !== parseInt(params.lessonId)) {
      await db.update(lessons)
        .set({ order: sql`${lessons.order} + 1` })
        .where(and(
          eq(lessons.moduleId, lessons.moduleId),
          gte(lessons.order, body.order)
        ));
    }

    const updatedLesson = await db
      .update(lessons)
      .set({
        title: body.title,
        content: body.content,
        videoUrl: body.videoUrl ?? null,
        description: body.description,
        order: body.order,
      })
      .where(eq(lessons.id, parseInt(params.lessonId)))
      .returning();

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error('Failed to update lesson:', error);
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { lessonId: string } }) {
  try {
    await db.delete(lessons).where(eq(lessons.id, parseInt(params.lessonId)));
    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Failed to delete lesson:', error);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}