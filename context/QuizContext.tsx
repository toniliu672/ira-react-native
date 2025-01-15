// context/QuizContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Quiz, QuizDetail } from '@/types/quiz';
import { Materi } from '@/types/materi';

interface LastCompletedQuiz {
  materiId: string;
  quizId: string;
  type: 'MULTIPLE_CHOICE' | 'ESSAY';
}

interface QuizContextType {
  selectedMateri: Materi | null;
  selectedQuiz: Quiz | null;
  setSelectedMateri: (materi: Materi | null) => void;
  setSelectedQuiz: (quiz: Quiz | null) => void;
  clearSelections: () => void;
  lastCompletedQuiz: LastCompletedQuiz | null;
  setLastCompletedQuiz: (quiz: LastCompletedQuiz | null) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [selectedMateri, setSelectedMateri] = useState<Materi | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [lastCompletedQuiz, setLastCompletedQuiz] = useState<LastCompletedQuiz | null>(null);

  const clearSelections = () => {
    setSelectedMateri(null);
    setSelectedQuiz(null);
  };

  return (
    <QuizContext.Provider 
      value={{
        selectedMateri,
        selectedQuiz,
        setSelectedMateri,
        setSelectedQuiz,
        clearSelections,
        lastCompletedQuiz,
        setLastCompletedQuiz
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}