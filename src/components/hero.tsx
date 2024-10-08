/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"
import { useColorContext } from "~/lib/colorContext";
import { Inter, Silkscreen } from 'next/font/google';
import Link from "next/link";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const silkscreen = Silkscreen({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
});

export function Hero() {
  const { activeColorSet } = useColorContext()


  return (
    <div className="flex flex-col justify-center items-center h-screen mb-32">
      <div className="flex flex-col justify-center items-center mb-16">
        <h1 className={`${inter.className} font-extrabold xl:text-9xl lg:text-8xl md:text-6xl mb-3 text-white`}>Aprendizado</h1>
        <h1 className={`${inter.className} font-extrabold xl:text-9xl lg:text-8xl md:text-6xl ${activeColorSet?.secondary}`}>e diversão</h1>
      </div>

      <div className="flex justify-center items-center mb-10">
        <p className={`text-xl cursor-default text-green-300 bg-green-800 rounded hover:text-white hover:bg-green-500 mr-2 ${silkscreen.className}`}>aprender</p>
        <span className="text-4xl text-gray-400 mr-2">·</span>
        <p className={`text-xl cursor-default  text-blue-300 bg-blue-800 rounded hover:text-white hover:bg-blue-500  mr-3 ${silkscreen.className}`}>praticar</p>
        <span className="text-4xl text-gray-400 mr-2">·</span>
        <p className={`text-xl cursor-default text-yellow-300 bg-yellow-800 rounded hover:text-white hover:bg-yellow-500  ${silkscreen.className}`}>desenvolver</p>
      </div>

      <Link href={'/signin'} className={`${silkscreen.className} ${activeColorSet?.bg} ${activeColorSet?.borderButton} text-xl text-white hover:bg-opacity-80 flex items-center border-gray-300 border-2 py-2 px-5 rounded-full mb-2`}>
        entrar
      </Link>
    </div>
  )
}