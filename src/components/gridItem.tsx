/* eslint-disable @typescript-eslint/no-unused-vars */

import Link from "next/link"


export function GridItem({ name, id }: { name: string, id: string }) {

  return (
    <Link href={`/questoes/${name}`}
      className="card">
      <h2>{name}</h2>
    </Link>
  )
}