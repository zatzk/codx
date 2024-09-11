/* eslint-disable @next/next/no-assign-module-variable */
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { courseModules, lessons } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const moduleId = parseInt(params.moduleId);
    const module = await db.query.courseModules.findFirst({
      where: eq(courseModules.id, moduleId),
      with: {
        lessons: {
          orderBy: (lessons, { asc }) => [asc(lessons.order)],
        },
      },
    });

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    return NextResponse.json(module);
  } catch (error) {
    console.error('Failed to fetch module:', error);
    return NextResponse.json({ error: 'Failed to fetch module' }, { status: 500 });
  }
}