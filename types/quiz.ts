// types/quiz.ts
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
  
  export interface MultipleChoiceAnswer {
    soalId: string;
    jawaban: number;
  }
  
  export interface EssayAnswer {
    soalId: string;
    jawaban: string;
  }
  
  export interface QuizResult {
    quizId: string;
    quizTitle: string;
    type: 'MULTIPLE_CHOICE' | 'ESSAY';
    materiId: string;
    materiTitle: string;
    avgScore: number;
    totalQuestions: number;
    answeredQuestions: number;
  }
  
  export interface MultipleChoiceSubmissionResult {
    results: {
      id: string;
      soalId: string;
      jawaban: number;
      isCorrect: boolean;
      nilai: number;
    }[];
    totalScore: number;
  }
  
  export interface EssaySubmissionResult {
    id: string;
    soalId: string;
    jawaban: string;
    nilai: number | null;
  }