/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// components/trilhasComponents/trilhasDrawer.tsx
// components/trilhasComponents/trilhasDrawer.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { X, Trash } from "lucide-react";
import { useColorContext } from "../../lib/colorContext";
import { Silkscreen } from "next/font/google";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans"
});

interface Trilha {
  id: number;
  name: string;
  description: string;
  data: string;
  links: Record<string, string>;
  level: number;
  createdAt: string;
  updatedAt: string | null;
}

interface TrilhaGroup {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  trilhas: Trilha[];
}

interface TrilhasDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmit: () => void;
  trilha?: Trilha | null;
}

export function TrilhasDrawer({ isOpen, onClose, onFormSubmit, trilha }: TrilhasDrawerProps) {
  const { activeColorSet } = useColorContext();
  const [loading, setLoading] = useState(false);
  const [trilhaGroup, setTrilhaGroup] = useState<TrilhaGroup | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    data: "",
    links: {},
    level: 0,
    trilhas: [] as Trilha[],
    trilhasToDelete: [] as number[]
  });

  useEffect(() => {
    async function fetchTrilhaData() {
      if (trilha?.name) {
        setLoading(true);
        try {
          const response = await fetch(`/trilhas/api/${trilha.name}`);
          if (!response.ok) throw new Error('Failed to fetch trilha data');
          const data = await response.json();
          setTrilhaGroup(data[0]);
          setFormData({
            name: data[0].name,
            description: data[0].description,
            data: data[0].data,
            links: data[0].links,
            level: data[0].level,
            trilhas: data[0].trilhas,
            trilhasToDelete: []
          });
        } catch (error) {
          console.error('Error fetching trilha data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setFormData({
          name: "",
          description: "",
          data: "",
          links: {},
          level: 0,
          trilhas: [],
          trilhasToDelete: []
        });
        setTrilhaGroup(null);
      }
    }

    if (isOpen) {
      void fetchTrilhaData();
    }
  }, [isOpen, trilha]);

  const handleAddTrilha = () => {
    const newTrilha: Trilha = {
      id: 0,
      name: "",
      description: "",
      data: "",
      links: {},
      level: 0,
      createdAt: new Date().toISOString(),
      updatedAt: null
    };

    setFormData(prev => ({
      ...prev,
      trilhas: [...prev.trilhas, newTrilha]
    }));
  };

  const handleDeleteTrilhaGroup = async () => {
    if (!trilhaGroup?.id) return;
    
    try {
      const response = await fetch(`/trilhas/api/${trilhaGroup.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete trilha group');
      }

      onClose();
    } catch (error) {
      console.error('Error deleting trilha group:', error);
    }
  };

  const handleRemoveTrilha = (index: number) => {
    const trilhaToRemove = formData.trilhas[index];
    
    setFormData(prev => {
      const newTrilhas = prev.trilhas.filter((_, i) => i !== index);
      let newTrilhasToDelete = [...prev.trilhasToDelete];
      
      if (trilhaToRemove && trilhaToRemove.id > 0) {
        newTrilhasToDelete = [...newTrilhasToDelete, trilhaToRemove.id];
      }
      
      return {
        ...prev,
        trilhas: newTrilhas,
        trilhasToDelete: newTrilhasToDelete
      };
    });
  };

  const handleTrilhaChange = (index: number, field: keyof Trilha, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      trilhas: prev.trilhas.map((t, i) => 
        i === index ? { ...t, [field]: value } : t
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const isNewTrilhaGroup = !trilhaGroup;
      
      const url = isNewTrilhaGroup 
        ? '/trilhas/api'
        : `/trilhas/api/${trilhaGroup?.id}`;
      
      const method = isNewTrilhaGroup ? 'POST' : 'PUT';
      
      const requestData = {
        name: formData.name,
        description: formData.description,
        data: formData.data,
        links: formData.links,
        level: formData.level,
        trilhasToDelete: formData.trilhasToDelete
      };
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save trilha group');
      }
  
      const result = await response.json();
      console.log('Success:', result);
      
      onFormSubmit();
      onClose();
    } catch (error) {
      console.error('Error saving trilha group:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      <div className={`fixed right-0 top-0 h-full w-[600px] ${activeColorSet.bg} text-white backdrop-blur-md rounded-l-xl bg-opacity-10 z-50
          shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-7 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h2 className={`${silkscreen.className} text-lg font-semibold`}>
              {trilha ? 'Editar trilha' : 'Nova trilha'}
            </h2>
            <div className="flex gap-2">
              {trilhaGroup && (
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
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do grupo de trilhas"
                  className="w-full bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do grupo de trilhas"
                  className="w-full bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Dados</Label>
                <Textarea
                  id="data"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  placeholder="Dados da trilha"
                  className="w-full bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="links">Links</Label>
                <Input
                  id="links"
                  value={JSON.stringify(formData.links)}
                  onChange={(e) => setFormData({ ...formData, links: JSON.parse(e.target.value) })}
                  placeholder="Links da trilha"
                  className="w-full bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Nível</Label>
                <Input
                  id="level"
                  type="number"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  placeholder="Nível da trilha"
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este grupo de trilhas
              e todas as trilhas associadas a ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTrilhaGroup}
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