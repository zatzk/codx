// components/CourseCard.tsx
import { type Session } from 'next-auth';
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
  progress?: {
    courseId: number;
    currentModuleIndex: number;
    currentLessonIndex: number;
  };
  onClick: () => void;
  session: Session | null;
}

export default function CourseCard({ course, onClick, progress }: CourseCardProps) {
  const { activeColorSet } = useColorContext();
  console.log('progress inside card', progress);
  
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
      {progress && (
        <span>Current Lesson Index: {progress.currentLessonIndex}</span>
      )}
      {/* {progress !== null && (
        <div className="mt-2">
          <div className={`rounded-full h-2.5 ${activeColorSet.bg}`}>
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs mt-1">{progress}% complete</p>
        </div>
      )} */}
    </div>
  );
}