/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { Inter } from "next/font/google";
import { useColorContext } from "../../lib/colorContext"
import { useEffect, useState } from "react";
import { SimplePagHeader } from "~/components/simplePageHeader";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});


export default function Desafios() {
  const {activeColorSet} = useColorContext();
  const [desafios, setDesafios] = useState<{ id: string, title: string, difficulty: string, category: string }[]>([]);

  const difficultyColor: Record<string, string> = {
    'Easy': 'bg-green-600',
    'Medium': 'bg-yellow-600',
    'Hard': 'bg-red-600',
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
    <section className={`font-sans ${inter.variable} ${activeColorSet?.secondary} flex w-full flex-col items-center mt-20 `}>
      <SimplePagHeader title="Desafios" description="Desafios para ajudá-lo a testar e melhorar seu conhecimento e habilidades" />

      <div className="w-2/3 max-w-[1000px] mx-auto sm:w-9/12  relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className={`w-full text-sm text-left rtl:text-right text-gray-500  dark:text-gray-400 `}>
          <thead className={`text-xs h-14 text-gray-700 uppercase ${activeColorSet?.bg} bg-opacity-90 text-white`}>
            <tr>
              <th scope='col' className='px-8 py-3'>Titulo</th>
              <th scope='col' className='px-8 py-3'>Dificuldade</th>
              <th scope='col' className='px-8 py-3'>Categoria</th>
            </tr>
          </thead>
          <tbody className="h-96">
            {desafios.map((desafio) => (
              <tr 
                onClick={() => redirectToDesafio(desafio.title)} 
                key={desafio.id} 
                className={`text-white border-b border-black cursor-pointer ${activeColorSet?.bg} hover:bg-opacity-30 bg-opacity-20 `}
                >
                <td className="pl-8">{desafio.title}</td>
                <td className={`pl-8`}><span className={`${difficultyColor[desafio.difficulty]} text-xs px-3 py-[5px] rounded-xl`}>{desafio.difficulty}</span></td>
                <td className="pl-8">{desafio.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
