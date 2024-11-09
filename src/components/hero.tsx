/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"
import { useColorContext } from "~/lib/colorContext";
import { Inter, Silkscreen } from 'next/font/google';
import { useSession, signIn, signOut } from "next-auth/react"
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
  const { data: session } = useSession()


  return (
    <div className=" flex flex-col absolute justify-center items-center h-screen w-screen bg-[radial-gradient(circle,transparent_50%,#000000_200%)] ">
      <div className="flex flex-col absolute justify-center items-center mb-32">

        <div className="flex flex-col justify-center items-center mb-16">
          <h1 
            style={{ textShadow: '0 20px 400px #ffffff;', filter: 'drop-shadow(0 1.2px 1.2px rgba(0, 0, 0, 0.8))' }} 
            className={`${inter.className} cursor-default drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-extrabold xl:text-9xl lg:text-8xl md:text-6xl sm:text-6xl text-5xl mb-1 text-white`}>
              Aprendizado
            </h1>
          <h1 
            style={{ textShadow: '3px 3px 2px #ffffff;', filter: 'drop-shadow(0 1.2px 1.2px rgba(0, 0, 0, 0.8))' }} 
            className={`${inter.className} text-opacity-50 cursor-default font-extrabold xl:text-9xl lg:text-8xl md:text-6xl sm:text-6xl text-5xl ${activeColorSet?.secondary}`}>
              e diversão
          </h1>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center mb-10">
          <p style={{ boxShadow: '0 0 120px #00fd37' }} className={`text-xl px-1 cursor-default text-green-300 bg-green-800 rounded hover:text-white focus:text-white hover:bg-green-500 mr-2 ${silkscreen.className}`}>aprender</p>
          <span className="text-4xl text-gray-400 mr-2">·</span>
          <p style={{ boxShadow: '0 0 120px #0065fd' }} className={`text-xl px-1 cursor-default  text-blue-300 bg-blue-800 rounded hover:text-white focus:text-white hover:bg-blue-500  mr-3 ${silkscreen.className}`}>praticar</p>
          <span className="text-4xl text-gray-400 mr-2">·</span>
          <p style={{ boxShadow: '0 0 120px #f9fd00' }} className={`text-xl px-1 cursor-default text-yellow-300 bg-yellow-800 rounded hover:text-white focus:text-white hover:bg-yellow-500  ${silkscreen.className}`}>desenvolver</p>
        </div>
        {session ? (
          ''
        ) : (  
          <Link href={'/signin'} className={`${silkscreen.className} ${activeColorSet?.bg} ${activeColorSet?.borderButton} text-xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-white hover:bg-opacity-20 flex items-center border-gray-300 border-2 py-2 px-5 rounded-full mb-2`}>
            entrar
          </Link>
        )}

      </div>
    </div>
  )
}