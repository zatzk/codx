// app/questoes/api/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { eq } from 'drizzle-orm';
import { questionGroups } from '~/server/db/schema';

// export const runtime = 'edge';

export async function GET(request: Request) {
  console.log('Received request for ID:', request);
  const url = new URL(request.url);
  const name = url.pathname.split('/').pop();


  try {
    const res = await db.query.questionGroups.findMany({
      where: eq(questionGroups.name, name ?? ''),
      with: {
        questions: true
      }
    });
    return NextResponse.json(res); 
  } catch (error) {
    console.error('Failed to fetch questionGroup:', error);
    return NextResponse.json({ error: 'Failed to fetch questionGroup' }, { status: 500 });
  }
}
