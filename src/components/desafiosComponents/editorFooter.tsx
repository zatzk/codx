/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';

export default function EditorFooter({ onRun, onSubmit }: { onRun: () => void, onSubmit: () => void }) {
  return (
    <div className='flex bg-dark-layer-1 bottom-0 sticky z-10 w-full'>
      <div className='mx-5 my-[10px] flex justify-between w-full'>
        <div className='ml-auto flex items-center space-x-4'>
          <button
            className='bg-gray-600 hover:bg-gray-500 px-4 py-2 text-sm font-medium items-center whitespace-nowrap transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 text-dark-label-2 rounded-lg'
            onClick={onRun}
          >
            Run
          </button>
          <button
            className='bg-green-500 hover:bg-green-400 px-4 py-2 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-dark-green-s hover:bg-green-3 rounded-lg'
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
