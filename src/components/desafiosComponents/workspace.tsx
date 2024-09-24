/* eslint-disable @typescript-eslint/no-unused-vars */
//components/desafiosComponents/workspace.tsx
import React from 'react'
import Split from "react-split";
import { useState } from "react";
import { type DesafioProps } from '~/app/desafios/[id]/page';
import useWindowSize from "~/lib/useWindowSize";
import ProblemDescription from './problemDescription';
import Playground from './playground';

export default function Workspace({desafio}: {desafio: DesafioProps}) {
  const { width, height } = useWindowSize();
  const [solved, setSolved] = useState(false);
  return (
    <Split className='split mb-2' minSize={0}>
      <ProblemDescription desafio={desafio} />
      <div className=' rounded-lg'>
        <Playground desafio={desafio} />
      </div>
    </Split>
  )
}
