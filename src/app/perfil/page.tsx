/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useEffect } from 'react'
import { useSession, signOut } from "next-auth/react"
import Image from "next/image";
import { Inter } from "next/font/google";
import { Silkscreen } from "next/font/google";
import { redirect } from 'next/navigation';


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});
export default function Perfil() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return; 
    if (!session) redirect('/'); 
  }, [session, status]);

  if (!session) return null;

  return (
    <div className="w-full h-screen text-white flex flex-col justify-center items-center">
        <div className="w-44 h-44 relative mb-4">
        <Image
          src={session?.user?.image ?? ""}
          fill
          alt=""
          className="object-cover rounded-full"
        />
        </div>
        <p className={`text-2xl mb-2 ${inter.className}`}>Welcome <span className="font-bold">{session?.user?.name}</span>. Signed In As</p>
        <p className={`font-bold mb-4 ${inter.className}`}>{session?.user?.email}</p>
        <button className={`bg-red-600 ${inter.className} py-2 px-6 rounded-md`} onClick={() => signOut()}>Sign out</button>
      </div>
  )
}
