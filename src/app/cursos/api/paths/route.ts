/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/cursos/api/paths/route.ts

import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { paths } from '~/server/db/schema';

// GET: Fetch all paths
export async function GET() {
  try {
    const allPaths = await db.query.paths.findMany({
      with: {
        pathCourses: {
          with: {
            course: true,
          },
        },
      },
    });
    return NextResponse.json(allPaths);
  } catch (error) {
    console.error('Failed to fetch paths:', error);
    return NextResponse.json({ error: 'Failed to fetch paths' }, { status: 500 });
  }
}

// POST: Create a new path
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const newPath = await db.insert(paths).values({
      title,
      description,
      createdAt: new Date(),
    }).returning();

    return NextResponse.json(newPath);
  } catch (error) {
    console.error('Failed to create path:', error);
    return NextResponse.json({ error: 'Failed to create path' }, { status: 500 });
  }
}