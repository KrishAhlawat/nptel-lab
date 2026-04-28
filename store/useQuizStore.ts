import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Question } from "@/types";

interface QuizState {
  // Questions
  quizQuestions: Question[];
  currentQuestionIndex: number;

  // Answers
  selectedAnswers: Record<string, string>;

  // Submission
  isSubmitted: boolean;

  // Timer
  timeLeft: number;
  isTimerRunning: boolean;
  timerEnabled: boolean;

  // Actions
  setQuizQuestions: (questions: Question[]) => void;
  selectAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  setTimer: (seconds: number) => void;
  tickTimer: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  setTimerEnabled: (enabled: boolean) => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      quizQuestions: [],
      currentQuestionIndex: 0,
      selectedAnswers: {},
      isSubmitted: false,
      timeLeft: 600,
      isTimerRunning: false,
      timerEnabled: true,

      setQuizQuestions: (questions) =>
        set({
          quizQuestions: questions,
          currentQuestionIndex: 0,
          selectedAnswers: {},
          isSubmitted: false,
        }),

      selectAnswer: (questionId, answer) =>
        set((state) => ({
          selectedAnswers: { ...state.selectedAnswers, [questionId]: answer },
        })),

      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.min(
            state.currentQuestionIndex + 1,
            state.quizQuestions.length - 1
          ),
        })),

      prevQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
        })),

      goToQuestion: (index) => set({ currentQuestionIndex: index }),

      submitQuiz: () => set({ isSubmitted: true, isTimerRunning: false }),

      resetQuiz: () =>
        set({
          quizQuestions: [],
          currentQuestionIndex: 0,
          selectedAnswers: {},
          isSubmitted: false,
          timeLeft: 600,
          isTimerRunning: false,
        }),

      setTimer: (seconds) => set({ timeLeft: seconds }),

      tickTimer: () => {
        const { timeLeft, isTimerRunning } = get();
        if (!isTimerRunning) return;
        if (timeLeft <= 1) {
          set({ timeLeft: 0, isTimerRunning: false, isSubmitted: true });
        } else {
          set({ timeLeft: timeLeft - 1 });
        }
      },

      startTimer: () => set({ isTimerRunning: true }),
      stopTimer: () => set({ isTimerRunning: false }),
      setTimerEnabled: (enabled) => set({ timerEnabled: enabled }),
    }),
    {
      name: "nptel-quiz-store",
      partialize: (state) => ({
        selectedAnswers: state.selectedAnswers,
        currentQuestionIndex: state.currentQuestionIndex,
        quizQuestions: state.quizQuestions,
        isSubmitted: state.isSubmitted,
        timeLeft: state.timeLeft,
        timerEnabled: state.timerEnabled,
      }),
    }
  )
);
