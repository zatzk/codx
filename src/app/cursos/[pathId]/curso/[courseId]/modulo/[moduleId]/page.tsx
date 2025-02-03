/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { Inter, Silkscreen } from "next/font/google";
import { useColorContext } from "~/lib/colorContext";
import { SimplePagHeader } from "~/components/simplePageHeader";
import { LessonsDrawer } from "~/components/cursosComponents/lessonsDrawer";

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
  description: string;
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const refreshLessons = async () => {
    const response = await fetch(`/cursos/api/lessons/by-module/${params.moduleId}`);
    const data = await response.json();
    setModule(data);
    if (data.lessons.length > 0) {
      setActiveLesson(data.lessons[0]);
    }
  };

  // Fetch the module first
  useEffect(() => {
    async function fetchModule() {
      setIsLoading(true);
      try {
        const response = await fetch(`/cursos/api/lessons/by-module/${params.moduleId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Ensure lessons array exists and is properly formatted
        const normalizedModule = {
          ...data,
          lessons: Array.isArray(data.lessons) ? data.lessons : []
        };
  
        setModule(normalizedModule);
        if (normalizedModule.lessons.length > 0) {
          setActiveLesson(normalizedModule.lessons[0]);
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
      try {
        const response = await fetch(`/cursos/api/progress/${session?.user.id}/${module?.courseId}`);
        if (!response.ok) throw new Error('Failed to fetch progress');
        
        const data = await response.json();
        const moduleProgress = data.modules.find((m: any) => m.moduleId === module?.id);
        setProgress(moduleProgress?.lessons.length || 0);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    }
    if (module) void fetchProgress();
  }, [session?.user.id, module]);

  const markLessonAsComplete = async (lessonId: number) => {
    try {
      const response = await fetch('/cursos/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user.id,
          lessonId,
          moduleId: module?.id,
          courseId: module?.courseId
        })
      });
  
      if (response.ok) {
        setProgress(prev => Math.max(prev, activeLesson?.order ?? 0));
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
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
            {session?.user.role === 'admin' && (
              <li
                className="p-2 flex items-center cursor-pointer hover:bg-white/10 rounded-lg"
                onClick={() => {
                  setSelectedLesson(null);
                  setIsDrawerOpen(true);
                }}
              >
                <span className="pixelarticons--plus text-lg mr-2"></span>
                <h4>Adicionar Nova Aula</h4>
              </li>
            )}
          </ul>
        </div>
  
        <div className="w-3/4 max-h-[76%] p-4">
          {activeLesson ? (
            <>
              <div className="max-h-full min-h-full overflow-auto">
                <div className="flex justify-between items-center mb-8">
                  <h3 className={`${silkscreen.className} text-2xl font-bold`}>{activeLesson.title}</h3>
                  {session?.user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setSelectedLesson(activeLesson);
                        setIsDrawerOpen(true);
                      }}
                      className={`text-white flex items-center px-3 py-1 ${silkscreen.className} ${activeColorSet?.bg} bg-opacity-30 hover:bg-opacity-40 rounded-lg`}
                    >
                      <span className="pixelarticons--edit-box text-xl mr-3"></span>
                      Editar
                    </button>
                  )}
                </div>
                <div className="max-h-[76%] pl-4">
                  {activeLesson ? (
                    <>
                      <div className="max-h-full min-h-full overflow-auto">
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
                    <p>Selecione uma lição para começar</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p>Selecione uma lição para começar</p>
          )}
        </div>
      </div>
  
      <LessonsDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedLesson(null);
        }}
        onFormSubmit={refreshLessons}
        moduleId={parseInt(params.moduleId)}
        selectedLesson={selectedLesson}
      />
    </section>
  );
}

