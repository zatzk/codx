/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/cursos/api/paths/[pathId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { paths } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

interface UpdateRequestBody {
  title: string;
  description: string;
}

// PUT: Update a path
export async function PUT(request: Request, { params }: { params: { pathId: string } }) {
  try {
    const body: UpdateRequestBody = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const updatedPath = await db
      .update(paths)
      .set({ title, description })
      .where(eq(paths.id, parseInt(params.pathId)))
      .returning();

    return NextResponse.json(updatedPath);
  } catch (error) {
    console.error('Failed to update path:', error);
    return NextResponse.json({ error: 'Failed to update path' }, { status: 500 });
  }
}

// DELETE: Delete a path
export async function DELETE(request: Request, { params }: { params: { pathId: string } }) {
  try {
    await db.delete(paths).where(eq(paths.id, parseInt(params.pathId)));
    return NextResponse.json({ message: 'Path deleted successfully' });
  } catch (error) {
    console.error('Failed to delete path:', error);
    return NextResponse.json({ error: 'Failed to delete path' }, { status: 500 });
  }
}

// GET: Fetch a specific path with its courses
export async function GET(request: Request, { params }: { params: { pathId: string } }) {
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
              },
            },
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