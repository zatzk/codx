/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// components/pathsComponents/pathDrawer.tsx
'use client';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { X, Trash } from 'lucide-react';
import { useColorContext } from '~/lib/colorContext';
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';

interface Path {
  id: number;
  title: string;
  description: string;
}

interface PathDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmit: () => void;
  path: Path | null;
}

export function PathDrawer({ isOpen, onClose, onFormSubmit, path }: PathDrawerProps) {
  const { activeColorSet } = useColorContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch path data when editing
  useEffect(() => {
    void fetchCursos();
  }, [path]);

  async function fetchCursos() {
    setLoading(true);
    try {
      if (path?.id) {
        setLoading(true);
        fetch(`/cursos/api/paths/${path.id}`)
          .then((response) => {
            if (!response.ok) throw new Error('Failed to fetch path data');
            return response.json();
          })
          .then((data) => {
            setFormData({
              title: data.title,
              description: data.description,
            });
          })
          .catch((error) => {
            console.error('Error fetching path data:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setFormData({
          title: '',
          description: '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch path data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const isNewPath = !path?.id;
      const url = isNewPath ? '/cursos/api/paths/' : `/cursos/api/paths/${path.id}`;
      const method = isNewPath ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save path');
      }

      onFormSubmit();
      onClose();
    } catch (error) {
      console.error('Error saving path:', error);
    }
  };

  // Handle delete path
  const handleDeletePath = async () => {
    if (!path?.id) return;

    try {
      const response = await fetch(`/cursos/api/paths/${path.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete path');
      }

      onFormSubmit();
      onClose();
    } catch (error) {
      console.error('Error deleting path:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-[600px] ${activeColorSet.bg} text-white backdrop-blur-md rounded-l-xl bg-opacity-10 z-50
          shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-7 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              {path ? 'Editar Path' : 'Novo Path'}
            </h2>
            <div className="flex gap-2">
              {path && (
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="p-2 hover:bg-red-700/50 transition-all rounded-full text-red-500"
                >
                  <Trash className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 transition-all rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 flex-1 p-9 overflow-auto mb-[70px] border border-gray-700 rounded-md">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título do caminho"
                  className="w-full bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do caminho"
                  className="w-full bg-transparent"
                />
              </div>

              <div className="flex justify-end space-x-2 fixed bottom-6 right-6 w-[calc(100%-250px)]">
                <Button variant="outline" onClick={onClose} className={`flex-1 bg-transparent ${activeColorSet.borderButton} hover:border-white`}>
                  Cancelar
                </Button>
                <Button type="submit" className={`flex-1 ${activeColorSet.bgButton} ${activeColorSet.bgButtonHover}`}>
                  Salvar Alterações
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este caminho.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePath}
              className="bg-red-500 hover:bg-red-600"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}