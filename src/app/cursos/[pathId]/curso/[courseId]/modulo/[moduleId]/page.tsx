/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { Inter, Silkscreen } from "next/font/google";
import { useColorContext } from "~/lib/colorContext";
import { SimplePagHeader } from "~/components/simplePageHeader";

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl: string | null;
  order: number;
}

interface Module {
  description: string;
  courseId: number;
  id: number;
  title: string;
  lessons: Lesson[];
}

export default function ModuleLessonsPage({ params }: { params: { moduleId: string } }) {
  const [module, setModule] = useState<Module | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<number>(0); // Tracks the current lesson index from progress
  const { data: session } = useSession();
  const { activeColorSet } = useColorContext();

  // Fetch the module first
  useEffect(() => {
    async function fetchModule() {
      setIsLoading(false);
      try {
        const response = await fetch(`/cursos/api/modules/${params.moduleId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setModule(data);
        if (data.lessons.length > 0) {
          setActiveLesson(data.lessons[0]);
        }
      } catch (error) {
        console.error('Failed to fetch module:', error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchModule();
  }, [params.moduleId]);

  // Fetch progress only after module is fetched
  useEffect(() => {
    async function fetchProgress() {
      // if (!session?.user?.id || !module) return;
    
      try {
        const response = await fetch(`/cursos/api/progress/${session?.user.id}/${module?.courseId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch progress in the module page');
        }
        const data = await response.json();
        
        const moduleProgress = data.moduleProgress || {};
        if (module && module.id in moduleProgress) {
          setProgress(moduleProgress[module.id]); // Set progress to the current lesson index for this module
        } else {
          setProgress(0); // If no progress found, start from 0
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    }

    if (module) {
      void fetchProgress();
    }
  }, [session?.user.id, module]);

  const markLessonAsComplete = async (lessonId: number) => {
    if (!session?.user?.id || !module) return;
  
    try {
      const response = await fetch('/cursos/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          lessonId: lessonId,
          moduleId: module.id,
          currentLessonIndex: activeLesson?.order,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to mark lesson as complete');
      }
  
      const lesson = module.lessons.find(lesson => lesson.id === lessonId);
      if (lesson) {
        setProgress(prev => Math.max(prev, lesson.order)); // Update progress
      }
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
    }
  };

  if (!module) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  const sortedLessons = [...module.lessons].sort((a, b) => a.order - b.order);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  
  return (
    <section className={`${inter.variable} ${activeColorSet?.secondary} flex w-full overflow-hidden text-white flex-col items-center mt-20`}>
      <SimplePagHeader title={module.title} description={module.description} />
      <div className="w-4/5 h-screen flex flex-row mt-10">
        <div className={`min-w-[330px] max-h-[80%] min-h-[80%] overflow-auto ${activeColorSet?.bg} bg-opacity-20 rounded-2xl`}>
          <ul className="p-6">
            {sortedLessons.map((lesson) => (
              <li
                key={lesson.id}
                className={`cursor-pointer p-2 flex items-center`}
                onClick={() => setActiveLesson(lesson)}
              >
                <span className={`${lesson.order <= progress ? 'pixelarticons--check' : 'pixelarticons--circle'} text-lg mr-2`}></span>
                <h4 className={`${activeLesson?.id === lesson.id ? 'border-b opacity-90' : ''}`}>{lesson.title}</h4>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-3/4 max-h-[76%] p-4 ml-36">
          {activeLesson ? (
            <>
              <div className="max-h-full min-h-full overflow-auto">
                <h3 className={`${silkscreen.className} text-2xl font-bold mb-8`}>{activeLesson.title}</h3>
                {activeLesson.videoUrl && (
                  <div className="mb-4">
                    <video src={activeLesson.videoUrl} controls className="w-full" />
                  </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
              </div>
              <div className="w-full justify-end flex">
                <button
                  className={`mt-4 text-white flex items-center px-3 py-1 ${silkscreen.className} ${activeColorSet?.bg} bg-opacity-30 hover:bg-opacity-40 rounded-lg`}
                  onClick={() => markLessonAsComplete(activeLesson.id)}
                  disabled={activeLesson.order <= progress}
                >
                  {activeLesson.order <= progress 
                    ? 
                      <>
                        <span className="pixelarticons--check-double text-xl mr-3"></span>
                        <p>Concluído</p>
                      </>
                    : 
                      <>
                        <span className="pixelarticons--check text-xl mr-3"></span>
                        <p>Completar</p>
                      </>
                  }
                </button>
              </div>
            </>
          ) : (
            <p>Select a lesson to begin</p>
          )}
        </div>
      </div>
    </section>
  );
}

