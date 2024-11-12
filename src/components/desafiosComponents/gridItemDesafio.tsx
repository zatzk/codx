/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// GridItemDesafio.tsx
import Link from "next/link";
import { useColorContext } from "~/lib/colorContext";
import { type Desafio } from "~/app/desafios/page";

interface GridItemDesafioProps {
  desafio: Desafio;
  isAdmin?: boolean;
  onEdit?: () => void;
}

const difficultyColor: Record<string, string> = {
  'Easy': 'border-green-600 bg-green-600/10 text-green-600',
  'Medium': 'border-yellow-600 bg-yellow-600/10 text-yellow-600',
  'Hard': 'border-red-600 bg-red-600/10 text-red-600',
};

export function GridItemDesafio({ desafio, isAdmin, onEdit }: GridItemDesafioProps) {
  const { activeColorSet } = useColorContext();

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit?.();
  };

  return (
    <Link 
      href={`/desafios/${desafio.title.replace(/\s/g, '-')}`}
      className={`
        ${activeColorSet?.cardBg}
        hover:bg-opacity-30 
        bg-opacity-20 
        p-6
        rounded-lg
        relative
        group
        transition-all
      `}
    >
      <h3 className="text-lg font-medium text-white mb-4">{desafio.title}</h3>
      <div className="flex flex-wrap gap-2">
        <span className={`${difficultyColor[desafio.difficulty]} text-xs px-3 py-1 rounded-full border`}>
          {desafio.difficulty}
        </span>
        <span className="text-xs px-3 py-1 rounded-full border border-blue-500 bg-blue-500/10 text-blue-500">
          {desafio.category}
        </span>
      </div>
      {isAdmin && (
        <button
          onClick={handleEditClick}
          className="absolute bottom-3 right-3 p-2 rounded-md h-[37px] bg-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <span className="pixelarticons--edit-box text-white text-xl"></span>
        </button>
      )}
    </Link>
  );
}