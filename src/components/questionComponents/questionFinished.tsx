/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { useColorContext } from "~/lib/colorContext";

interface QuestionFinishedProps {
  knowCount: number;
  didNotKnowCount: number;
  skippedCount: number;
  totalCount: number;
  onReset: (type: 'know' | 'dontKnow' | 'skip' | 'reset') => void;
}

export function QuestionFinished({
  knowCount,
  didNotKnowCount,
  skippedCount,
  totalCount,
  onReset
}: QuestionFinishedProps) {
  const {activeColorSet} = useColorContext();
  return (

    <div className='flex flex-col items-center'>
      <div className={`flex flex-col mb-6 ${activeColorSet?.cardBg} bg-opacity-30 min-h-[400px] w-[600px] rounded-md`}>

        <div className={`h-full flex flex-grow flex-col mx-6`}>
          <div className='flex flex-grow h-full justify-center items-center'>
            <div className="flex flex-col">
              <h1 className="text-3xl">Questões Finalizadas</h1>
              <p>Questões totais: {totalCount}</p>
              <p>Sabe: {knowCount}</p>
              <p>Não sabe: {didNotKnowCount}</p>
              <p>Pulados: {skippedCount}</p>
            </div>
          </div> 
          
        </div>        
      </div>
      <div className='flex mb-10 items-center justify-end w-[600px]'>
        <button 
          className={`${activeColorSet?.cardBg} rounded-md px-[1rem] pr-24 py-3 flex items-center hover:bg-opacity-80`} 
          onClick={() => onReset('reset')}
        >
          <span className="pixelarticons--redo text-xl rotate-180 mr-1 h-4"></span>
          <span>Reiniciar</span>
        </button>
      </div>
    </div>
  );
}
