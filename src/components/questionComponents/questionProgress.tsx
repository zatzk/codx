/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';
import { CheckCircle, RotateCcw, SkipForward, Sparkles } from 'lucide-react';
import { useColorContext } from "../../lib/colorContext";
interface QuestionsProgressProps {
  knowCount: number;
  didNotKnowCount: number;
  skippedCount: number;
  totalCount: number;
  onResetClick: () => void;
}

export function QuestionsProgress({
  knowCount,
  didNotKnowCount,
  skippedCount,
  totalCount,
  onResetClick
}: QuestionsProgressProps) {

  const {activeColorSet} = useColorContext();

  const totalSolved = knowCount + didNotKnowCount + skippedCount;
  const donePercentage = (totalSolved / totalCount) * 100;

  return (
    <div className={`flex flex-col mb-6 ${activeColorSet?.cardBg} bg-opacity-30 h-20 w-[600px] rounded-md`}>
      <div className='ml-4 mt-3 mr-8'>
        <div className='flex items-center justify-between'>
          <div
            className={`duration-400 h-2 relative bottom-0 left-0 top-0 rounded-xl ${activeColorSet?.cardBg} transition-[width]`}
            style={{
              width: `${donePercentage}%`,
            }}
          />
          <p className='text-sm font-light'>{totalSolved}/{totalCount}</p>
        </div>
        
        <div className="flex mt-3">
          <div className="flex items-center mr-3">
            <CheckCircle className="mr-1 h-4"/>
            <p className='font-light text-sm'>Sei: <span className={`${activeColorSet?.cardBg} rounded-md px-[6px] py-[2px]`}>{knowCount} itens</span></p>
          </div>
          <div className="flex items-center mr-3">
            <Sparkles className="mr-1 h-4"/>
            <p className='font-light text-sm'>Não sei: <span className={`${activeColorSet?.cardBg} rounded-md px-[6px] py-[2px]`}>{didNotKnowCount} itens</span></p>
          </div>
          <div className="flex items-center mr-3">
            <SkipForward className="mr-1 h-4"/>
            <p className='font-light text-sm'>Pulei: <span className={`${activeColorSet?.cardBg} rounded-md px-[6px] py-[2px]`}>{skippedCount} itens</span></p>
          </div>
          <div className={`${activeColorSet?.primary} flex items-center`}>
           <RotateCcw className="mr-1 h-4" />
            <button className={`font-light text-sm`} onClick={onResetClick}>Limpar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
