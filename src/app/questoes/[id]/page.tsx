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
import { SimplePagHeader } from '~/components/simplePageHeader';

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

  console.log('questionGroup:', questionGroup);

  return (
  <section className={`font-sans ${inter.variable} flex w-full flex-col items-center mt-28 text-white`}>
    <div className="flex items-center justify-center lg:w-2/3 md:w-full mb-6"> 
      <SimplePagHeader title={`${name} Quizz`} description="" />
    </div>

    <div className="">
      <QuestionList questionGroup={questionGroup} />
    </div>
  </section>
  );
};

