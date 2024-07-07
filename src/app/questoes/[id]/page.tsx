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
    <div className="flex w-[600px] flex-col items-left mb-6"> 
      <div className='flex gap-2'>
        <Link href={'../../page.tsx'} className='text-sm flex items-center text-gray-400 hover:text-white transition ease-in-out delay-50'>
          <span>codx</span> 
        </Link>
        <span className='text-sm'>/</span>
        <Link href={'../questoes'} className='text-sm flex items-center text-gray-400 hover:text-white transition ease-in-out delay-50'>
          <span>questões</span> 
        </Link>
      </div>    
      <h1 className='text-3xl font-bold mt-1'>{name} Quizz</h1>
    </div>

    <div className="">
      <QuestionList questionGroup={questionGroup} />
    </div>
  </section>
  );
};

