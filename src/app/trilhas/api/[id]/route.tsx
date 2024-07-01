import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { eq } from 'drizzle-orm';
import { roadmaps, trilhasGroups } from '~/server/db/schema';

export const runtime = 'edge';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const name = url.pathname.split('/').pop();

  try {
    if (!name) {
      return NextResponse.json({ error: 'Name parameter is required' }, { status: 400 });
    }

    const trilhasGroup = await db.query.trilhasGroups.findFirst({
      where: eq(trilhasGroups.name, name),
    });

    if (!trilhasGroup) {
      return NextResponse.json({ error: 'TrilhasGroup not found' }, { status: 404 });
    }

    const res = await db.query.roadmaps.findMany({
      where: eq(roadmaps.trilhasGroupsId, trilhasGroup.id),
      with: {
        trilhasGroup: true,
        trilha: true,
      },
    });

    return NextResponse.json(res);
  } catch (error) {
    console.error('Failed to fetch roadmaps:', error);
    return NextResponse.json({ error: 'Failed to fetch roadmaps' }, { status: 500 });
  }
}