'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SimplePagHeader } from "~/components/simplePageHeader";
import { useColorContext } from "~/lib/colorContext";
import { Inter, Silkscreen } from "next/font/google";
import ModuleCard from "~/components/cursosComponents/moduleCard";

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  modules: Module[];
}

export default function CourseModulesPage({ params }: { params: { pathId: string, courseId: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const {activeColorSet} = useColorContext();

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

    fetchCourse();
  }, [params.courseId]);


  if (!course) {
    return <div>Loading...</div>;
  }

  const sortedModules = [...course.modules].sort((a, b) => a.order - b.order);

  const handleModuleClick = (moduleId: number) => {
    router.push(`/cursos/${params.pathId}/curso/${course.id}/modulo/${moduleId}`)
  };


  return (
    <section className={`${inter.variable} ${activeColorSet?.secondary} flex w-full flex-col items-center mt-20 `}>
      <SimplePagHeader title={course.title} description={course.description} />
      {/* <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
      <p className="mb-6">{course.description}</p> */}
      {/* <div className="space-y-4"> */}
      <div className="w-full flex pb-16 pt-12">
        <div className="ml-auto mr-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-1 gap-x-12 gap-y-6 xs:grid-cols-1">
            {sortedModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onClick={() => handleModuleClick(module.id)}
                session={session}
              />
              // <div
              //   className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
              //   onClick={() => router.push(`/cursos/${params.pathId}/curso/${course.id}/modulo/${module.id}`)}
              // >
              //   <h2 className="text-xl font-bold">{module.title}</h2>
              //   <p>{module.description}</p>
              // </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}