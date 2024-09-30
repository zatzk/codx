/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/desafios/[id]/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Inter } from 'next/font/google';

import TopBar from '~/components/desafiosComponents/topBar';
import Workspace from '~/components/desafiosComponents/workspace';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export interface DesafioProps {
	id: string;
	title: string;
  functionName: string;
	problemStatement: string;
	examples: ExamplesProps[];
  testCases: TestCaseProps[];
	starterCode: string;
  difficulty: string;
  category: string;
}

export interface ExamplesProps {
  id: string;
  inputText: string;
  outputText: string;
  explanation: string;
}

export interface TestCaseProps {
  target: string | null;
  id: string;
  input: string;
  expectedOutput: string;
}

export default function Desafio() {
  const [desafio, setDesafio] = useState({} as DesafioProps);
  const params = useParams<{id: string}>();
  const name = params.id;

  

  useEffect(() => {
    if (name) {
      async function fetchDesafio() {
        try {
          const response = await fetch(`/desafios/api/${name}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('Data fetched successfully:', data[0]);
          setDesafio(data[0]);
        } catch (error) {
          console.error('Failed to fetch desafio:', error);
        }
      }
      fetchDesafio();
    }
  }, [name]);


  return (
  <section className={`font-sans ${inter.variable} w-[98%] mt-28 text-white`}>
    <TopBar title={desafio.title}/>
    <Workspace desafio={desafio}/>
  </section>
  );
};

