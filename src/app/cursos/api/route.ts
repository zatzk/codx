// app/cursos/api/paths/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function GET() {
  try {
    const paths = await db.query.paths.findMany({
      with: {
        pathCourses: {
          with: {
            course: true,
          },
        },
      },
    });

    return NextResponse.json(paths);
  } catch (error) {
    console.error('Failed to fetch paths:', error);
    return NextResponse.json({ error: 'Failed to fetch paths' }, { status: 500 });
  }
}