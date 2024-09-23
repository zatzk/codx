/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// components/ContentComponent.tsx
interface Module {
  title: string;
  content: string;
}

interface ContentComponentProps {
  module: Module | null;
  onMarkAsComplete: () => void;
}

export default function ContentComponent({ module, onMarkAsComplete }: ContentComponentProps) {
  if (!module) {
    return <div className="w-3/4 p-4">Select a module to view content</div>;
  }

  return (
    <div className="w-3/4 p-4">
      <h2 className="text-2xl font-bold mb-4">{module.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: module.content }} />
      <button 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={onMarkAsComplete}
      >
        Mark as Complete
      </button>
    </div>
  );
}