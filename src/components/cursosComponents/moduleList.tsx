/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// components/ModuleList.tsx
import { useEffect, useState } from 'react';

interface Module {
  id: number;
  title: string;
  description: string;
}

interface ModuleListProps {
  modules: Module[];
  onModuleClick: (moduleId: number) => void;
  userId?: string;
  courseId: number;
}

export default function ModuleList({ modules, onModuleClick, userId, courseId }: ModuleListProps) {
  const [completedModules, setCompletedModules] = useState<number[]>([]);

  useEffect(() => {
    async function fetchProgress() {
      if (!userId) return;
      try {
        const response = await fetch(`/cursos/api/progress/${userId}/${courseId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCompletedModules(data.completedModules || []);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      }
    }

    void fetchProgress();
  }, [userId, courseId]);

  return (
    <ul className="space-y-4">
      {modules.map((module) => (
        <li 
          key={module.id} 
          className="border rounded p-4 cursor-pointer hover:bg-gray-100"
          onClick={() => onModuleClick(module.id)}
        >
          <h3 className="font-semibold">{module.title}</h3>
          <p className="text-sm text-gray-600">{module.description}</p>
          {completedModules.includes(module.id) && (
            <span className="text-green-500 text-sm">Completed</span>
          )}
        </li>
      ))}
    </ul>
  );
}