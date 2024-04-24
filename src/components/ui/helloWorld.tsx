"use client"
import { useColorContext } from "../colorContext"

export function HelloWorld() {
  const { activeColorSet } = useColorContext()

  return (
    <div>
      <h1 className={`${activeColorSet?.secondary || 'text-pink-600'}`}>Hello World</h1>
    </div>
  )
}