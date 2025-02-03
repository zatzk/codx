/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// components/cursosComponents/pathCard.tsx
'use client'
import { useColorContext } from "~/lib/colorContext";
import { Inter, Silkscreen } from "next/font/google";
import Link from "next/link";

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
    pathCourses?: any[];
  };
  isAdmin?: boolean;
  onEdit?: () => void;
}

export default function PathCard({ path, isAdmin, onEdit }: PathCardProps) {
  const {activeColorSet} = useColorContext();


  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    onEdit?.();
  };
  
  return (
    <Link href={`/cursos/${path.id}`} 
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
          relative
          group
          ${silkscreen.className}
      `} 
    >
      <div className="flex text-xs justify-between w-full">
        <p>path</p>
        <p className="">{path?.pathCourses?.length} cursos</p>
      </div>
      <h2 className={`text-xl mb-2`}>{path.title}</h2>
      <p className={`text-sm ${inter.className}`}>{path.description}</p>
      {isAdmin && (
        <button
          onClick={handleEditClick}
          className="relative bottom-3 right-3 p-2 rounded-md h-[37px] bg-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 top-[5px] left-[300px]"
        >
          <span className="pixelarticons--edit-box text-white text-xl"></span>
        </button>
      )}
    </Link>
  );
}