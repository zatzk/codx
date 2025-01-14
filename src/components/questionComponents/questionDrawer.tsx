/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useEffect, useState } from "react";
import { X, Plus, Trash } from "lucide-react";
import { useColorContext } from "../../lib/colorContext";
import { Silkscreen } from "next/font/google";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
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

interface Question {
  id: string;
  name: string;
}

interface DetailedQuestion {
  id: number;
  questionGroupId: number;
  question: string;
  answer: string;
  topics: string[];
  createdAt: string;
  updatedAt: string | null;
}

interface QuestionGroup {
  id: number;
  name: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  questions: DetailedQuestion[];
}

interface QuestionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmit: () => void;
  question: Question | null;
}

const AVAILABLE_TOPICS = ["Core", "Event", "Beginner", "Intermediate", "Advanced"];

export function QuestionDrawer({ isOpen, onClose, onFormSubmit, question }: QuestionDrawerProps) {
  const { activeColorSet } = useColorContext();
  const [loading, setLoading] = useState(false);
  const [questionGroup, setQuestionGroup] = useState<QuestionGroup | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    questions: [] as DetailedQuestion[],
    questionsToDelete: [] as number[]
  });

  useEffect(() => {
    async function fetchQuestionData() {
      if (question?.name) {
        setLoading(true);
        try {
          const response = await fetch(`/questoes/api/${question.name}`);
          if (!response.ok) throw new Error('Failed to fetch question data');
          const data = await response.json();
          setQuestionGroup(data[0]);
          setFormData({
            name: data[0].name,
            title: data[0].title,
            description: data[0].description,
            questions: data[0].questions || [],
            questionsToDelete: []
          });
        } catch (error) {
          console.error('Error fetching question data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setFormData({
          name: "",
          title: "",
          description: "",
          questions: [],
          questionsToDelete: []
        });
        setQuestionGroup(null);
      }
    }

    if (isOpen) {
      void fetchQuestionData();
    }
  }, [isOpen, question]);

  const handleAddQuestion = () => {
    const newQuestion: DetailedQuestion = {
      id: Date.now(),
      questionGroupId: questionGroup?.id ?? 0,
      question: "",
      answer: "",
      topics: [],
      createdAt: new Date().toISOString(),
      updatedAt: null
    };

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const handleDeleteQuestionGroup = async () => {
    if (!questionGroup?.id) return;
    
    try {
      const response = await fetch(`/questoes/api/${questionGroup.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete question group');
      }

      onClose();
    } catch (error) {
      console.error('Error deleting question group:', error);
    }
  };

  const handleRemoveQuestion = (index: number) => {
    const questionToRemove = formData.questions[index];
    
    setFormData(prev => {
      const newQuestions = prev.questions.filter((_, i) => i !== index);
      let newQuestionsToDelete = [...prev.questionsToDelete];
      
      if (questionToRemove && questionToRemove.id > 0) {
        newQuestionsToDelete = [...newQuestionsToDelete, questionToRemove.id];
      }
      
      return {
        ...prev,
        questions: newQuestions,
        questionsToDelete: newQuestionsToDelete
      };
    });
  };

  const handleQuestionChange = (index: number, field: keyof DetailedQuestion, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleTopicToggle = (index: number, topic: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === index) {
          const newTopics = q.topics.includes(topic)
            ? q.topics.filter(t => t !== topic)
            : [...q.topics, topic];
          return { ...q, topics: newTopics };
        }
        return q;
      })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const isNewQuestionGroup = !questionGroup;
      
      const url = isNewQuestionGroup 
        ? '/questoes/api'
        : `/questoes/api/${questionGroup?.id}`;
      
      const method = isNewQuestionGroup ? 'POST' : 'PUT';
      
      const requestData = {
        name: formData.name,
        title: formData.title,
        description: formData.description,
        questions: formData.questions.map(q => ({
          ...(isNewQuestionGroup ? {} : { id: q.id > 0 ? q.id : undefined }),
          question: q.question,
          answer: q.answer,
          topics: q.topics
        })),
        questionsToDelete: formData.questionsToDelete
      };
  
      console.log('Sending request:', {
        method,
        url,
        data: requestData
      });
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save question group');
      }
  
      const result = await response.json();
      console.log('Success:', result);
      
      onFormSubmit();
      onClose();
    } catch (error) {
      console.error('Error saving question group:', error);
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
              {question ? 'Editar deck' : 'Novo deck'}
            </h2>
            <div className="flex gap-2">
              {questionGroup && (
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
                  placeholder="Nome do grupo de questões"
                  className="w-full bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título do grupo"
                  className="w-full bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do grupo de questões"
                  className="w-full bg-transparent"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Questões</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddQuestion}
                    className={`${activeColorSet.borderButton} bg-none hover:border-white`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Questão
                  </Button>
                </div>

                {formData.questions.map((q, index) => (
                  <div key={q.id} className="space-y-4 p-4 border border-white/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <Label>Questão {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemoveQuestion(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Pergunta</Label>
                        <Textarea
                          value={q.question}
                          onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                          placeholder="Digite a pergunta"
                          className="w-full bg-transparent mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label>Resposta</Label>
                        <Textarea
                          value={q.answer}
                          onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                          placeholder="Digite a resposta"
                          className="w-full bg-transparent mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Tópicos</Label>
                        <div className="flex flex-wrap gap-2">
                          {AVAILABLE_TOPICS.map(topic => (
                            <Badge
                              key={topic}
                              variant={q.topics.includes(topic) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => handleTopicToggle(index, topic)}
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este grupo de questões
              e todas as questões associadas a ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteQuestionGroup}
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