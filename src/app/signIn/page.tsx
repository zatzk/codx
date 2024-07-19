/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/app/signIn/page.tsx
'use client'
import React from 'react'
import { useSession, signIn } from "next-auth/react"
import { Inter } from "next/font/google";
import { Silkscreen } from "next/font/google";
import { useColorContext } from '~/lib/colorContext';
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { redirect } from 'next/navigation'


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

export default function SignIn() {
  const { data: session } = useSession()
  const {activeColorSet} = useColorContext();

  if (session) {
    redirect('/')
  }
  return (
    <div className='w-full h-screen flex justify-center items-center'>
    <div className={`w-2/6 h-2/3 ${activeColorSet?.cardGradient} border ${activeColorSet?.borderButton} ${silkscreen.className} rounded-md text-white flex flex-col justify-center items-center`}>
        <p className="text-2xl font-bold mb-6">Sign In</p>
        <div className={`flex flex-col ${inter.className}`}>
          <button className={`bg-blue-500 hover:bg-opacity-80 flex items-center py-2 px-5 rounded-md mb-2`} onClick={() => signIn('google')}>
            <FaGoogle className="mr-3"/>
            <p>Continue with google</p>
          </button>
          <button className={`bg-black hover:bg-slate-900 flex items-center border-gray-300 border py-2 px-5 rounded-md mb-2`} onClick={() => signIn('github')}>
            <FaGithub className="mr-3"/>
            Continue with github
          </button>
        </div>
    </div>
    </div>
  )
}
