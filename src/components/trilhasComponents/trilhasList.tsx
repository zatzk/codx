/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import React, { useState } from 'react';
import { useColorContext } from "~/lib/colorContext";
import { markdownToHtml } from '../../lib/markdown';

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
  links: Link[];
}

interface Roadmap {
  id: number;
  trilhaId: number;
  trilhaGroupId: number;
  trilha: Trilha;
}

interface TrilhasListProps {
  roadmap: Roadmap[];
}

export function TrilhasList({ roadmap }: TrilhasListProps) {
  const { activeColorSet } = useColorContext();
  const [activeTrilha, setActiveTrilha] = useState<number | null>(null);

  const toggleAccordion = (trilhaId: number) => {
    setActiveTrilha(activeTrilha === trilhaId ? null : trilhaId);
  };

  const renderTrilha = (trilha: Trilha) => (
    <div key={trilha.id} className="mb-4">
      <button
        onClick={() => toggleAccordion(trilha.id)}
        className={`${activeColorSet?.cardBg} ${activeTrilha === trilha.id ? 'rounded-b-none' : 'rounded-md'} bg-opacity-50 w-full text-left p-3 px-6 rounded-md`}
      >
        <h3 className="text-xl font-semibold">{trilha.name}</h3>
      </button>
      <div className={`overflow-hidden rounded-md rounded-t-none transition-max-height duration-500 ease-in-out ${activeTrilha === trilha.id ? 'max-h-[2200px]' : 'max-h-0'}`}>
        <div className={`px-6 py-2 pb-8 ${activeColorSet?.cardBg} bg-opacity-50 rounded-md rounded-t-none mt-[-4px]`}>
          <p className="mb-6" dangerouslySetInnerHTML={{ __html: markdownToHtml(trilha.data, false) }} />
          <ul className={`rounded-md border-2 p-3 ${activeColorSet?.borderButton}`}>
            {trilha.links.map((link, index) => (
              <li className={`py-1 ${activeColorSet?.paragraph}`} key={index}>
                <a  href={link.link} target="_blank" rel="noopener noreferrer">
                  {link.title} <span className={`text-sm ${activeColorSet?.cardBg} bg-opacity-60 rounded-md px-1 py-[2px]`}>({link.type})</span> 
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderLevel = (level: number) => (
    <div key={level} className="mb-8">
      <h2 className={`text-3xl font-bold mb-4 py-4 rounded-md ${activeColorSet?.cardBg} bg-opacity-90`}>
        <span className={` ${activeColorSet?.paragraph} ml-6`}>Nível {level}</span>  
      </h2>
      {roadmap
        ?.filter((item) => item.trilha.level === level)
        .map((item) => renderTrilha(item.trilha))}
    </div>
  );

  return (
    <div className="w-full">
      {[1, 2, 3].map((level) => renderLevel(level))}
    </div>
  );
};

export default TrilhasList;
