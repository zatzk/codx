/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
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

interface ModuleCardProps {
  module: {
    id: number;
    title: string;
    description: string;
    order: number;
    lessons: string[];
  };
  onClick: () => void;
  session: Session | null;
}

export default function ModuleCard({ module, onClick, session }: ModuleCardProps) {
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
      <h2 className="text-xl pb-2 border-b w-full">{module.title}</h2>
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
  )
}
