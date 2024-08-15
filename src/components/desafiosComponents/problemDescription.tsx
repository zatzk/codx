/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import React from 'react'
import { type DesafioProps } from '~/app/desafios/[id]/page';
import { useColorContext } from '~/lib/colorContext';


export default function ProblemDescription({desafio}: {desafio: DesafioProps}) {
  const {activeColorSet} = useColorContext();
  
  return (
    <div className='rounded-lg bg-[#262626]'>
      <div className={`${activeColorSet?.bg} rounded-t-lg h-9 items-center flex`}>
        <div className='ml-3'>Descrição</div>
      </div>
      <div>
        <div className='flex items-center justify-between p-3'>
          <div className='text-lg font-bold'>{desafio.title}</div>
          <div className='text-sm'>{desafio.difficulty}</div>
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
