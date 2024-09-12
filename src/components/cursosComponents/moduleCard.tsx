/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { type Session } from 'next-auth';
import { useColorContext } from '~/lib/colorContext';
import { Inter, Silkscreen } from "next/font/google";
import { lessons } from '~/server/db/schema';

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
  onClick: () => void;
  session: Session | null;
}
interface LessonProps {
  id: number;
  title: string;
}

export default function ModuleCard({ module, onClick, session }: ModuleCardProps) {
  const {activeColorSet} = useColorContext();
  console.log('module', module);

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
      <h2 className="text-xl pb-2 mb-4 border-b w-full">{module.title}</h2>
      {module.lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="flex text-sm w-full items-center mb-2"
        >
          <span className="pixelarticons--book-open mr-3"></span>
          <p className={`${inter.className}`}>{lesson.title}</p>
        </div>
      ))}
    </div>
  )
}
