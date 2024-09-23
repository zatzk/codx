/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// components/LeftBar.tsx
interface Module {
  id: string;
  title: string;
  completed: boolean;
}

interface LeftBarProps {
  modules: Module[];
  onModuleClick: (module: Module) => void;
  currentModuleId: string;
}

export default function LeftBar({ modules, onModuleClick, currentModuleId }: LeftBarProps) {
  return (
    <div className="w-1/4 bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Course Modules</h2>
      <ul>
        {modules.map((module) => (
          <li 
            key={module.id} 
            className={`mb-2 cursor-pointer ${module.id === currentModuleId ? 'font-bold' : ''}`}
            onClick={() => onModuleClick(module)}
          >
            {module.completed && <span>✓ </span>}
            {module.title}
          </li>
        ))}
      </ul>
    </div>
  );
}