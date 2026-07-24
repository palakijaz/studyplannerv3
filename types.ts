export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string; // TailWind color class e.g. "bg-indigo-500" or hex
  targetHoursWeek: number;
  iconName?: string;
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string;
  estimatedMinutes: number;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  notes?: string;
  isAiGenerated?: boolean;
}

export interface StudyPlanSession {
  id: string;
  topic: string;
  durationMinutes: number;
  activityType: 'reading' | 'practice' | 'review' | 'quiz';
  description: string;
  completed?: boolean;
}

export interface StudyPlanDay {
  dayNumber: number;
  date?: string;
  title: string;
  objectives: string[];
  sessions: StudyPlanSession[];
}

export interface StudyPlan {
  id: string;
  title: string;
  subjectId: string;
  examDate: string;
  overview: string;
  days: StudyPlanDay[];
  studyTips: string[];
  createdAt: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  mastered?: boolean;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subjectId: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subjectId: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface StudySessionLog {
  id: string;
  subjectId: string;
  durationMinutes: number;
  date: string; // ISO date or string YYYY-MM-DD
  type: 'pomodoro' | 'custom' | 'quiz';
  notes?: string;
}

export interface Note {
  id: string;
  title: string;
  subjectId: string;
  content: string;
  summary?: string;
  keyTakeaways?: string[];
  keyTerms?: { term: string; definition: string }[];
  reviewQuestions?: string[];
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserStats {
  streakDays: number;
  totalStudyMinutes: number;
  todayStudyMinutes: number;
  completedTasksCount: number;
  quizzesTaken: number;
}
