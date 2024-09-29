/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
'use client'
import { useColorContext } from '~/lib/colorContext';
import { Silkscreen } from "next/font/google";


const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});


export default function PreferenceNav() {
  const {activeColorSet} = useColorContext();

  return (
    <div className=' flex items-center min-h-8 h-8 border-b'>
      <h1 className={`${activeColorSet?.secondary} ${silkscreen.className} text-xs ml-2`}>JavasCript</h1>
      <span className="pixelarticons--chevron-down text-lg ml-2"></span>
    </div>
  )
}
