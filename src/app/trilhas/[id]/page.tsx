/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/questoes/[id]/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import TrilhasList from '~/components/trilhasComponents/trilhasList';
import { SimplePagHeader } from '~/components/simplePageHeader';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function Trilhas() {
  const params = useParams<{id: string}>();
  const name = params.id;


  interface Roadmap {
    id: number;
    trilhaId: number;
    trilhaGroupId: number;
    trilha: {
      id: number;
      name: string;
      description: string;
      level: number;
      data: string;
      links: { type: string; title: string; link: string }[];
    };
  }
  
  const [roadmap, setRoadmap] = useState<Roadmap[]  | null>(null);

  useEffect(() => {
    if (name) {
      async function fetchRoadmap() {
        try {
          const response = await fetch(`/trilhas/api/${name}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setRoadmap(data);
        } catch (error) {
          console.error('Failed to fetch roadmap:', error);
        }
      }
      fetchRoadmap();
    }
  }, [name]);

  console.log('roadmap:', roadmap);

  return (
  <section className={`font-sans ${inter.variable} flex w-full flex-col items-center mt-28 text-white`}>
    <SimplePagHeader title="Trilhas" description="Trilhas com melhores conteudos de aprendizado" />
      <div className="flex flex-col items-center justify-center pb-16 pt-12 w-2/3">
        {roadmap && <TrilhasList roadmap={roadmap} />}
      </div>
  </section>
  );
};

