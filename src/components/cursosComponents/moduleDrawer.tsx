/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// components/cursosComponents/modulesDrawer.tsx
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

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  courseId: number;
}

interface ModulesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmit: () => void;
  courseId: number;
  existingModules: Module[];
  selectedModule?: Module | null;
}

export function ModulesDrawer({ isOpen, onClose, onFormSubmit, courseId, existingModules, selectedModule }: ModulesDrawerProps) {
  const { activeColorSet } = useColorContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: existingModules.length > 0 ? Math.max(...existingModules.map(m => m.order)) + 1 : 1,
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedModule) {
      setFormData({
        title: selectedModule.title,
        description: selectedModule.description,
        order: selectedModule.order,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        order: existingModules.length > 0 ? Math.max(...existingModules.map(m => m.order)) + 1 : 1,
      });
    }
  }, [selectedModule, existingModules]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = selectedModule 
        ? `/cursos/api/modules/${selectedModule.id}`
        : `/cursos/api/modules/by-course/${courseId}`;
      const method = selectedModule ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          courseId,
        }),
      });

      if (!response.ok) throw new Error(response.statusText);

      onFormSubmit();
      onClose();
    } catch (error) {
      console.error('Error saving module:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async () => {
    if (!selectedModule) return;

    try {
      const response = await fetch(`/cursos/api/modules/${selectedModule.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete module');

      onFormSubmit();
      onClose();
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={onClose} />
      <div className={`fixed right-0 top-0 h-full w-[600px] ${activeColorSet.bg} text-white backdrop-blur-md rounded-l-xl bg-opacity-10 z-50
          shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-7 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              {selectedModule ? 'Editar Módulo' : 'Novo Módulo'}
            </h2>
            <div className="flex gap-2">
              {selectedModule && (
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

          <form onSubmit={handleSubmit} className="space-y-6 flex-1 p-9 overflow-auto mb-[70px] border border-gray-700 rounded-md">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título do módulo"
                  className="w-full bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do módulo"
                  className="w-full bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Ordem</Label>
                <Input
                  type="number"
                  id="order"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full bg-transparent"
                  min="1"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 fixed bottom-6 right-6 w-[calc(100%-250px)]">
              <Button variant="outline" onClick={onClose} className={`flex-1 bg-transparent ${activeColorSet.borderButton} hover:border-white`}>
                Cancelar
              </Button>
              <Button type="submit" className={`flex-1 ${activeColorSet.bgButton} ${activeColorSet.bgButtonHover}`} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá excluir permanentemente o módulo e todas as suas aulas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteModule}
              className="bg-red-500 hover:bg-red-600"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}