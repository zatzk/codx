/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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
import { ModulesDrawer } from "~/components/cursosComponents/moduleDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface Lesson {
  id: number;
  title: string;
  description: string;
  order: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  courseId: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
}

export default function CourseModulesPage({ params }: { params: { pathId: string, courseId: string } }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [courseInfo, setCourseInfo] = useState<Course | null>(null);
  const [progressData, setProgressData] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const { activeColorSet } = useColorContext();
  const isAdmin = session?.user?.role === 'admin';

  async function fetchCourse() {
    setIsLoading(true);
    try {
      const response = await fetch(`/cursos/api/modules/by-course/${params.courseId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // Ensure lessons array exists for each module
      const normalizedModules = data.map((module: any) => ({
        ...module,
        lessons: module.lessons || [] // Add empty array if lessons is null/undefined
      }));
  
      if (normalizedModules.length > 0) {
        setModules(normalizedModules);
        setCourseInfo({
          id: parseInt(params.courseId),
          title: normalizedModules[0]?.courseTitle ?? 'Course Title',
          description: normalizedModules[0]?.courseDescription ?? 'Descrição do curso'
        });
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void fetchCourse();
  }, [params.courseId]);

  useEffect(() => {
    async function fetchProgress() {
      if (!session?.user?.id || !params.courseId) return;

      try {
        const response = await fetch(`/cursos/api/progress/${session.user.id}/${params.courseId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch progress');
        }
        const data = await response.json();
        setProgressData(data?.moduleProgress ?? {});
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    }

    if (session?.user?.id) {
      void fetchProgress();
    }
  }, [session?.user?.id, params.courseId]);

  const handleAddClick = () => {
    setSelectedModule(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (module: Module) => {
    setSelectedModule(module);
    setIsDrawerOpen(true);
  };

  const handleModuleClick = (moduleId: number) => {
    router.push(`/cursos/${params.pathId}/curso/${params.courseId}/modulo/${moduleId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  return (
    <section className={`${inter.variable} ${activeColorSet?.secondary} flex w-full flex-col items-center mt-20`}>
      <SimplePagHeader 
        title={courseInfo?.title ?? ''} 
        description={courseInfo?.description ?? ''} 
      />
      <div className="w-full flex pb-16 pt-12">
        <div className="ml-auto mr-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-1 gap-x-12 gap-y-6 xs:grid-cols-1">
            {sortedModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                progress={progressData[module.id] ?? 0}
                onClick={() => handleModuleClick(module.id)}
                onEdit={isAdmin ? () => handleEditClick(module) : undefined}
              />
            ))}
            {session?.user.role === 'admin' && (
              <button
                onClick={handleAddClick}
                className={`
                  hover:bg-opacity-30 
                  bg-opacity-20 
                  p-6
                  rounded-2xl
                  h-24
                  w-full 
                  flex 
                  items-center 
                  justify-center
                  transition-all
                  border-2
                  border-white/10
                  hover:border-white/20
                `}
              >
                <span className="pixelarticons--plus text-white/60 text-lg"></span>
              </button>
            )}
          </div>
        </div>
      </div>
      <ModulesDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedModule(null);
        }}
        onFormSubmit={() => {
          void fetchCourse();
        }}
        courseId={parseInt(params.courseId)}
        existingModules={modules}
        selectedModule={selectedModule}
      />
    </section>
  );
}
