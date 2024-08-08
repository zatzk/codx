// app/questoes/api/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { eq } from 'drizzle-orm';
import { desafios } from '~/server/db/schema';

// export const runtime = 'edge';

export async function GET(request: Request) {
  console.log('Received request for ID:', request);
  const url = new URL(request.url);
  const replaceDashes = url.pathname.split('/').pop();
  const name = replaceDashes?.replace(/-/g, ' ');

  console.log('Name:', name);
  try {
    const res = await db.query.desafios.findMany({
      where: eq(desafios.title, name ?? ''),
      with: {
        testCases: true
      }
    });
    return NextResponse.json(res); 
  } catch (error) {
    console.error('Failed to fetch desafios:', error);
    return NextResponse.json({ error: 'Failed to fetch desafios' }, { status: 500 });
  }
}
