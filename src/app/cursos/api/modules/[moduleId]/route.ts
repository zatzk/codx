/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @next/next/no-assign-module-variable */
// app/cursos/api/modules/[moduleId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { courseModules } from '~/server/db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';

interface UpdateRequestBody {
  title: string;
  description: string;
  order: number;
}

// PUT: Update a module with order validation
export async function PUT(request: Request, { params }: { params: { moduleId: string } }) {
  try {
    const body: UpdateRequestBody = await request.json();
    const { title, description, order } = body;
    const moduleId = parseInt(params.moduleId);

    if (!title || !description || order === undefined) {
      return NextResponse.json(
        { error: 'Title, description, and order are required' },
        { status: 400 }
      );
    }

    // Get current module details
    const currentModule = await db.query.courseModules.findFirst({
      where: eq(courseModules.id, moduleId),
    });

    if (!currentModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // If order is changing
    if (order !== currentModule.order) {
      // Check for existing order
      const existingModule = await db.query.courseModules.findFirst({
        where: and(
          eq(courseModules.courseId, currentModule.courseId!),
          eq(courseModules.order, order)
        ),
      });

      if (existingModule) {
        // Increment orders for modules with >= new order
        await db.update(courseModules)
          .set({ order: sql`${courseModules.order} + 1` })
          .where(and(
            eq(courseModules.courseId, currentModule.courseId!),
            gte(courseModules.order, order)
          ));
      }
    }

    const updatedModule = await db
      .update(courseModules)
      .set({ title, description, order })
      .where(eq(courseModules.id, moduleId))
      .returning();

    return NextResponse.json(updatedModule);
  } catch (error) {
    console.error('Failed to update module:', error);
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
  }
}

// DELETE: Delete a module
export async function DELETE(request: Request, { params }: { params: { moduleId: string } }) {
  try {
    await db.delete(courseModules).where(eq(courseModules.id, parseInt(params.moduleId)));
    return NextResponse.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Failed to delete module:', error);
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
  }
}