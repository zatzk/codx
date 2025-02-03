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
  onEdit?: () => void;
  isAdmin?: boolean;
}

export default function CourseCard({ 
  course, 
  completedLessons, 
  totalLessons, 
  onClick,
  session,
  onEdit,
  isAdmin 
}: CourseCardProps) {
  const { activeColorSet } = useColorContext();
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.();
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
        relative
        group
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

      {isAdmin && (
        <button
          onClick={handleEditClick}
          className="absolute top-2 right-2 p-2 rounded-md h-[37px] bg-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <span className="pixelarticons--edit-box text-white text-xl"></span>
        </button>
      )}
    </div>
  );
}