"use client";

import { useState, useCallback, useEffect } from "react";
import { Send } from "lucide-react";
import questionsData from "@/data/nptel_lab_questions.json";
import type { Question } from "@/types";
import Timer from "@/components/Timer";
import ResultsView from "@/components/ResultsView";
import WeekSelector from "@/components/WeekSelector";

const allQuestions: Question[] = questionsData as Question[];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "setup" | "quiz" | "results";

export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [quizMode, setQuizMode] = useState<"week" | "full">("week");
  const [pickWeek, setPickWeek] = useState<number>(1);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [elapsed, setElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const startQuiz = () => {
    const qs = quizMode === "full"
      ? shuffleArray(allQuestions)
      : shuffleArray(allQuestions.filter((q) => q.week === pickWeek));
    setQuizQuestions(qs);
    setSelectedAnswers({});
    setElapsed(0);
    setIsTimerRunning(true);
    setPhase("quiz");
    window.scrollTo({ top: 0 });
  };

  const handleTick = useCallback(() => setElapsed((t) => t + 1), []);

  const handleSubmit = () => {
    setIsTimerRunning(false);
    setPhase("results");
    // Scroll to top so score is immediately visible
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setPhase("setup");
    setQuizQuestions([]);
    setSelectedAnswers({});
    setElapsed(0);
    setIsTimerRunning(false);
    window.scrollTo({ top: 0 });
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const total = quizQuestions.length;

  // ── SETUP ──
  if (phase === "setup") {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-white mb-1">Quiz</h1>
          <p className="text-sm text-[#71717a]">Answer at your own pace. Timer tracks how long you take.</p>
        </div>

        <div className="flex rounded-xl border border-[#1f1f1f] overflow-hidden mb-6">
          <button onClick={() => setQuizMode("week")}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${quizMode === "week" ? "bg-[#22c55e]/8 text-[#22c55e]" : "text-[#71717a] hover:text-white"}`}>
            Week Quiz
          </button>
          <button onClick={() => setQuizMode("full")}
            className={`flex-1 py-2.5 text-sm font-medium border-l border-[#1f1f1f] transition-all ${quizMode === "full" ? "bg-white/5 text-white" : "text-[#71717a] hover:text-white"}`}>
            Full Quiz (120 Qs)
          </button>
        </div>

        {quizMode === "week" && (
          <div className="mb-6">
            <p className="text-xs text-[#71717a] mb-3">Select week · 10 questions</p>
            <WeekSelector selectedWeek={pickWeek} onSelect={(w) => setPickWeek(w ?? 1)} allowAll={false} />
          </div>
        )}
        {quizMode === "full" && (
          <div className="mb-6 p-4 rounded-xl border border-[#1f1f1f]">
            <p className="text-sm text-[#a1a1aa]">120 questions · All 12 weeks, randomized</p>
          </div>
        )}

        <button onClick={startQuiz}
          className="w-full py-3 rounded-xl bg-[#22c55e] text-black font-semibold text-sm hover:bg-[#16a34a] transition-colors">
          Start Quiz
        </button>
      </div>
    );
  }

  // ── RESULTS ──
  if (phase === "results") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <ResultsView questions={quizQuestions} selectedAnswers={selectedAnswers} onRetry={handleReset}
          title={quizMode === "full" ? "Full Quiz Results" : `Week ${pickWeek} Results`} elapsed={elapsed} />
      </div>
    );
  }

  // ── QUIZ (long scroll) ──
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-28">
      {/* Sticky top bar: progress + timer */}
      <div className="sticky top-14 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1f1f1f] pb-3 mb-8 pt-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-[#71717a]">{answeredCount}/{total} answered</p>
          <Timer elapsed={elapsed} isRunning={isTimerRunning} onTick={handleTick} />
        </div>
        <div className="h-px bg-[#1f1f1f] rounded-full overflow-hidden">
          <div className="h-full bg-[#22c55e] rounded-full transition-all duration-300"
            style={{ width: `${total > 0 ? (answeredCount / total) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {quizQuestions.map((question, i) => {
          const selected = selectedAnswers[question.id];
          return (
            <div key={question.id} className="border border-[#1f1f1f] rounded-xl p-5">
              <div className="flex gap-3 mb-4">
                <span className="shrink-0 text-xs font-semibold text-[#71717a] w-6 pt-0.5">{i + 1}.</span>
                <p className="text-white text-sm leading-relaxed">{question.question}</p>
              </div>
              <div className="space-y-2 pl-9">
                {question.options.map((option, oi) => {
                  const isSelected = option === selected;
                  return (
                    <button key={oi}
                      onClick={() => setSelectedAnswers((prev) => ({ ...prev, [question.id]: option }))}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#22c55e]/40 bg-[#22c55e]/8 text-[#22c55e]"
                          : "border-[#1f1f1f] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white"
                      }`}>
                      <span className="shrink-0 w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold text-[#3f3f46]">
                        {["A","B","C","D"][oi]}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed bottom submit bar — always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-[#1f1f1f]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#71717a]">{answeredCount} of {total} answered</p>
            {answeredCount < total && (
              <p className="text-[11px] text-[#3f3f46]">{total - answeredCount} remaining</p>
            )}
          </div>
          <button onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22c55e] text-black font-semibold text-sm hover:bg-[#16a34a] transition-colors shrink-0">
            <Send className="w-3.5 h-3.5" />
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
