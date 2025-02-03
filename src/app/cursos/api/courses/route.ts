/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/cursos/api/courses/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { courses } from '~/server/db/schema';

// GET: Fetch all courses
export async function GET() {
  try {
    const allCourses = await db.query.courses.findMany();
    return NextResponse.json(allCourses);
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

// POST: Create a new course
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

    const newCourse = await db.insert(courses).values({
      title,
      description,
      createdAt: new Date(),
    }).returning();

    return NextResponse.json(newCourse);
  } catch (error) {
    console.error('Failed to create course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}