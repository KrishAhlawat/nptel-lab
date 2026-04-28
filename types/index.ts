export type Question = {
  id: string;
  week: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

export type QuizMode = "week" | "full";

export type LearnMode = "ordered" | "randomized";

export type ViewMode = "single" | "list";
