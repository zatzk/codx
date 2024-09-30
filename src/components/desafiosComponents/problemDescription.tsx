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
  console.log('desafio', desafio);
  
  return (
    <div className='rounded-lg border'>
      <div className={`${activeColorSet?.bg} ${silkscreen.className} bg-opacity-50 rounded-t-lg h-9 items-center flex`}>
        <span className="pixelarticons--list-box ml-4 mr-2"></span>
        <div className=' text-sm'>Description</div>
      </div>
      <div className='overflow-auto max-h-[72vh]'>
        <div className='flex items-center justify-between mt-2 p-3'>
          <div className={`text-md ${inter.className}`}>{desafio.title}</div>
          <div className={`flex items-center ${activeColorSet?.bg} px-3 py-1 mr-2 rounded-2xl`}>
            <div className='text-sm'>{desafio.difficulty}</div>
          </div>
        </div>
        <div className='p-3'>
          <p className='text-sm' dangerouslySetInnerHTML={{__html: desafio?.problemStatement}}></p>
          {(desafio?.examples || []).map((example, index) => (
            <div key={index} className='text-sm '>
              <p className='text-sm mt-5 mb-1 p-1'>Example {index + 1}:</p>
              <div className='border rounded-lg max-w-[98%] p-3'>
                <p className='text-sm'>{example.inputText}</p>
                <p className='text-sm'>{example.outputText}</p>
                <p className='text-sm'>{example.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
