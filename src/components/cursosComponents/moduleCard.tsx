/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { useColorContext } from '~/lib/colorContext';
import { Inter, Silkscreen } from "next/font/google";
import { Pencil } from 'lucide-react';

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface ModuleCardProps {
  module: {
    id: number;
    title: string;
    description: string;
    order: number;
    lessons: LessonProps[];
  };
  progress: number; 
  onClick: () => void;
  onEdit?: () => void;
}

interface LessonProps {
  id: number;
  title: string;
}

export default function ModuleCard({ module, progress, onClick, onEdit }: ModuleCardProps) {
  const {activeColorSet} = useColorContext();

  const handleClick = (e: React.MouseEvent) => {
    onClick();
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card's onClick
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
        w-[800px] 
        h-auto
        flex flex-col 
        justify-between
        items-start 
        cursor-pointer
        transition-all
        group
        relative
        ${silkscreen.className}
      `}
      onClick={handleClick}
    >
      {onEdit && (
        <button
          onClick={handleEditClick}
          className={`
            absolute
            top-4
            right-4
            p-2
            rounded-lg
            opacity-0
            group-hover:opacity-100
            transition-opacity
            hover:bg-white/10
          `}
        >
          <span className="pixelarticons--edit-box text-white text-xl"></span>
        </button>
      )}
      
      <div className="w-full flex justify-between items-center pb-2 mb-4 border-b">
        <h2 className="text-xl">{module.title}</h2>
        <div className="flex items-center gap-4">
        <p className="text-xs mr-9">
          {progress}/{module.lessons?.length || 0} completos
        </p>
        </div>
      </div>

      <div className="w-full">
        <p className={`${inter.className} text-sm text-gray-300 mb-4`}>
          {module.description}
        </p>
      </div>

      {module.lessons?.map((lesson, index) => (
        <div
          key={lesson.id}
          className={`flex text-sm w-full items-center mb-2 ${index < progress ? `${activeColorSet?.secondary}` : ''}`}
        >
          <span className="pixelarticons--book-open mr-3"></span> 
          <p className={`${inter.className}`}>{lesson.title}</p>
        </div>
      ))}
    </div>
  );
}