/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// app/cursos/page.tsx
'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import PathCard from '~/components/cursosComponents/pathCard';
import { useColorContext } from "~/lib/colorContext";
import { SimplePagHeader } from "~/components/simplePageHeader";
import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";
import { PathDrawer } from "~/components/cursosComponents/pathDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface Path {
  id: number;
  title: string;
  description: string;
  pathCourses?: unknown[] | undefined;
}

export default function PathsPage() {
  const [paths, setPaths] = useState<Path[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState<Path | null>(null);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const {activeColorSet} = useColorContext();

  useEffect(() => {
    void fetchPaths();
  }, []);
  console.log('paths', paths);

  async function fetchPaths() {
    setIsLoading(true);
    try {
      const response = await fetch('/cursos/api/paths/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPaths(data);
    } catch (error) {
      console.error('Failed to fetch paths:', error);
    } finally {
      setIsLoading(false);
    }
  }

    // Handle adding a new path
    const handleAddClick = () => {
      setSelectedPath(null);
      setIsDrawerOpen(true);
    };
  
    // Handle editing an existing path
    const handleEditClick = (path: Path) => {
      setSelectedPath(path);
      setIsDrawerOpen(true);
    };
  
    // Handle closing the drawer
    const handleDrawerClose = () => {
      setIsDrawerOpen(false);
      setSelectedPath(null);
    };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <section className={`${inter.variable} ${activeColorSet?.secondary} flex w-full flex-col items-center mt-24 `}>
      <SimplePagHeader title="Cursos" description="Para ajudá-lo a testar e melhorar seu conhecimento e habilidades" />
      <div className="w-full flex pb-16 pt-12">
        <div className="ml-auto mr-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 xs:grid-cols-1">
            {paths.map((path) => (
              <PathCard 
                key={path.id} 
                path={path} 
                isAdmin={isAdmin}
                onEdit={() => handleEditClick(path)}
              />
            ))}
            {isAdmin && (
              <button
                onClick={handleAddClick}
                className={`
                  hover:bg-opacity-30 
                  bg-opacity-20 
                  p-6
                  rounded-2xl
                  h-24
                  w-[380px] 
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
      </div>
      <PathDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onFormSubmit={fetchPaths}
        path={selectedPath}
      />
    </section>
  );
}