// app/cursos/api/paths/[pathId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { paths } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { pathId: string } }
) {
  try {
    const pathId = parseInt(params.pathId);
    const path = await db.query.paths.findFirst({
      where: eq(paths.id, pathId),
      with: {
        pathCourses: {
          with: {
            course: {
              with: {
                modules: true,
              }
            }
          },
        },
      },
    });

    if (!path) {
      return NextResponse.json({ error: 'Path not found' }, { status: 404 });
    }

    return NextResponse.json(path);
  } catch (error) {
    console.error('Failed to fetch path:', error);
    return NextResponse.json({ error: 'Failed to fetch path' }, { status: 500 });
  }
}