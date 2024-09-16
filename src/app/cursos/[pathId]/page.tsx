/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/cursos/[pathId]/page.tsx
'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CourseCard from '~/components/cursosComponents/courseCard';
import { useColorContext } from "~/lib/colorContext";
import { SimplePagHeader } from "~/components/simplePageHeader";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface Course {
  id: number;
  title: string;
  description: string;
  modules: { id: number }[];
}

interface Path {
  id: number;
  title: string;
  description: string;
  pathCourses: {
    course: Course;
  }[];
}

interface Progress {
  id: number;
  pathId: number;
  courseId: number;
  userId: number;
  order: number;
  course: Course;
}

export default function PathCoursesPage({ params }: { params: { pathId: string } }) {
  const [path, setPath] = useState<Path | null>(null);
  const [progress, setProgress] = useState<Progress[] | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const {activeColorSet} = useColorContext();

  useEffect(() => {
    if (!session?.user?.id) return;

    async function fetchPath() {
      try {
        const response = await fetch(`/cursos/api/paths/${params.pathId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPath(data);
      } catch (error) {
        console.error('Failed to fetch path:', error);
      }
    }

    async function fetchProgress() {
      try {
        const response = await fetch(`/cursos/api/progress/${session?.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setProgress(data);
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      }
    }

    fetchProgress();
    fetchPath();
  }, [params.pathId, session]);


  console.log('path', path?.pathCourses);
  console.log('progress', progress);

  const handleCourseClick = (courseId: number) => {
    router.push(`/cursos/${params.pathId}/curso/${courseId}`);
  };

  if (!path) {
    return <div>Loading...</div>;
  }

  return (
    <section className={`${inter.variable} ${activeColorSet?.secondary} flex w-full flex-col items-center mt-20 `}>
      <SimplePagHeader title={path.title} description={path.description} />
      <div className="w-full flex pb-16 pt-12">
        <div className="ml-auto mr-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 xs:grid-cols-1">
            {path.pathCourses.map(({ course }) => {
              // Find the progress that matches the course ID
              const courseProgress = progress?.find((p) => p.courseId === course.id) ?? {
                courseId: course.id,
                currentModuleIndex: 0,
                currentLessonIndex: 0,
              };

              return (
                <CourseCard 
                  key={`${course.id}-${course.title}`}  
                  course={course} 
                  progress={courseProgress}  // Pass the matching or default progress
                  onClick={() => handleCourseClick(course.id)}
                  session={session}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}