/* eslint-disable react/no-danger-with-children */
'use client';
import { useEffect, useState } from 'react';
import { useColorContext } from "../../lib/colorContext";
import { markdownToHtml } from '../../lib/markdown';
import { CheckCircle, SkipForward, Sparkles } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  answer: string;
  topics: string[];
  questionGroupId: number;
}

interface QuestionCardProps {
  question: Question;

  onStatusChange: (status: 'know' | 'dontKnow' | 'skip') => void;
  showAnswer: boolean;
  setShowAnswer: (value: boolean) => void;
}

export function QuestionCard({ question, onStatusChange, showAnswer, setShowAnswer }: QuestionCardProps) {
  const {activeColorSet} = useColorContext();

  useEffect(() => {
    setShowAnswer(showAnswer); 
  }, [showAnswer, setShowAnswer]);
  
  return (
    <div className='flex flex-col items-center'>
      <div className={`flex flex-col mb-6 ${activeColorSet?.cardBg} bg-opacity-30 min-h-[400px] w-[600px] rounded-md`}>

      <div className={`h-full flex flex-grow flex-col mx-6 ${!showAnswer ? 'relative' : 'hidden'}`}>
          <div className='flex flex-grow h-full justify-center items-center'>
            <h2 className='text-3xl text-center ' dangerouslySetInnerHTML={{__html: markdownToHtml(question.question, false)}}/>
          </div> 
          <div className='flex justify-center items-center mb-5 hover:opacity-70 transition ease-in-out delay-50'>
            <button onClick={() => setShowAnswer(true)}>Clique para mostrar a resposta</button>
          </div>
        </div>


        <div className={`h-full flex flex-grow flex-col mx-6 ${showAnswer ? 'relative' : 'hidden'}`}>
          <span className='text-center mt-5 text-gray-400'>{question.topics[0]} · {question.topics[1]}</span>
          <div className='flex flex-grow h-full justify-center items-center'>
            <p className='text-center' dangerouslySetInnerHTML={{__html: markdownToHtml(question.answer, false)}}/>
          </div> 
          <div className='flex justify-center items-center mb-5 hover:opacity-70 transition ease-in-out delay-50'>
            <button onClick={() => setShowAnswer(false)}>Esconder a resposta</button>
          </div>
        </div>        
      </div>
      <div className='flex mb-10 items-center justify-between w-[600px]'>
          <button 
            className={`${activeColorSet?.cardBg} rounded-md px-[1rem] pr-24 py-3 flex items-center hover:bg-opacity-80`} 
            onClick={() => {onStatusChange('know'); setShowAnswer(false)}}
          >
            <CheckCircle className='mr-1 h-4'/>
            <span>Já Sei</span>
          </button>
          <button 
            className={`${activeColorSet?.cardBg} rounded-md px-[1rem] pr-24 py-3 flex items-center hover:bg-opacity-80`} 
            onClick={() => {onStatusChange('dontKnow'); setShowAnswer(false)}}
          >
            <Sparkles className='mr-1 h-4'/>
            <span>Não Sei</span>
          </button>
          <button 
            className={`${activeColorSet?.cardBg} rounded-md px-[1rem] pr-24 py-3 flex items-center hover:bg-opacity-80`} 
            onClick={() => {onStatusChange('skip'); setShowAnswer(false)}}
          >
            <SkipForward className='mr-1 h-4'/>
            <span>Pular</span>
          </button>
      </div>
    </div>
  );
}
