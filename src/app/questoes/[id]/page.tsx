/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/questoes/[id]/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { QuestionList } from '~/components/questionComponents/questionList';
import { QuestionLoader } from '~/components/questionComponents/questionLoader';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function Quizz() {
  const params = useParams<{id: string}>();
  const name = params.id;


  interface Question {
    id: number;
    question: string;
    answer: string;
    topics: string[];
    questionGroupId: number;
  }

  interface QuestionGroup {
    id: number;
    name: string;
    title: string;
    description: string;
    questions: Question[];
  }
  
  console.log('id:', name);
  
  const [questionGroup, setQuestionGroup] = useState<QuestionGroup[]  | null>(null);

  useEffect(() => {
    if (name) {
      async function fetchQuestao() {
        try {
          const response = await fetch(`/questoes/api/${name}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setQuestionGroup(data);
        } catch (error) {
          console.error('Failed to fetch questao:', error);
        }
      }
      fetchQuestao();
    }
  }, [name]);
  if (!questionGroup) {
    return <QuestionLoader />;
  }

  return (
  <section className={`font-sans ${inter.variable} flex w-full flex-col items-center mt-28 text-white`}>
    <div className="flex flex-col items-center mb-8">
      
      <Link href={'../questoes'} className='mb-4 mt-4 text-sm flex items-center text-gray-400 hover:text-white transition ease-in-out delay-50'>
      <span
        className='mr-2 mb-[2px] inline-block transform transition-transform group-hover:translate-x-[-2px]'
      >
        &larr;
      </span>
        <span>Voltar as questões</span> 
      </Link>
      <h1 className='text-5xl font-bold mb-4 mt-4'>{name} Quizz</h1>
      <p className='text-lg font-light mt-3'>Teste, avalie e melhore seu conhecimento com estas perguntas.</p>
    </div>
    <div className="mt-4">
      <QuestionList questionGroup={questionGroup} />
    </div>
  </section>
  );
};

