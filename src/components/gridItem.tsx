/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import Link from "next/link"
import { useColorContext } from "~/lib/colorContext";
import { Inter, Silkscreen } from "next/font/google";

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans"
});

interface GridItemProps {
  name: string;
  route: string;
  isAdmin?: boolean;
  onEdit?: () => void;
}

export function GridItem({ name, route, isAdmin, onEdit }: GridItemProps) {
  const {activeColorSet}: {activeColorSet: {cardBg: string}} = useColorContext();

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    onEdit?.();
  };

  return (
    <Link href={`/${route}/${name}`}
      className={`
        ${activeColorSet?.cardBg} 
        ${silkscreen.className}
        hover:bg-opacity-30 
        bg-opacity-20 
        p-6
        rounded-lg
        h-24 
        w-[360px] 
        flex 
        items-center
        relative
        group
      `}
    >
      <h1 className="text-white text-md ml-5">{name}</h1>
      {isAdmin && (
        <button
          onClick={handleEditClick}
          className="absolute bottom-3 right-3 p-2 rounded-md h-[37px] bg-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <span className="pixelarticons--edit-box text-white text-xl"></span>
        </button>
      )}
    </Link>
  )
}