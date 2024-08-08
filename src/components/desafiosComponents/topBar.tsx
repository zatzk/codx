import React from 'react'

interface TopBarProps {
  title: string;
}

export default function TopBar({title}: TopBarProps) {
  return (
    <div className='w-full flex items-center justify-center'>{title}</div>
  )
}
