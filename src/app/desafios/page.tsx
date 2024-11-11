/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { useColorContext } from "../../lib/colorContext"
import { useEffect, useState } from "react";
import { SimplePagHeader } from "~/components/simplePageHeader";
import { Inter, Silkscreen } from "next/font/google";

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-sans"
});

interface Desafio {
  id: number;
  title: string;
  difficulty: string;
  category: string;
}

export default function Desafios() {
  const { activeColorSet } = useColorContext();
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [filteredDesafios, setFilteredDesafios] = useState<Desafio[]>([]);
  const [filters, setFilters] = useState<{ difficulties: string[], categories: string[] }>({
    difficulties: [],
    categories: []
  });

  const difficultyColor: { [key in 'Easy' | 'Medium' | 'Hard']: string } = {
    'Easy': 'border-green-600 bg-green-600/10 text-green-600',
    'Medium': 'border-yellow-600 bg-yellow-600/10 text-yellow-600',
    'Hard': 'border-red-600 bg-red-600/10 text-red-600',
  };

  useEffect(() => {
    async function fetchDesafios() {
      try {
        const response = await fetch('/desafios/api');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setDesafios(data);
        setFilteredDesafios(data);
      } catch (error) {
        console.error('Failed to fetch desafios:', error);
      }
    }
    fetchDesafios();
  }, []);

  useEffect(() => {
    const filtered = desafios.filter((desafio: { difficulty: string; category: string; title: string }) => {
      const matchesDifficulty = filters.difficulties.length === 0 || 
        filters.difficulties.includes(desafio.difficulty);
      const matchesCategory = filters.categories.length === 0 || 
        filters.categories.includes(desafio.category);
      return matchesDifficulty && matchesCategory;
    });
    setFilteredDesafios(filtered);
  }, [filters, desafios]);


  const allDifficulties = ['Easy', 'Medium', 'Hard'];
  const allCategories = [...new Set(desafios.map(d => d.category))];

  function toggleFilter(type: 'difficulties' | 'categories', value: string) {
    setFilters(prev => {
      const array = prev[type];
      const newArray = array.includes(value)
        ? array.filter(item => item !== value)
        : [...array, value];
      return { ...prev, [type]: newArray };
    });
  }

  function redirectToDesafio(desafioTitle: string) {
    window.location.href = `/desafios/${desafioTitle.replace(/\s/g, '-')}`;
  }

  return (
    <section className="font-sans flex h-auto w-full flex-col items-center mt-20">
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
                <button
                  key={diff}
                  onClick={() => toggleFilter('difficulties', diff)}
                  className={`px-3 py-1 rounded-full border text-sm transition-all
                    ${filters.difficulties.includes(diff)
                      ? difficultyColor[diff as keyof typeof difficultyColor]
                      : 'border-gray-600 text-gray-400 hover:border-gray-400'
                    }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className={`${silkscreen.className} text-sm mb-2 text-white`}>Categoria</h3>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleFilter('categories', cat)}
                  className={`px-3 py-1 rounded-full border text-sm transition-all
                    ${filters.categories.includes(cat)
                      ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                      : 'border-gray-600 text-gray-400 hover:border-gray-400'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {filteredDesafios.map((desafio) => (
            <div
              key={desafio.id}
              onClick={() => redirectToDesafio(desafio.title)}
              className={`${activeColorSet?.bg} bg-opacity-20 hover:bg-opacity-30 
                rounded-lg p-6 cursor-pointer transition-all`}
            >
              <h3 className="text-lg font-medium text-white mb-4">{desafio.title}</h3>
              <div className="flex flex-wrap gap-2">
                <span className={`${difficultyColor[desafio.difficulty as 'Easy' | 'Medium' | 'Hard'] } 
                  text-xs px-3 py-1 rounded-full border`}>
                  {desafio.difficulty}
                </span>
                <span className="text-xs px-3 py-1 rounded-full border
                  border-blue-500 bg-blue-500/10 text-blue-500">
                  {desafio.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}