/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import React, { useEffect, useState } from 'react';
import { type DesafioProps } from '~/app/desafios/[id]/page';
import { useColorContext } from '~/lib/colorContext';
import { Inter, Silkscreen } from 'next/font/google';
import { marked } from 'marked';
import DOMPurify from 'dompurify';




const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const silkscreen = Silkscreen({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function ProblemDescription({ desafio }: { desafio: DesafioProps }) {
  const { activeColorSet } = useColorContext();
  const [activeTab, setActiveTab] = useState<'description' | 'ask-ai'>('description');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [parsedResponse, setParsedResponse] = useState<string | null>(null);

  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  const handleTabClick = (tab: 'description' | 'ask-ai') => {
    setActiveTab(tab);
  };

  const handleAskAi = async (prompt: string) => {
    setLoading(true) ;
    setAiResponse(''); 

    const response = await fetch('/api/ask-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: prompt }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      if (!reader) {
        throw new Error('Reader is undefined');
      }
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value, { stream: true });
      try {
        const parsedChunk = JSON.parse(chunk);
        setAiResponse((prev) => prev + parsedChunk.text);
      } catch (error) {
        setAiResponse((prev) => prev + chunk);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (aiResponse) {
      void (async () => {
        const result = DOMPurify.sanitize(await marked.parse(aiResponse));
        setParsedResponse(result);
      })();
    }
  }, [aiResponse]);


  const generatePrompt = (type: string) => {
    let prompt = `Problem Statement: ${desafio.problemStatement}\n`;
    desafio.examples.forEach((example, index) => {
      prompt += `Example ${index + 1}: Input - ${example.inputText}, Output - ${example.outputText}, Explanation - ${example.explanation}\n`;
    });

    switch (type) {
      case 'explain-like-5':
        prompt += 'Explain this problem as if I were 5 years old. - write in markdown.';
        break;
      case 'step-by-step':
        prompt += 'Explain the solution step-by-step in javascript. - write in markdown.';
        break;
      case 'code-explanation':
        prompt += 'Give me a code explanation for solving this problem in javascript. - write in markdown.';
        break;
      default:
        prompt += '';
    }

    return prompt;
  };

  console.log('AI Response:', aiResponse);

  return (
    <div className='rounded-lg border'>
      {/* Tabs Header */}
      <div className={`${activeColorSet?.bg} ${silkscreen.className} bg-opacity-50 rounded-t-lg h-9 items-center flex`}>
        <div className='text-sm cursor-pointer flex'>
          <div
            className={`ml-4 pr-4 text-sm py-1 flex items-center hover:border rounded-md ${activeTab === 'description' ? 'font-bold' : ''}`}
            onClick={() => handleTabClick('description')}
          >
            <span className="pixelarticons--list-box text-lg ml-4 mr-2"></span>
            <p className='text-sm'>Description</p>
          </div>
          <div
            className={`ml-2 pr-4 py-1 flex items-center hover:border rounded-md ${activeTab === 'ask-ai' ? 'font-bold' : ''}`}
            onClick={() => handleTabClick('ask-ai')}
          >
            <span className="pixelarticons--android text-lg ml-4 mr-2"></span>
            <p className='text-sm'>Ask AI</p>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className='overflow-auto max-h-[72vh]'>
        {activeTab === 'description' && (
          <div className='p-3'>
            <div className='flex items-center justify-between mt-2'>
              <div className={`text-md ${inter.className}`}>{desafio.title}</div>
              <div className={`flex items-center ${activeColorSet?.bg} px-3 py-1 mr-2 rounded-2xl`}>
                <div className='text-sm'>{desafio.difficulty}</div>
              </div>
            </div>
            <p className='text-sm mt-2' dangerouslySetInnerHTML={{ __html: desafio?.problemStatement }}></p>
            {(desafio?.examples || []).map((example, index) => (
              <div key={index} className='text-sm'>
                <p className='text-sm mt-5 mb-1 p-1'>Example {index + 1}:</p>
                <div className='border rounded-lg max-w-[98%] p-3'>
                  <p className='text-sm'>{example.inputText}</p>
                  <p className='text-sm'>{example.outputText}</p>
                  <p className='text-sm'>{example.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ask-ai' && (
          <div className='flex flex-col h-[68vh]'>
            {/* Display the streaming AI response */}
            <div className=' p-4 text-sm text-white mb-3 min-h-96 overflow-y-auto'>
              {loading ? 'Generating response...' : (aiResponse ? <p dangerouslySetInnerHTML={{ __html: parsedResponse ?? '' }}></p> : 'No response yet.')}
            </div>

            <div className='p-3 flex flex-col justify-end h-full'>
              <div className='flex flex-col'>
                <button
                  className='border hover:bg-gray-700 text-white px-4 py-2 rounded-lg mb-3'
                  onClick={() => handleAskAi(generatePrompt('explain-like-5'))}
                >
                  Explain like I was 5
                </button>
                <button
                  className='border hover:bg-gray-700 text-white px-4 py-2 rounded-lg mb-3'
                  onClick={() => handleAskAi(generatePrompt('step-by-step'))}
                >
                  Explain the solution step-by-step
                </button>
                <button
                  className='border hover:bg-gray-700 text-white px-4 py-2 rounded-lg'
                  onClick={() => handleAskAi(generatePrompt('code-explanation'))}
                >
                  Show code explanation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
