
// api/courses/[pathId]/[courseId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { pathCourses } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

// POST: Link a course to a path
export async function POST(request: Request, { params }: { params: { pathId: string; courseId: string } }) {
  try {
    const pathId = parseInt(params.pathId);
    const courseId = parseInt(params.courseId);

    // Check if the link already exists
    const existingLink = await db.query.pathCourses.findFirst({
      where: (pc) => eq(pc.pathId, pathId) && eq(pc.courseId, courseId),
    });

    if (existingLink) {
      return NextResponse.json({ error: 'Course is already linked to this path' }, { status: 400 });
    }

    // Create the link
    await db.insert(pathCourses).values({
      pathId,
      courseId,
      order: 0, // Default order
    });

    return NextResponse.json({ message: 'Course linked successfully' });
  } catch (error) {
    console.error('Failed to link course:', error);
    return NextResponse.json({ error: 'Failed to link course' }, { status: 500 });
  }
}

// DELETE: Unlink a course from a path
export async function DELETE(request: Request, { params }: { params: { pathId: string; courseId: string } }) {
  try {
    const pathId = parseInt(params.pathId);
    const courseId = parseInt(params.courseId);

    // Delete the link
    await db.delete(pathCourses).where(
      eq(pathCourses.pathId, pathId) && eq(pathCourses.courseId, courseId)
    );

    return NextResponse.json({ message: 'Course unlinked successfully' });
  } catch (error) {
    console.error('Failed to unlink course:', error);
    return NextResponse.json({ error: 'Failed to unlink course' }, { status: 500 });
  }
}