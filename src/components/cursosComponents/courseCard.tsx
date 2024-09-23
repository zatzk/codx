/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  completedLessons: number;
  totalLessons: number;
  onClick: () => void;
  session: Session | null;
}

export default function CourseCard({ course, completedLessons, totalLessons, onClick }: CourseCardProps) {
  const { activeColorSet } = useColorContext();

  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

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

      <div className="mt-2 w-full">
        <div className="rounded-full h-2.5 bg-gray-300">
          <div 
            className={`${activeColorSet?.bg} h-2.5 rounded-full`} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs mt-1">{progressPercentage.toFixed(1)}% complete</p>
      </div>
    </div>
  );
}
