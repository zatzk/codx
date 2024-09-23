/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { Inter } from "next/font/google";
import { Silkscreen } from "next/font/google";
import { useColorContext } from "../../lib/colorContext"
import { useEffect, useState } from "react";
import { SimplePagHeader } from "~/components/simplePageHeader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});


export default function Desafios() {
  const {activeColorSet} = useColorContext();
  const [desafios, setDesafios] = useState<{ id: string, title: string, difficulty: string, category: string }[]>([]);

  const difficultyColor: Record<string, string> = {
    'Easy': 'border-2 border-green-600',
    'Medium': 'border-2 border-yellow-600',
    'Hard': 'border-2 border-red-600',
  }

  useEffect(() => {
    async function fetchDesafios() {
      try {
        const response = await fetch('/desafios/api');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDesafios(data);
        console.log('Data fetched successfully:', data); 
      } catch (error) {
        console.error('Failed to fetch desafios:', error); 
      }
    }

    fetchDesafios();
  }, []);

  console.log('desafios', desafios);

  function redirectToDesafio(desafioId: string) {
    if(desafioId.match(/\s/g)) {
      window.location.href = `/desafios/${desafioId.replace(/\s/g, '-')}`;
    } else {
      window.location.href = `/desafios/${desafioId}`;
    }
  }

  return (
    <section className="font-sans flex h-auto w-full flex-col items-center mt-20 ">
      <SimplePagHeader title="Desafios" description="Desafios para ajudá-lo a testar e melhorar seu conhecimento e habilidades" />

      <div className="w-3/4 mx-auto h-auto sm:w-9/12 relative shadow-md">
        <table className="w-full text-sm text-left rtl:text-right border-separate border-spacing-y-3 mt-[-10px] mb-20 text-white">
          <thead className="text-xs h-14 uppercase bg-opacity-90 ">
            <tr className={`${silkscreen.className} `} style={{ fontFamily: 'var(--font-sans)' }}>
              <th scope="col" className="px-8 py-3">Titulo</th>
              <th scope="col" className="px-8 py-3">Dificuldade</th>
              <th scope="col" className="px-8 py-3">Categoria</th>
            </tr>
          </thead>
          <tbody className="font-sans">
            {desafios.map((desafio) => (
              <tr
                onClick={() => redirectToDesafio(desafio.title)}
                key={desafio.id}
                className={`cursor-pointer ${activeColorSet?.bg} hover:bg-opacity-30 bg-opacity-20`}
              >
                <td className="pl-8 py-4 rounded-l-lg">
                  {desafio.title}
                </td>
                <td className="pl-8 py-4 ">
                  <span className={`${difficultyColor[desafio.difficulty]} text-xs px-3 py-[5px] rounded-2xl`}>
                    {desafio.difficulty}
                  </span>
                </td>
                <td className="pl-8 py-4 rounded-r-lg">
                  {desafio.category}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
