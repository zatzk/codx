// app/questoes/page.tsx
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



export default function Questoes() {
  const {activeColorSet} = useColorContext();
  const [questoes, setQuestoes] = useState<{ id: string, name: string }[]>([]);

  useEffect(() => {
    async function fetchQuestoes() {
      try {
        const response = await fetch('/questoes/api');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setQuestoes(data);
        console.log('Data fetched successfully:', data); 
      } catch (error) {
        console.error('Failed to fetch questoes:', error); 
      }
    }

    fetchQuestoes();
  }, []);

  console.log('questoes', questoes);

  return (
    <section className={`font-sans ${inter.variable} ${activeColorSet?.secondary} flex w-full flex-col items-center mt-20 `}>
      <SimplePagHeader title="Questões" description="Perguntas para ajudá-lo a testar e melhorar seu conhecimento e habilidades" />
      <div className="w-full flex sm:pb-16 sm:pt-8">
        <div className="ml-auto mr-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 xs:grid-cols-1">
            {questoes.map((questao) => (
              <GridItem
                key={questao.id}
                route="questoes"
                name={questao.name}
                isAdmin={isAdmin}
                onEdit={() => handleEditClick(questao)}
              />
            ))}
            {isAdmin && (
              <button
                onClick={handleAddClick}
                className={`
                  hover:bg-opacity-30 
                  bg-opacity-20 
                  p-6
                  rounded-lg
                  flex 
                  items-center 
                  justify-center
                  transition-all
                  border-2
                  border-white/10
                  hover:border-white/20
                `}
              >
                <span className="pixelarticons--plus text-white/60 text-lg"></span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
