/* eslint-disable @typescript-eslint/no-unused-vars */
//components/desafiosComponents/workspace.tsx
import React, { useState, useEffect } from 'react';
import Split from "react-split";
import { type DesafioProps } from '~/app/desafios/[id]/page';
import ProblemDescription from './problemDescription';
import Playground from './playground';

const Workspace = ({ desafio }: { desafio: DesafioProps }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWindowSize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    // Initial check
    checkWindowSize();

    // Add event listener
    window.addEventListener('resize', checkWindowSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkWindowSize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 mb-2">
        <div className="w-full h-[calc(50vh-80px)] overflow-auto">
          <ProblemDescription desafio={desafio} />
        </div>
        <div className="w-full h-[calc(50vh-80px)]">
          <Playground desafio={desafio} />
        </div>
      </div>
    );
  }

  return (
    <Split className='split mb-2' minSize={0}>
      <ProblemDescription desafio={desafio} />
      <div className='rounded-lg'>
        <Playground desafio={desafio} />
      </div>
    </Split>
  );
};

export default Workspace;
