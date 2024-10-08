/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse } from 'next/server';
import { generateText } from "ai"
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { question: prompt } = await req.json();
  console.log('prompt', prompt)

  if (!prompt) {
    return NextResponse.json({ error: 'No question provided.' }, { status: 400 });
  }

  try {
    const stream  = await generateText({
      model: google('gemini-1.5-flash'),
      prompt,
      maxSteps: 5,
      experimental_continueSteps: true,
    });
    
    return new Response(stream.text, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    
  } catch (error) {
    console.error('Error with Google Generative AI:', error);
    return NextResponse.json({ error: 'Failed to get AI response.' }, { status: 500 });
  }
}
