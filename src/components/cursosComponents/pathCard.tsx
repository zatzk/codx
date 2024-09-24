/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// components/cursosComponents/pathCard.tsx
'use client'
import { useColorContext } from "~/lib/colorContext";
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

interface PathCardProps {
  path: {
    id: number;
    title: string;
    description: string;
    pathCourses: any;
  };
  onClick: () => void;
}

export default function PathCard({ path, onClick }: PathCardProps) {
  const {activeColorSet} = useColorContext();
  
  return (
    <div 
      className={`
          ${activeColorSet?.cardBg} 
          text-white 
          hover:bg-opacity-30 
          bg-opacity-20 
          p-5 
          rounded-2xl 
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
      <div className="flex text-xs justify-between w-full">
        <p>path</p>
        <p className="">{path.pathCourses.length} cursos</p>
      </div>
      <h2 className={`text-xl mb-2`}>{path.title}</h2>
      <p className={`text-sm ${inter.className}`}>{path.description}</p>
    </div>
  );
}