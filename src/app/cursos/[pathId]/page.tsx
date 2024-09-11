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

export default function PathCoursesPage({ params }: { params: { pathId: string } }) {
  const [path, setPath] = useState<Path | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const {activeColorSet} = useColorContext();

  useEffect(() => {
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

    fetchPath();
  }, [params.pathId]);

  console.log('path', path);

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
            {path.pathCourses.map(({ course }) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onClick={() => handleCourseClick(course.id)}
                session={session}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}