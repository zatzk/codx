/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import React from 'react'
import { type DesafioProps } from '~/app/desafios/[id]/page';
import { useColorContext } from '~/lib/colorContext';
import { Inter, Silkscreen } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

export default function ProblemDescription({desafio}: {desafio: DesafioProps}) {
  const {activeColorSet} = useColorContext();
  
  return (
    <div className='rounded-lg border'>
      <div className={`${activeColorSet?.bg} ${silkscreen.className} bg-opacity-50 rounded-t-lg h-9 items-center flex`}>
        <div className='ml-4 text-sm'>Descrição</div>
      </div>
      <div>
        <div className='flex items-center justify-between p-3'>
          <div className={`text-md ${inter.className}`}>{desafio.title}</div>
          <div className={`flex items-center ${activeColorSet?.bg} px-3 py-1 rounded-2xl`}>
            <div className='text-sm'>{desafio.difficulty}</div>
          </div>
        </div>
        <div className='p-3'>
          {desafio.problemStatement}
        </div>
      </div>
      <div>

      </div>
    </div>
  )
}
