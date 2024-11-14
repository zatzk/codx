/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from 'react';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { X, Plus, Trash } from "lucide-react";
import { useColorContext } from "../../lib/colorContext";
import { Silkscreen } from "next/font/google";
import { Textarea } from "~/components/ui/textarea";
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

interface Example {
  inputText: string;
  outputText: string;
}

interface TestCase {
  id?: number;
  input: string;
  target?: string;
  expectedOutput: string;
}

interface Desafio {
  id?: number;
  title: string;
  problemStatement: string;
  starterCode: string;
  functionName: string;
  examples: Example[];
  difficulty: string;
  category: string;
  testCases: TestCase[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface DesafioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmit: () => void;
  desafio: Desafio | null;
}

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
export const CATEGORY_OPTIONS = ["Arrays", "Strings", "Linked List", "Binary Search", "Dynamic Programming"];

export default function DesafioDrawer({ isOpen, onClose, onFormSubmit, desafio }: DesafioDrawerProps) {
  console.log(desafio);
  const { activeColorSet } = useColorContext();
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<Desafio>({
    title: "",
    problemStatement: "",
    starterCode: "",
    functionName: "",
    examples: [],
    testCases: [],
    difficulty: "Easy",
    category: "Arrays"
  });

  useEffect(() => {
    if (isOpen && desafio) {
      setFormData(desafio);
    } else if (isOpen) {
      setFormData({
        title: "",
        problemStatement: "",
        starterCode: "",
        functionName: "",
        examples: [],
        testCases: [],
        difficulty: "Easy",
        category: "Arrays"
      });
    }
  }, [isOpen, desafio]);

  const handleAddExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [
        ...prev.examples,
        { inputText: "", target: "", outputText: "" }
      ]
    }));
  };

  const handleRemoveExample = (index: number) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const handleExampleChange = (index: number, field: 'inputText' | 'outputText', value: string) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const handleAddTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [
        ...prev.testCases,
        { input: "", target: "", expectedOutput: "" }
      ]
    }));
  };

  const handleRemoveTestCase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  const handleTestCaseChange = (index: number, field: keyof TestCase, value: string) => {
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases.map((tc, i) => 
        i === index ? { ...tc, [field]: value } : tc
      )
    }));
  };

  const handleDeleteDesafio = async () => {
    if (!desafio?.id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/desafios/api/${desafio.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete desafio');

      onFormSubmit();
      onClose();
    } catch (error) {
      console.error('Error deleting desafio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const url = desafio ? `/desafios/api/${desafio.id}` : '/desafios/api';
      const method = desafio ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save desafio');

      onFormSubmit();
      onClose();
    } catch (error) {
      console.error('Error saving desafio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      <div className={`fixed right-0 top-0 h-full w-[600px] ${activeColorSet?.bg} text-white backdrop-blur-md rounded-l-xl bg-opacity-10 z-50
          shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-7 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`${silkscreen.className} text-lg font-semibold`}>
              {desafio ? 'Editar desafio' : 'Novo desafio'}
            </h2>
            <div className="flex gap-2">
              {desafio && (
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
              {/* Basic Info */}
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título do desafio"
                  className="w-full bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label>Enunciado do Problema</Label>
                <Textarea
                  value={formData.problemStatement}
                  onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                  placeholder="Descreva o problema"
                  className="w-full bg-transparent"
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Código Inicial</Label>
                <Textarea
                  value={formData.starterCode}
                  onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
                  placeholder="Código inicial para o desafio"
                  className="w-full bg-transparent font-mono"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Nome da Função</Label>
                <Input
                  value={formData.functionName}
                  onChange={(e) => setFormData({ ...formData, functionName: e.target.value })}
                  placeholder="Nome da função a ser implementada"
                  className="w-full bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label>Dificuldade</Label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full bg-transparent border border-gray-700 rounded-md p-2"
                >
                  {DIFFICULTY_OPTIONS.map(diff => (
                    <option key={diff} value={diff} className="bg-gray-800">
                      {diff}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-transparent border border-gray-700 rounded-md p-2"
                >
                  {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat} value={cat} className="bg-gray-800">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Examples Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Exemplos</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddExample}
                    className="border-gray-700 hover:border-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Exemplo
                  </Button>
                </div>

                {formData.examples.map((example, index) => (
                  <div key={index} className="space-y-4 p-4 border border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <Label>Exemplo {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemoveExample(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Input</Label>
                        <Input
                          value={example.inputText}
                          onChange={(e) => handleExampleChange(index, 'inputText', e.target.value)}
                          placeholder="Exemplo de entrada"
                          className="w-full bg-transparent mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label>Output</Label>
                        <Input
                          value={example.outputText}
                          onChange={(e) => handleExampleChange(index, 'outputText', e.target.value)}
                          placeholder="Exemplo de saída"
                          className="w-full bg-transparent mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Test Cases Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Casos de Teste</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTestCase}
                    className="border-gray-700 hover:border-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Caso de Teste
                  </Button>
                </div>

                {formData.testCases.map((testCase, index) => (
                  <div key={index} className="space-y-4 p-4 border border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <Label>Caso de Teste {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemoveTestCase(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Input</Label>
                        <Input
                          value={testCase.input}
                          onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                          placeholder="Entrada do teste"
                          className="w-full bg-transparent mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label>Target</Label>
                        <Input
                          value={testCase.target}
                          onChange={(e) => handleTestCaseChange(index, 'target', e.target.value)}
                          placeholder="Valor alvo"
                          className="w-full bg-transparent mt-2"
                        />
                      </div>

                      <div>
                        <Label>Expected Output</Label>
                        <Input
                          value={testCase.expectedOutput}
                          onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                          placeholder="Saída esperada"
                          className="w-full bg-transparent mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-2 fixed bottom-6 right-6 w-[calc(100%-250px)]">
                <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent border-gray-700 hover:border-white">
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
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este desafio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDesafio}
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