'use client'
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';

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

  if (!module) {
    return <div>Loading...</div>;
  }

  // Sort lessons by order
  const sortedLessons = [...module.lessons].sort((a, b) => a.order - b.order);

  return (
    <div className="flex">
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">{module.title}</h2>
        <ul>
          {sortedLessons.map((lesson) => (
            <li
              key={lesson.id}
              className={`cursor-pointer p-2 ${activeLesson?.id === lesson.id ? 'bg-blue-200' : ''}`}
              onClick={() => setActiveLesson(lesson)}
            >
              {lesson.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 p-4">
        {activeLesson ? (
          <>
            <h3 className="text-2xl font-bold mb-4">{activeLesson.title}</h3>
            {activeLesson.videoUrl && (
              <div className="mb-4">
                <video src={activeLesson.videoUrl} controls className="w-full" />
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => markLessonAsComplete(activeLesson.id)}
            >
              Mark as Complete
            </button>
          </>
        ) : (
          <p>Select a lesson to begin</p>
        )}
      </div>
    </div>
  );
}