/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"
import { Menu } from "lucide-react"
import { Silkscreen } from "next/font/google";
import { colorSets } from '~/components/style/colors';
import { useColorContext } from "~/components/colorContext";


const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});


export function TopNav() {
  const {activeColorSet, setActiveColorSet} = useColorContext();



  return (
  <div className={` flex justify-center font-sans ${silkscreen.variable} z-10 xl:max-w-6xl lg:max-w-3xl max-h-[50px] px-24 rounded-full absolute text-white`}>
    <div className="flex items-center justify-between text-xs p-1 w-[1440px]">
 
      <div className="flex items-center text-xs p-1">
        <div className="border-none rounded-full p-3 hover:cursor-pointer">
          <button className={`mx-2 ${activeColorSet?.secondary || 'text-white'}`}>
            aprenda
          </button>
        </div>
        <div className="border-none rounded-full p-3 hover:cursor-pointer">
          <button className={`mx-2 ${activeColorSet?.secondary || 'text-white'}`}>
            pratique
          </button>
        </div>
      </div>

      <div className="flex items-center font-bold text-lg p-1">
        <div className="border-none flex items-center rounded-full p-3 hover:cursor-pointer">
          <span 
          className="mx-1 text-pink-600"
          onMouseEnter={() => setActiveColorSet(colorSets.pink)}
          >
            c
          </span>
          <span 
            className="mx-1 text-sky-600" 
            onMouseEnter={() => setActiveColorSet(colorSets.blue)}
            >
            o
          </span>
          <span 
            className="mx-1 text-green-700"
            onMouseEnter={() => setActiveColorSet(colorSets.green)}
          >
            d
          </span>
          <span 
            className="mx-1 text-orange-500"
            onMouseEnter={() => setActiveColorSet(colorSets.orange)}
            >
            x
          </span>
        </div>
      </div>

      <div className="flex items-center text-xs p-1 text-white">
        <button className={`border-${activeColorSet?.primary} hover:border hover:border-${activeColorSet?.primary} hover:cursor-pointer rounded-full p-3 mr-6`}>
          <span className={`mx-2 ${activeColorSet?.secondary || 'text-white'}`}>
            Sign up
          </span>
        </button>
        <button className="hover:border hover:cursor-pointer hover:border-[#30a46c] rounded-full p-3">
          <Menu className={`mx-3 size-4 ${activeColorSet?.secondary || 'text-white'}`}/>
        </button>
      </div>
    </div>
  </div>
  );
}

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-screen h-screen flex justify-center">
      <TopNav/>
      {children}
    </main>
)
}