/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Inter } from 'next/font/google';
import TrilhasList from '~/components/trilhasComponents/trilhasList';
import { SimplePagHeader } from '~/components/simplePageHeader';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function Trilhas() {
  const params = useParams<{ id: string }>();
  const name = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<Roadmap[] | null>(null);

  interface Link {
    type: string;
    title: string;
    link: string;
  }

  interface Trilha {
    id: number;
    name: string;
    description: string;
    level: number;
    data: string;
    links: Link[]; // Links are now fetched from the `trilhas_links` table
  }

  interface Roadmap {
    id: number;
    trilhaId: number;
    trilhaGroupId: number;
    trilha: Trilha;
  }

  useEffect(() => {
    if (name) {
      async function fetchRoadmap() {
        setIsLoading(true);
        try {
          const response = await fetch(`/trilhas/api/${name}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setRoadmap(data);
        } catch (error) {
          console.error('Failed to fetch roadmap:', error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchRoadmap();
    }
  }, [name]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <section className={`font-sans ${inter.variable} flex w-full flex-col items-center mt-28 text-white`}>
      <SimplePagHeader title="Trilhas" description="Trilhas com melhores conteudos de aprendizado" />
      <div className="flex flex-col items-center justify-center pb-16 pt-12 w-2/3">
        {roadmap && <TrilhasList roadmap={roadmap} />}
      </div>
    </section>
  );
}

