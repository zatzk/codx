/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { useState } from 'react';
import { QuestionCard } from './questionCard';
import { QuestionFinished } from './questionFinished';
import { QuestionsProgress } from './questionProgress';

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
}[];

type QuestionProgressType = 'know' | 'dontKnow' | 'skip' | 'reset';

export function QuestionList({ questionGroup }: { questionGroup: QuestionGroup[] }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [knowCount, setKnowCount] = useState(0);
  const [didNotKnowCount, setDidNotKnowCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const totalQuestions = questionGroup[0]?.questions?.length ?? 0;
  const currentQuestion = questionGroup[0]?.questions?.[currentQuestionIndex];

  const handleQuestionStatus = (status: QuestionProgressType) => {
    if (status === 'know') setKnowCount(knowCount + 1);
    if (status === 'dontKnow') setDidNotKnowCount(didNotKnowCount + 1);
    if (status === 'skip') setSkippedCount(skippedCount + 1);

    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const resetProgress = (_type: QuestionProgressType | 'reset') => {
    setKnowCount(0);
    setDidNotKnowCount(0);
    setSkippedCount(0);
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
  };

  return (
    <div>
      <QuestionsProgress
        knowCount={knowCount}
        didNotKnowCount={didNotKnowCount}
        skippedCount={skippedCount}
        totalCount={totalQuestions}
        onResetClick={() => resetProgress('reset')}
      />
      {currentQuestionIndex < totalQuestions ? (
        <QuestionCard 
          question={currentQuestion!} 
          onStatusChange={handleQuestionStatus} 
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer} 
        />
      ) : (
        <QuestionFinished
          knowCount={knowCount}
          didNotKnowCount={didNotKnowCount}
          skippedCount={skippedCount}
          totalCount={totalQuestions}
          onReset={resetProgress}
        />
      )}
    </div>
  );
}
