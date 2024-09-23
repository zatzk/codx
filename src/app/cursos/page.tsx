/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// app/cursos/page.tsx
'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import PathCard from '~/components/cursosComponents/pathCard';
import { useColorContext } from "~/lib/colorContext";
import { SimplePagHeader } from "~/components/simplePageHeader";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface Path {
  id: number;
  title: string;
  description: string;
  pathCourses: unknown;
}

export default function PathsPage() {
  const [paths, setPaths] = useState<Path[]>([]);
  const router = useRouter();
  const {activeColorSet} = useColorContext();

  useEffect(() => {
    async function fetchPaths() {
      try {
        const response = await fetch('/cursos/api/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPaths(data);
      } catch (error) {
        console.error('Failed to fetch paths:', error);
      }
    }

    void fetchPaths();
  }, []);
  console.log('paths', paths);

  const handlePathClick = (pathId: number) => {
    router.push(`/cursos/${pathId}`);
  };

  return (
    <section className={`${inter.variable} ${activeColorSet?.secondary} flex w-full flex-col items-center mt-24 `}>
      <SimplePagHeader title="Cursos" description="Para ajudá-lo a testar e melhorar seu conhecimento e habilidades" />
      <div className="w-full flex pb-16 pt-12">
        <div className="ml-auto mr-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 xs:grid-cols-1">
            {paths.map((path) => (
              <PathCard 
                key={path.id} 
                path={path} 
                onClick={() => handlePathClick(path.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}