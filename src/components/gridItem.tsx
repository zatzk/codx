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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export function GridItem({ name, route }: { name: string, route: string }) {
  const {activeColorSet}: {activeColorSet: {cardBg: string}} = useColorContext();

  return (
    <Link href={`/${route}/${name}`}
      className={`
        ${activeColorSet?.cardBg} 
        ${silkscreen.className}
        hover:bg-opacity-30 
        bg-opacity-20 
        p-5 
        rounded-xl 
        h-24 
        w-[360px] 
        flex 
        items-center
      `}
    >
      <h1 className={`text-white text-md ml-5`}>{name}</h1>
    </Link>
    
  )
}