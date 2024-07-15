// app/questoes/api/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';

// export const runtime = 'edge';

export async function GET() {
  try {
    const res = await db.query.trilhasGroups.findMany({
      // where: (roadmaps, { eq }) => eq(roadmaps.trilhasGroupsId, 3),
      // with: {
      //   trilhasGroup: true,
      //   trilha: true,
      // },
    });
    return NextResponse.json(res); 
  } catch (error) {
    console.error('Failed to fetch trilhasGroups:', error);
    return NextResponse.json({ error: 'Failed to fetch trilhasGroups' }, { status: 500 });
  }
}
