/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"
import { Menu } from "lucide-react"
import { Inter, Silkscreen } from "next/font/google";
import { colorSets } from '~/components/style/colors';
import { useColorContext } from "~/components/colorContext";
import { motion } from "framer-motion";
import { useState } from "react";

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});


export function TopNav() {
  const {activeColorSet, setActiveColorSet} = useColorContext();
  const [isAprendaHover, toggleAprendaHover] = useState(false);
  const [isPratiqueHover, togglePratiqueHover] = useState(false);
  console.log('activecolorset',activeColorSet)


  const subMenuAnimate = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.5
      },
      display: "block"
    },
    exit: {
      opacity: 0,
      rotateX: -15,
      transition: {
        duration: 0.5,
        delay: 0.1
      },
      transitionEnd: {
        display: "none"
      }
    }
  };


  return (
  <div className={` flex justify-center font-sans ${silkscreen.variable} z-10 xl:max-w-6xl lg:max-w-3xl max-h-[60px] px-24 rounded-full absolute text-white`}>
    <div className="flex items-center justify-between text-xs p-1 w-[1440px]">
 
      <div className="flex items-center text-xs p-1">
        <div className="border-none rounded-full p-3 hover:cursor-pointer">
          <motion.div
            className={`mx-2 ${activeColorSet?.secondary || 'text-white'}`}
            onHoverStart={() => toggleAprendaHover(true)}
            onHoverEnd={() => toggleAprendaHover(false)}
          >
            <a className="hover:text-white">aprender</a>
            <motion.div
              className={`absolute ${activeColorSet?.bg} origin-[50%_-30px] px-3 pt-3 rounded-md top-[40px]`}
              initial="exit"
              animate={isAprendaHover  ? "enter" : "exit"}
              variants={subMenuAnimate}
            >
              <div className="absolute origin-[0_0] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] inset-0" />
              <div className={`flex flex-col`}>
                <a href="/trilhas" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded text-white`}>Trilhas</a>
                <a href="/cursos" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded text-white`}>Cursos</a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="border-none rounded-full p-3 hover:cursor-pointer">
        <motion.div
            className={`mx-2 ${activeColorSet?.secondary || 'text-white'}`}
            onHoverStart={() => togglePratiqueHover(true)}
              onHoverEnd={() => togglePratiqueHover(false)}
          >
            <a className="hover:text-white">praticar</a>
            <motion.div
              className={`absolute ${activeColorSet?.bg} origin-[50%_-30px] px-3 pt-3 rounded-md top-[40px]`}
              initial="exit"
              animate={isPratiqueHover  ? "enter" : "exit"}
              variants={subMenuAnimate}
            >
              <div className="absolute origin-[0_0] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] inset-0" />
              <div className={`flex flex-col`}>
                <a href="/desafios" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded text-white`}>Desafios</a>
                <a href="/questoes" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded text-white`}>Questões</a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center font-bold text-lg p-1">
        <div className="border-none flex items-center rounded-full p-3 hover:cursor-pointer">
          <a 
          href="/"
          className="mx-1 text-pink-600"
          onMouseEnter={() => setActiveColorSet(colorSets.pink)}
          >
            c
          </a>
          <a 
            href="/"
            className="mx-1 text-sky-600" 
            onMouseEnter={() => setActiveColorSet(colorSets.sky)}
            >
            o
          </a>
          <a 
            href="/"
            className="mx-1 text-green-600"
            onMouseEnter={() => setActiveColorSet(colorSets.green)}
          >
            d
          </a>
          <a 
            href="/"
            className="mx-1 text-orange-500"
            onMouseEnter={() => setActiveColorSet(colorSets.orange)}
            >
            x
          </a>
        </div>
      </div>
      
      <div className="flex items-center justify-center text-xs p-1 text-white">
        <button className={`flex items-center justify-center ${activeColorSet?.borderButton} hover:border hover:${activeColorSet?.border} hover:cursor-pointer rounded-full p-3 mr-6`}>
          <span className={`flex items-center justify-center mx-2 hover:text-white ${activeColorSet?.secondary}`}>
            Sign in
          </span>
        </button>
        <button className={`flex items-center justify-center ${activeColorSet?.borderButton} hover:border hover:cursor-pointer rounded-full p-3`}>
          <Menu className={`mx-3 size-4 text-white`}/>
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