// types/quiz.ts

export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: string[];
}

// Quiz Types
export interface Quiz {
  id: string;
  judul: string;
  deskripsi: string;
  type: 'MULTIPLE_CHOICE' | 'ESSAY';
  status: boolean;
  materiId: string;
}

export interface QuizQuestion {
  id: string;
  pertanyaan: string;
  opsiJawaban?: string[];
  status: boolean;
}

export interface QuizDetail {
  quiz: Quiz;
  questions: QuizQuestion[];
}

// Answer Types
export interface MultipleChoiceAnswer {
  soalId: string;
  jawaban: number; // 0-3
}

export interface EssayAnswer {
  soalId: string;
  jawaban: string;
}

// Submit Response Types
export interface MultipleChoiceSubmitResponse {
  submitted: number;
  failed: number;
  avgScore: number;
}

export interface EssaySubmitResponse {
  id: string;
  status: 'PENDING_REVIEW';
}

// Result Types
export interface QuizResult {
  quizId: string;
  quizTitle: string;
  type: 'MULTIPLE_CHOICE' | 'ESSAY';
  score: number;
  progress: {
    completed: number;
    total: number; // Tambahkan ini
    isComplete: boolean;
    lastSubmitted: string;
  };
}

export interface QuizResultDetail {
  quiz: {
    id: string;
    judul: string;
    type: 'MULTIPLE_CHOICE' | 'ESSAY';
    materiId: string;
  };
  answers: Array<{
    id: string;
    soalRef: {
      pertanyaan: string;
      quizId: string;
    };
    jawaban: string | number;
    nilai: number;
    feedback?: string;
    isCorrect?: boolean;
  }>;
  summary: {
    totalAnswered: number;
    avgScore: number;
    isComplete: boolean;
  };
}

// Ranking Types
export interface QuizRanking {
  rankings: Array<{
    rank: number;
    username: string;
    name: string;
    score: number;
    lastSubmitted: string;
    isYou: boolean;
  }>;
  user: {
    rank: number;
    score: number;
  };
}