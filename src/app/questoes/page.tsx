/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { Inter } from "next/font/google";
import { useColorContext } from "../../lib/colorContext";
import { SimplePagHeader } from "~/components/simplePageHeader";
import { useState, useEffect } from "react";
import { GridItem } from "~/components/gridItem";
import { QuestionDrawer } from "~/components/questionComponents/questionDrawer";
import { useSession } from "next-auth/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface Question {
  id: string;
  name: string;
  title: string;
}

export default function Questoes() {
  const { data: session } = useSession();
  const { activeColorSet } = useColorContext();
  const [questoes, setQuestoes] = useState<Question[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    void fetchQuestoes();
  }, []);

  async function fetchQuestoes() {
    setIsLoading(true);
    try {
      const response = await fetch('/questoes/api');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setQuestoes(data);
    } catch (error) {
      console.error('Failed to fetch questoes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditClick = (questao: Question) => {
    setSelectedQuestion(questao);
    setIsDrawerOpen(true);
  };

  const handleAddClick = () => {
    setSelectedQuestion(null);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedQuestion(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <section className={`font-sans ${inter.variable} ${activeColorSet?.secondary} flex w-full flex-col items-center mt-20`}>
      <SimplePagHeader 
        title="Questões" 
        description="Perguntas para ajudá-lo a testar e melhorar seu conhecimento e habilidades" 
      />
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
                  h-24
                  w-[360px] 
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

      <QuestionDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onFormSubmit={fetchQuestoes}
        question={selectedQuestion}
      />
    </section>
  );
}