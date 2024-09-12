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
  id: number;
  title: string;
  lessons: Lesson[];
}

export default function ModuleLessonsPage({ params }: { params: { moduleId: string } }) {
  const [module, setModule] = useState<Module | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const { data: session } = useSession();
  const {activeColorSet} = useColorContext();

  useEffect(() => {
    async function fetchModule() {
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
      }
    }

    fetchModule();
  }, [params.moduleId]);

  const markLessonAsComplete = async (lessonId: number) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch('/cursos/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          lessonId: lessonId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark lesson as complete');
      }

      // Update UI to reflect completion
      // This could be updating a state variable or re-fetching the module data
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
    }
  };

  console.log('module', module);

  if (!module) {
    return <div>Loading...</div>;
  }

  // Sort lessons by order
  const sortedLessons = [...module.lessons].sort((a, b) => a.order - b.order);

  return (
    // <section className={`${inter.variable} ${activeColorSet?.secondary} flex w-full flex-col items-center mt-20 `}>
    //   <SimplePagHeader title={course.title} description={course.description} />
    //   <div className="w-full flex pb-16 pt-12">
    //     <div className="ml-auto mr-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    //       <div className="grid md:grid-cols-1 gap-x-12 gap-y-6 xs:grid-cols-1">
    //         {sortedModules.map((module) => (
    //           <ModuleCard
    //             key={module.id}
    //             module={module}
    //             onClick={() => handleModuleClick(module.id)}
    //             session={session}
    //           />
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </section>


    <section className={`${inter.variable} ${activeColorSet?.secondary} flex w-full text-white flex-col items-center mt-20 `}>
      <SimplePagHeader title={module.title} description={module.description} />
      <div className="w-4/5 h-screen flex flex-row mt-10">
        <div className={`w-[430px] h-[90%] ${activeColorSet?.bg} bg-opacity-20 rounded-2xl`}>
          <ul className="overflow-auto p-6">
            {sortedLessons.map((lesson) => (
              <li
                key={lesson.id}
                className={`cursor-pointer p-2 flex items-center`}
                onClick={() => setActiveLesson(lesson)}
              >
                <span className="pixelarticons--circle text-lg mr-2"></span>
                <h4 className={`${activeLesson?.id === lesson.id ? 'border-b opacity-90' : ''}`}>{lesson.title}</h4>
              </li>
            ))}
          </ul>
        </div>


        <div className="w-3/4 p-4 ml-36">
          {activeLesson ? (
            <>
              <h3 className={`${silkscreen.className} text-2xl font-bold mb-8`}>{activeLesson.title}</h3>
              {activeLesson.videoUrl && (
                <div className="mb-4">
                  <video src={activeLesson.videoUrl} controls className="w-full" />
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: activeLesson.content }} />

              <button
                className={`mt-4 text-white flex items-center px-3 py-1 ${silkscreen.className} ${activeColorSet?.bg} bg-opacity-30 hover:bg-opacity-40 rounded-lg`}
                onClick={() => markLessonAsComplete(activeLesson.id)}
              >
                <span className="pixelarticons--check text-xl mr-3"></span>
                Completar
              </button>
            </>
          ) : (
            <p>Select a lesson to begin</p>
          )}
        </div>
      </div>
    </section>
  );
}