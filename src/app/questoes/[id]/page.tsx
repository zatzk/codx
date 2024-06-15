/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
// app/questoes/[id]/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function Quizz() {
  const params = useParams<{name: string}>();

  const name = params.name;

  interface Questao {
    question: string;
    answer: string;
    topics: string[];
  }
  
  
  const [questao, setQuestao] = useState<Questao | null>(null);

  useEffect(() => {
    if (name) {
      async function fetchQuestao() {
        try {
          const response = await fetch(`/questoes/api/${name}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setQuestao(data);
        } catch (error) {
          console.error('Failed to fetch questao:', error);
        }
      }
      console.log('fetching questao:', name);
      fetchQuestao();
    }
  }, [name]);

  if (!questao) {
    return <div className='text-white'>Loading...</div>;
  }

  return (
    <div className='text-white'>
      <h1>{name}</h1>
      {/* {questao.questions && questao.questions.map(question => (
        <div key={question.id}>
          <h2>{question.question}</h2>
          <p>{question.answer}</p>
        </div>
      ))} */}
    </div>
  );
};

