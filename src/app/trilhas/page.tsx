// app/trilhas/page.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { Inter } from "next/font/google";
import { useColorContext } from "../../lib/colorContext";
import { SimplePagHeader } from "~/components/simplePageHeader";
import { useState, useEffect } from "react";
import { GridItem } from "~/components/gridItem";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});



export default function Trilhas() {
  const {activeColorSet} = useColorContext();
  const [trilhas, setTrilhas] = useState<{ id: string, name: string }[]>([]);

  useEffect(() => {
    async function fetchTrilhas() {
      try {
        const response = await fetch('/trilhas/api');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTrilhas(data);
        console.log('Data fetched successfully:', data); 
      } catch (error) {
        console.error('Failed to fetch trilhas:', error); 
      }
    }

    fetchTrilhas();
  }, []);

  console.log('trilhas', trilhas);

  return (
    <section className={`font-sans ${inter.variable} ${activeColorSet?.secondary} flex w-full flex-col items-center mt-20 `}>
      <SimplePagHeader title="Trilhas" description="Trilhas com melhores conteudos de aprendizado" />
      <div className="w-full flex sm:pb-16 sm:pt-8">
        <div className="ml-auto mr-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-3">
            {
              trilhas.map((trilha) => (
                <GridItem
                  route="trilhas"
                  key={trilha.id}
                  name={trilha.name}
                />
              ))
            }
          </div>
        </div>
      </div>
    </section>
  );
}
