/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
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
}
interface LessonProps {
  id: number;
  title: string;
}

export default function ModuleCard({ module, progress, onClick }: ModuleCardProps) {
  const {activeColorSet} = useColorContext();

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
        ${silkscreen.className}
      `}
      onClick={onClick}
    >
      <div className="w-full flex justify-between items-center pb-2 mb-4 border-b">
        <h2 className="text-xl">{module.title}</h2>
        <p className="text-xs">{progress}/{module.lessons.length} completos</p>
      </div>
      {module.lessons.map((lesson, index) => (
        <div
          key={lesson.id}
          className={`flex text-sm w-full items-center mb-2 ${index < progress ? `${activeColorSet?.secondary}` : ''}`}
        >
          <span className="pixelarticons--book-open mr-3"></span> 
          <p className={`${inter.className}`}>{lesson.title}</p>
        </div>
      ))}
    </div>
  )
}
