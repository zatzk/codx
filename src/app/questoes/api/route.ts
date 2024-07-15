// app/questoes/api/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';

// export const runtime = 'edge';

export async function GET() {
  try {
    const res = await db.query.questionGroups.findMany({
      // with: {
      //   questions: true
      // }
    });
    return NextResponse.json(res); 
  } catch (error) {
    console.error('Failed to fetch questionGroups:', error);
    return NextResponse.json({ error: 'Failed to fetch questionGroups' }, { status: 500 });
  }
}
