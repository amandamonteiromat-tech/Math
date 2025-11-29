export type GradeLevel = '6ano' | '7ano' | '8ano' | '9ano';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  gradeLevel: GradeLevel;
  createdAt: number;
}

export interface StudentAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizAttempt {
  id: string;
  studentName: string;
  gradeLevel: GradeLevel;
  timestamp: number;
  score: number;
  totalQuestions: number;
  answers: StudentAnswer[];
}

export type ViewState = 'HOME' | 'STUDENT_LOGIN' | 'STUDENT_QUIZ' | 'TEACHER_DASHBOARD';