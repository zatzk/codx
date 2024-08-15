/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react'
import { useColorContext } from '~/lib/colorContext';

interface TopBarProps {
  title: string;
}

export default function TopBar({title}: TopBarProps) {
  const {activeColorSet} = useColorContext();

  return (
    <div className={`w-full flex items-center justify-start rounded-lg h-10 mb-3 `}>
      <div className='ml-3'>
        Desafios List
      </div>
    </div>
  )
}
