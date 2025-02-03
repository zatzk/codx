/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// components/cursosComponents/lessonsDrawer.tsx
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

interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl: string | null;
  description: string;
  order: number;
}

interface LessonsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmit: () => void;
  moduleId: number;
  selectedLesson?: Lesson | null;
}

export function LessonsDrawer({ isOpen, onClose, onFormSubmit, moduleId, selectedLesson }: LessonsDrawerProps) {
  const { activeColorSet } = useColorContext();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    description: '',
    order: 1,
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedLesson) {
      setFormData({
        title: selectedLesson.title,
        content: selectedLesson.content,
        videoUrl: selectedLesson.videoUrl ?? '',
        description: selectedLesson.description,
        order: selectedLesson.order,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        videoUrl: '',
        description: '',
        order: 1,
      });
    }
  }, [selectedLesson]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || 
        !formData.content.trim() || 
        !formData.description.trim() || 
        formData.order < 1
    ) {
      alert('Please fill all required fields');
      return;
    }
    setLoading(true);


    try {
      let url: string;
      let method: string;
      
      if (selectedLesson) {
        url = `/cursos/api/lessons/${selectedLesson.id}`;
        method = 'PUT';
      } else {
        url = `/cursos/api/lessons/${moduleId}`;
        method = 'POST';
      }
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // For POST requests, include moduleId in the body
          ...(!selectedLesson && { moduleId: moduleId })
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save lesson');
      }
  
      onFormSubmit();
      onClose();
    } catch (error) {
      console.error('Error saving lesson:', error);
      if (error instanceof Error) {
        alert(error.message || 'Failed to save lesson');
      } else {
        alert('Failed to save lesson');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async () => {
    if (!selectedLesson) return;

    try {
      const response = await fetch(`/cursos/api/lessons/${selectedLesson.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete lesson');

      onFormSubmit();
      onClose();
    } catch (error) {
      console.error('Error deleting lesson:', error);
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
              {selectedLesson ? 'Editar Aula' : 'Nova Aula'}
            </h2>
            <div className="flex gap-2">
              {selectedLesson && (
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
                  placeholder="Título da aula"
                  className="w-full bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da aula"
                  className="w-full bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL do Vídeo</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="URL do vídeo"
                  className="w-full bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Input
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Conteúdo da aula"
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá excluir permanentemente esta aula.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLesson}
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