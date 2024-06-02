/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"
import { useColorContext } from "../style/colorContext";

export function HelloWorld() {
  const { activeColorSet } = useColorContext()

  return (
    <div>
      <h1 className={`${activeColorSet?.secondary}`}>Hello World</h1>
    </div>
  )
}