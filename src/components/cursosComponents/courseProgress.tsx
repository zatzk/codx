// components/CourseProgress.tsx
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface CourseProgressProps {
  userId: string;
  courseId: number;
}

export default function CourseProgress({ userId, courseId }: CourseProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      setIsLoading(true);
      try {
        const response = await fetch(`/cursos/api/progress/${userId}/${courseId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProgress(data.progress);
      } catch (error) {
        console.error('Failed to fetch course progress:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgress();
  }, [userId, courseId]);

  if (isLoading) {
    return <div>Loading progress...</div>;
  }

  return (
    <div>
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-gray-600 mt-1">{progress}% complete</p>
    </div>
  );
}