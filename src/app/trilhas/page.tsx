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
import { TrilhasDrawer } from "~/components/trilhasComponents/trilhasDrawer";
import { useSession } from "next-auth/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface Trilha {
  id: number;
  name: string;
  description: string;
  data: string;
  links: Record<string, string>;
  level: number;
  createdAt: string;
  updatedAt: string;
}

const defaultTrilha: Trilha = {
  id: 0,
  name: '',
  description: '',
  data: '',
  links: {},
  level: 0,
  createdAt: '',
  updatedAt: '',
};

export default function Trilhas() {
  const { data: session } = useSession();
  const { activeColorSet } = useColorContext();
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTrilha, setSelectedTrilha] = useState<Trilha | null>(null);

  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    void fetchTrilhas();
  }, []);

  async function fetchTrilhas() {
    setIsLoading(true);
    try {
      const response = await fetch('/trilhas/api');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTrilhas(data);
    } catch (error) {
      console.error('Failed to fetch trilhas:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditClick = (trilha: Trilha) => {
    setSelectedTrilha(trilha);
    setIsDrawerOpen(true);
  };

  const handleAddClick = () => {
    setSelectedTrilha(null);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedTrilha(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <section className={`font-sans ${inter.variable} ${activeColorSet?.secondary} flex w-full flex-col items-center mt-20 `}>
      <SimplePagHeader title="Trilhas" description="Trilhas com melhores conteudos de aprendizado" />
      <div className="w-full flex pb-16 pt-8">
        <div className="ml-auto mr-auto max-w-7xl px-8">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 xs:grid-cols-1">
            {trilhas.map((trilha) => (
              <GridItem
                route="trilhas"
                key={trilha.id}
                name={trilha.name}
                isAdmin={isAdmin}
                onEdit={() => handleEditClick(trilha)}
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

      <TrilhasDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onFormSubmit={fetchTrilhas}
        trilha={selectedTrilha ?? defaultTrilha}
      />
    </section>
  );
}