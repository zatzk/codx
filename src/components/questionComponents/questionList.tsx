/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// components/questionComponents/questionList.tsx
'use client'
import { useEffect, useState } from 'react';
import { QuestionCard } from './questionCard';
import { QuestionFinished } from './questionFinished';
import { QuestionsProgress } from './questionProgress';
import { useSession } from 'next-auth/react';

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
  description: string;
  questions: Question[];
}[];

type QuestionProgressType = 'know' | 'dontKnow' | 'skip' | 'reset';

export function QuestionList({ questionGroup }: { questionGroup: QuestionGroup[] }) {
  const { data: session } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [knowCount, setKnowCount] = useState(0);
  const [didNotKnowCount, setDidNotKnowCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const totalQuestions = questionGroup[0]?.questions?.length ?? 0;
  const currentQuestion = questionGroup[0]?.questions?.[currentQuestionIndex];
  

  useEffect(() => {
    if (session) {
      const fetchProgress = async () => {
        try {
          const response = await fetch(`/questoes/api/progress/${session.user.id}/${questionGroup[0]?.id}`);
          if (!response.ok) throw new Error('Network response was not ok');
          
          const data = await response.json();
          if (data) {
            setCurrentQuestionIndex(data.responses?.length || 0);
            setKnowCount(data.stats?.knowCount || 0);
            setDidNotKnowCount(data.stats?.didntKnowCount || 0);
            setSkippedCount(data.stats?.skipCount || 0);
          }
        } catch (error) {
          console.error('Failed to fetch progress:', error);
        }
      };
      void fetchProgress();
    }
  }, [session, questionGroup]);


  useEffect(() => {
    if (session) {
      const progress = {
        currentQuestionIndex,
        currentKnowCount: knowCount,
        currentDidntKnowCount: didNotKnowCount,
        currentSkipCount: skippedCount
      };
      localStorage.setItem(`progress_${session.user.id}_${questionGroup[0]?.id}`, JSON.stringify(progress));
    }
  }, [currentQuestionIndex, knowCount, didNotKnowCount, skippedCount, session, questionGroup]);

  // useEffect(() => {
  //     if (session) {
  //       const handleBeforeUnload = async () => {
  //         const progress = JSON.parse(localStorage.getItem(`progress_${session.user.id}_${questionGroup[0]?.id}`) ?? '{}');
  //         if (progress) {
  //           try {
  //             await fetch(`/questoes/api/progress/${session.user.id}/${questionGroup[0]?.id}`, {
  //               method: 'POST',
  //               headers: {
  //                 'Content-Type': 'application/json',
  //               },
  //               body: JSON.stringify(progress),
  //             });
  //             console.log('Saved progress on unload:', progress);
  //           } catch (error) {
  //             console.error('Failed to save user progress on unload:', error);
  //           }
  //         }
  //       };
  //       const handleBeforeUnloadWrapper = () => {
  //         void handleBeforeUnload();
  //       };
  //       window.addEventListener('beforeunload', handleBeforeUnloadWrapper);
  //       return () => {
  //         window.removeEventListener('beforeunload', handleBeforeUnloadWrapper);
  //       };
  //     }
  //   }, [session, questionGroup]);

  useEffect(() => {
    if (session) {
      const fetchProgress = async () => {
        try {
          const response = await fetch(`/questoes/api/progress/${session.user.id}/${questionGroup[0]?.id}`);
          if (!response.ok) throw new Error('Network response was not ok');
          
          const data = await response.json();
          if (data) {
            setCurrentQuestionIndex(data.responses?.length || 0);
            setKnowCount(data.stats?.knowCount || 0);
            setDidNotKnowCount(data.stats?.didntKnowCount || 0);
            setSkippedCount(data.stats?.skipCount || 0);
          }
        } catch (error) {
          console.error('Failed to fetch progress:', error);
        }
      };
      void fetchProgress();
    }
  }, [session, questionGroup]);
  
  // Update beforeunload handler
  const handleBeforeUnload = async () => {
    const progress = {
      responses: questionGroup[0]?.questions
        .slice(0, currentQuestionIndex)
        .map((q, idx) => ({
          questionId: q.id,
          questionText: q.question,
          response: getResponseType(idx),
          correct: false, // You'll need to implement actual correctness check
          timestamp: new Date()
        })),
      stats: {
        knowCount,
        didntKnowCount: didNotKnowCount,
        skipCount: skippedCount
      }
    };
  
    try {
      await fetch(`/questoes/api/progress/${session?.user.id}/${questionGroup[0]?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progress)
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };
  
  // Add helper function to determine response type
  const getResponseType = (index: number) => {
    // You'll need to track individual question responses to implement this properly
    return 'know'; // Simplified example
  };


    useEffect(() => {
      if (!session && currentQuestionIndex > 0) {
        setShowLoginMessage(true);
      }
    }, [currentQuestionIndex, session]);
  
    useEffect(() => {
      const resetLoginMessage = () => setShowLoginMessage(false);
      window.addEventListener('beforeunload', resetLoginMessage);
      return () => window.removeEventListener('beforeunload', resetLoginMessage);
    }, []);

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
      {showLoginMessage && (
        <div className="p-3 mt-1 bg-red-100 border rounded-md border-red-400 text-red-700">
          Seu progresso não foi salvo. Faça Login para salvar seu progresso.
        </div>
      )}
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
