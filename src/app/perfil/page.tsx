/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
'use client'
import React, { useEffect } from 'react'
import { useSession, signOut } from "next-auth/react"
import Image from "next/image";
import { Inter, Silkscreen } from "next/font/google";
import { redirect } from 'next/navigation';
import { useColorContext } from "~/lib/colorContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const HeaderSection = ( { session }: { session: any }) => {
  const { activeColorSet } = useColorContext();
  return (
    <div className="flex justify-end items-center mb-4">
      <div>
        <button className={`${inter.className} ${activeColorSet?.borderButton} ${activeColorSet?.barHover} hover:bg-opacity-10 border py-2 px-6 rounded-lg mr-4`}>Editar</button>
        <button className={`${inter.className} ${activeColorSet?.cardBg} hover:bg-opacity-80 py-2 px-6 rounded-lg`} onClick={() => signOut()}>Logout</button>
      </div>
    </div>
  );
};

const LeftColumn = ( { session }: { session: any }) => {
  const { activeColorSet } = useColorContext();
  return (
    <div className="flex flex-col gap-4 w-[380px]">
      <div className='flex justify-center w-full'>
        <div className={`w-48 h-48 relative border rounded-full ${activeColorSet?.borderButton}`}>
          <Image
            src={session?.user?.image ?? ""}
            fill
            alt=""
            className="object-cover rounded-full"
          />
        </div>
      </div>
      <div>
        <h1 className={`text-lg ${silkscreen.className}`}>{session?.user?.name}</h1>
      </div>
      <div className='w-full h-48 relative border rounded-sm'>
        Badges
      </div>
      <div className='w-full h-48 relative border rounded-sm'>
      Leaderboard
      </div>
    </div>
  );
};

const RightColumn = () => {
  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      <div className='w-full h-52 relative border rounded-sm'>
        readme
      </div>
      <div className='w-full h-28 relative border rounded-sm'>
        Leveling
      </div>
      <div className='w-full h-44 relative border rounded-sm'>
        History
      </div>
      <div className='w-full h-44 relative border rounded-sm'>
        Activity
      </div>
      <div className='w-full h-20 relative border rounded-sm'>
        Continue
      </div>
    </div>
  );
};

export default function Perfil() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return; 
    if (!session) redirect('/'); 
  }, [session, status]);

  if (!session) return null;

  return (
    <section className={`flex w-full flex-col items-center mt-20 `}>
      <div className="w-2/3 flex pb-16 pt-12">
        <div className="w-full h-screen text-white p-4 flex flex-col">
          <HeaderSection session={session}/>
          <div className="flex flex-row gap-8">
            <LeftColumn session={session}/>
            <RightColumn />
          </div>
        </div>
      </div>
    </section>
  )
}