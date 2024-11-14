/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { Inter, Silkscreen } from "next/font/google";
import { useColorContext } from "../../lib/colorContext";
import { SimplePagHeader } from "~/components/simplePageHeader";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DesafioDrawer from "~/components/desafiosComponents/desafioDrawer";
import { GridItemDesafio } from "~/components/desafiosComponents/gridItemDesafio";
import { FilterButton } from "~/components/desafiosComponents/filterButton";
import { CATEGORY_OPTIONS } from "~/components/desafiosComponents/desafioDrawer";

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface Example {
  inputText: string;
  outputText: string;
}

interface TestCase {
  id?: number;
  input: string;
  target?: string;
  expectedOutput: string;
}

export interface Desafio {
  id?: number;
  title: string;
  problemStatement: string;
  starterCode: string;
  functionName: string;
  examples: Example[];
  difficulty: string;
  category: string;
  testCases: TestCase[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default function Desafios() {
  const { data: session } = useSession();
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDesafio, setSelectedDesafio] = useState<Desafio | null>(null);
  const [filters, setFilters] = useState<{ difficulties: string[], categories: string[] }>({
    difficulties: [],
    categories: []
  });

  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    void fetchDesafios();
  }, []);

  async function fetchDesafios() {
    setIsLoading(true);
    try {
      const response = await fetch('/desafios/api');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setDesafios(data);
    } catch (error) {
      console.error('Failed to fetch desafios:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditClick = (fetchedDesafio: Desafio) => {
    setSelectedDesafio(fetchedDesafio);
    setIsDrawerOpen(true);
  };

  const handleAddClick = () => {
    setSelectedDesafio(null);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedDesafio(null);
  };

  function toggleFilter(type: 'difficulties' | 'categories', value: string) {
    setFilters(prev => {
      const array = prev[type];
      const newArray = array.includes(value)
        ? array.filter(item => item !== value)
        : [...array, value];
      return { ...prev, [type]: newArray };
    });
  }

  const allDifficulties = ['Easy', 'Medium', 'Hard'];
  const allCategories = desafios.length > 0 
  ? [...new Set(desafios.map(d => d.category))]
  : CATEGORY_OPTIONS; 

  const filteredDesafios = (desafios || []).filter(desafio => {
    if (!desafio?.difficulty || !desafio.category) return false;
    
    const matchesDifficulty = filters.difficulties.length === 0 || 
      filters.difficulties.includes(desafio.difficulty);
    const matchesCategory = filters.categories.length === 0 || 
      filters.categories.includes(desafio.category);
    return matchesDifficulty && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <section className={`font-sans ${inter.variable} flex h-auto w-full flex-col items-center mt-20`}>
      <SimplePagHeader 
        title="Desafios" 
        description="Desafios para ajudá-lo a testar e melhorar seu conhecimento e habilidades" 
      />

      <div className="w-3/4 mx-auto sm:w-9/12 mt-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div>
            <h3 className={`${silkscreen.className} text-sm mb-2 text-white`}>Dificuldade</h3>
            <div className="flex flex-wrap gap-2">
              {allDifficulties.map(diff => (
                <FilterButton
                  key={diff}
                  label={diff}
                  active={filters.difficulties.includes(diff)}
                  onClick={() => toggleFilter('difficulties', diff)}
                  colorClass={filters.difficulties.includes(diff) ? 
                    `border-${diff.toLowerCase()}-600 bg-${diff.toLowerCase()}-600/10 text-${diff.toLowerCase()}-600` : 
                    undefined}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className={`${silkscreen.className} text-sm mb-2 text-white`}>Categoria</h3>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(cat => (
                <FilterButton
                  key={cat}
                  label={cat}
                  active={filters.categories.includes(cat)}
                  onClick={() => toggleFilter('categories', cat)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desafios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {filteredDesafios.map((desafio) => (
            <GridItemDesafio
              key={desafio.id ?? `desafio-${Math.random()}`}
              desafio={desafio}
              isAdmin={isAdmin}
              onEdit={handleEditClick}
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

      <DesafioDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onFormSubmit={fetchDesafios}
        desafio={selectedDesafio}
      />
    </section>
  );
}
