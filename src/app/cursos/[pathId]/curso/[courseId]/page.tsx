/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SimplePagHeader } from "~/components/simplePageHeader";
import { useColorContext } from "~/lib/colorContext";
import { Inter } from "next/font/google";
import ModuleCard from "~/components/cursosComponents/moduleCard";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  modules: Module[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  order: number;
}

export default function CourseModulesPage({ params }: { params: { pathId: string, courseId: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [progressData, setProgressData] = useState<Record<number, number>>({});
  const router = useRouter();
  const { data: session } = useSession();
  const { activeColorSet } = useColorContext();

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`/cursos/api/courses/${params.courseId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Failed to fetch course:', error);
      }
    }

    void fetchCourse();
  }, [params.courseId]);

  useEffect(() => {
    async function fetchProgress() {
      // if (!session?.user?.id || !course) return;

      try {
        const response = await fetch(`/cursos/api/progress/${session?.user.id}/${course?.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch progress');
        }
        const data = await response.json();
        setProgressData(data.moduleProgress || {});
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    }

    if (course) {
      void fetchProgress();
    }
  }, [session?.user?.id, course]);

  const sortedModules = [...(course?.modules ?? [])].sort((a, b) => a.order - b.order);

  const handleModuleClick = (moduleId: number) => {
    router.push(`/cursos/${params.pathId}/curso/${course?.id}/modulo/${moduleId}`)
  };

  if (!course) {
    return <div className="flex items-center justify-center h-screen  text-white">Loading...</div>;
  }
  console.log('course', course);

  return (
    <section className={`${inter.variable} ${activeColorSet?.secondary} flex w-full flex-col items-center mt-20`}>
      <SimplePagHeader title={course.title} description={course.description} />
      <div className="w-full flex pb-16 pt-12">
        <div className="ml-auto mr-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-1 gap-x-12 gap-y-6 xs:grid-cols-1">
            {sortedModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                progress={progressData[module.id] ?? 0}
                onClick={() => handleModuleClick(module.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
