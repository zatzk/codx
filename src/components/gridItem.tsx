/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import Link from "next/link"
import { useColorContext } from "~/lib/colorContext";

export function GridItem({ name }: { name: string }) {
  const {activeColorSet}: {activeColorSet: {cardBg: string}} = useColorContext();

  return (
    <Link href={`/questoes/${name}`}
      className={`${activeColorSet?.cardBg} hover:bg-opacity-30 bg-opacity-20 rounded-md h-24 w-[360px] flex items-center`}>
      <h1 className={`text-white text-md ml-5`}>{name}</h1>
    </Link>
  )
}