// components/CourseCard.tsx
import { type Session } from 'next-auth';
import { useState, useEffect } from 'react';
import { useColorContext } from '~/lib/colorContext';
import { Inter, Silkscreen } from "next/font/google";

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
    modules: { id: number }[];
  };
  onClick: () => void;
  session: Session | null;
}

export default function CourseCard({ course, onClick, session }: CourseCardProps) {
  const [progress, setProgress] = useState<number | null>(null);
  const { activeColorSet } = useColorContext();

  useEffect(() => {
    if (session?.user?.id) {
      fetchProgress();
    }
  }, [session, course.id]);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/cursos/api/progress?userId=${session.user.id}&courseId=${course.id}`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  };

  return (
    <div
    className={`
      ${activeColorSet?.cardBg} 
          text-white 
          hover:bg-opacity-30 
          bg-opacity-20 
          p-5 rounded-2xl 
          w-[380px] 
          h-[260px] 
          flex flex-col 
          justify-between
          items-start 
          cursor-pointer
          ${silkscreen.className}
  `} 
      onClick={onClick}
    >
      <p className='text-xs'>{course.modules.length} Modules</p>
      <h2 className="text-xl mb-2">{course.title}</h2>
      <p className="mb-4">{course.description}</p>
      {progress !== null && (
        <div className="mt-2">
          <div className={`rounded-full h-2.5 ${activeColorSet.bg}`}>
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs mt-1">{progress}% complete</p>
        </div>
      )}
    </div>
  );
}