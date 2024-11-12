// FilterButton.tsx
interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  colorClass?: string;
}

export function FilterButton({ label, active, onClick, colorClass }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-sm transition-all
        ${active
          ? colorClass ?? 'border-blue-500 bg-blue-500/10 text-blue-500'
          : 'border-gray-600 text-gray-400 hover:border-gray-400'
        }`}
    >
      {label}
    </button>
  );
}