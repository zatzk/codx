/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// app/cursos/[pathId]/page.tsx
'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CourseCard from '~/components/cursosComponents/courseCard';
import { useColorContext } from '~/lib/colorContext';
import { SimplePagHeader } from '~/components/simplePageHeader';
import { Inter } from 'next/font/google';
import { CoursesDrawer } from '~/components/cursosComponents/coursesDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

interface Module {
  id: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  modules: Module[];
}

interface Progress {
  id: number;
  pathId: number;
  courseId: number;
  userId: number;
  order: number;
  moduleProgress: Record<number, number>;
  totalLessons: number;
}

export default function PathCoursesPage({ params }: { params: { pathId: string } }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Progress[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const { activeColorSet } = useColorContext();
  const isAdmin = session?.user?.role === 'admin';

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/cursos/api/courses/by-path/${params.pathId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCourses(data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [params.pathId]);

  useEffect(() => {
    void fetchCourses();
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
    void fetchProgress();
  }, [fetchCourses, params.pathId, session]);

  const handleCourseClick = (courseId: number) => {
    router.push(`/cursos/${params.pathId}/curso/${courseId}`);
  };

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsDrawerOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedCourse(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <section className={`${inter.variable} ${activeColorSet?.secondary} flex w-full flex-col items-center mt-20`}>
      <SimplePagHeader title="Courses" description="Explore the available courses." />
      <div className="w-full flex pb-16 pt-12">
        <div className="ml-auto mr-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 xs:grid-cols-1">
            {Array.isArray(courses) && courses.length > 0 ? (
              courses.map((course) => {
                const courseProgress = progress?.find((p) => p.courseId === course.id);
                const completedLessons = courseProgress
                  ? Object.values(courseProgress.moduleProgress).reduce((sum, lessons) => sum + lessons, 0)
                  : 0;
                const totalLessons = courseProgress?.totalLessons ?? 0;

                return (
                  <CourseCard
                    key={`${course.id}-${course.title}`}
                    course={course}
                    completedLessons={completedLessons}
                    totalLessons={totalLessons}
                    onClick={() => handleCourseClick(course.id)}
                    session={session}
                    onEdit={() => handleEditCourse(course)}
                    isAdmin={isAdmin}
                  />
                );
              })
            ) : (
              <div className="text-white/60">No courses found for this path.</div>
            )}
            {isAdmin && (
              <button
                onClick={handleAddCourse}
                className={`
                  hover:bg-opacity-30 
                  bg-opacity-20 
                  p-6
                  rounded-2xl
                  h-24
                  w-[380px] 
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

      <CoursesDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onFormSubmit={fetchCourses}
        pathId={parseInt(params.pathId)}
        course={selectedCourse}
      />
    </section>
  );
}