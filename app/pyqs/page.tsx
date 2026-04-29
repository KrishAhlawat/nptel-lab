"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Send,
  Shuffle,
  AlignJustify,
  BookOpen,
  Zap,
  Eye,
  EyeOff,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import pyqData from "@/data/PYQs.json";
import type { Question } from "@/types";
import Timer from "@/components/Timer";
import ResultsView from "@/components/ResultsView";
import QuestionCard from "@/components/QuestionCard";

const allPYQs: Question[] = pyqData as Question[];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface DisplayQuestion extends Question {
  displayOptions: string[];
}

type Mode = "home" | "learn" | "quiz";
type QuizPhase = "setup" | "quiz" | "results";
type QuizCount = 50 | 120;

const weeks = Array.from({ length: 12 }, (_, i) => i + 1);

// ─── Learn Sub-page ───────────────────────────────────────────────────────────
function LearnMode({ onBack }: { onBack: () => void }) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [isRandomized, setIsRandomized] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const displayQuestions = useMemo(() => {
    const filtered =
      selectedWeek === null
        ? allPYQs
        : allPYQs.filter((q) => q.week === selectedWeek);
    return isRandomized ? shuffleArray(filtered) : filtered;
  }, [selectedWeek, isRandomized]);

  const grouped = useMemo(() => {
    if (selectedWeek !== null) return null;
    const map: Record<number, Question[]> = {};
    displayQuestions.forEach((q) => {
      if (!map[q.week]) map[q.week] = [];
      map[q.week].push(q);
    });
    return map;
  }, [selectedWeek, displayQuestions]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-7 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-[#52525b] hover:text-white transition-colors text-xs"
        >
          ← PYQs
        </button>
        <span className="text-[#3f3f46] text-xs">/</span>
        <h1 className="text-sm font-semibold text-white">Learn</h1>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={() => setSelectedWeek(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            selectedWeek === null
              ? "border-[#22c55e]/40 text-[#22c55e] bg-[#22c55e]/8"
              : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"
          }`}
        >
          All
        </button>
        {weeks.map((w) => (
          <button
            key={w}
            onClick={() => setSelectedWeek(w)}
            className={`w-8 h-8 rounded-lg text-xs font-medium border transition-all ${
              selectedWeek === w
                ? "border-[#22c55e]/40 text-[#22c55e] bg-[#22c55e]/8"
                : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"
            }`}
          >
            {w}
          </button>
        ))}

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => setIsRandomized(!isRandomized)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isRandomized
                ? "border-[#22c55e]/40 text-[#22c55e] bg-[#22c55e]/8"
                : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"
            }`}
          >
            <Shuffle className="w-3 h-3" /> Shuffle
          </button>
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showAnswer
                ? "border-[#22c55e]/40 text-[#22c55e] bg-[#22c55e]/8"
                : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"
            }`}
          >
            {showAnswer ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {showAnswer ? "Answers on" : "Show answers"}
          </button>
        </div>
      </div>

      <p className="text-xs text-[#3f3f46] mb-6">
        {displayQuestions.length} questions
        {selectedWeek ? ` · Week ${selectedWeek}` : " · All weeks"} · PYQs
      </p>

      {grouped ? (
        <div className="space-y-10">
          {Object.entries(grouped)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([week, qs]) => (
              <section key={week}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[11px] font-semibold text-[#22c55e] uppercase tracking-widest">
                    Week {week}
                  </span>
                  <div className="flex-1 h-px bg-[#1f1f1f]" />
                </div>
                <div className="space-y-3">
                  {qs.map((q, i) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      index={i + 1}
                      selectedAnswer={selectedAnswers[q.id]}
                      showAnswer={showAnswer}
                      onSelect={(ans) =>
                        setSelectedAnswers((prev) => ({ ...prev, [q.id]: ans }))
                      }
                    />
                  ))}
                </div>
              </section>
            ))}
        </div>
      ) : (
        <div className="space-y-3">
          {displayQuestions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i + 1}
              selectedAnswer={selectedAnswers[q.id]}
              showAnswer={showAnswer}
              onSelect={(ans) =>
                setSelectedAnswers((prev) => ({ ...prev, [q.id]: ans }))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Quiz Sub-page ────────────────────────────────────────────────────────────
function QuizMode({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<QuizPhase>("setup");
  const [quizCount, setQuizCount] = useState<QuizCount>(50);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<DisplayQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [elapsed, setElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const startQuiz = () => {
    let base = [...allPYQs];
    if (randomizeQuestions) base = shuffleArray(base);
    if (quizCount === 50) base = base.slice(0, 50);
    const qs: DisplayQuestion[] = base.map((q) => ({
      ...q,
      displayOptions: shuffleAnswers ? shuffleArray(q.options) : q.options,
    }));
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

  // ── Setup ──
  if (phase === "setup") {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-[#52525b] hover:text-white transition-colors text-xs"
          >
            ← PYQs
          </button>
          <span className="text-[#3f3f46] text-xs">/</span>
          <h1 className="text-sm font-semibold text-white">Quiz</h1>
        </div>

        {/* Question count toggle */}
        <div className="flex rounded-xl border border-[#1f1f1f] overflow-hidden mb-6">
          <button
            onClick={() => setQuizCount(50)}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${
              quizCount === 50
                ? "bg-[#22c55e]/8 text-[#22c55e]"
                : "text-[#71717a] hover:text-white"
            }`}
          >
            Random 50 Qs
          </button>
          <button
            onClick={() => setQuizCount(120)}
            className={`flex-1 py-2.5 text-sm font-medium border-l border-[#1f1f1f] transition-all ${
              quizCount === 120
                ? "bg-white/5 text-white"
                : "text-[#71717a] hover:text-white"
            }`}
          >
            All 120 Qs
          </button>
        </div>

        <div className="mb-6 p-4 rounded-xl border border-[#1f1f1f]">
          <p className="text-sm text-[#a1a1aa]">
            {quizCount === 50
              ? "50 randomly selected PYQs · All 12 weeks"
              : "120 PYQs · All 12 weeks"}
          </p>
          <p className="text-xs text-[#52525b] mt-1">
            Previous Year Questions from NPTEL ESD
          </p>
        </div>

        {/* Options */}
        <div className="mb-6 space-y-2">
          <p className="text-xs text-[#52525b] uppercase tracking-wider mb-3">
            Options
          </p>
          <button
            onClick={() => setRandomizeQuestions((v) => !v)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
              randomizeQuestions
                ? "border-[#22c55e]/30 bg-[#22c55e]/6 text-[#22c55e]"
                : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"
            }`}
          >
            <Shuffle className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">Randomize question order</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                randomizeQuestions
                  ? "bg-[#22c55e]/15 text-[#22c55e]"
                  : "bg-[#1f1f1f] text-[#52525b]"
              }`}
            >
              {randomizeQuestions ? "On" : "Off"}
            </span>
          </button>
          <button
            onClick={() => setShuffleAnswers((v) => !v)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
              shuffleAnswers
                ? "border-[#22c55e]/30 bg-[#22c55e]/6 text-[#22c55e]"
                : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"
            }`}
          >
            <AlignJustify className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">Shuffle answer choices</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                shuffleAnswers
                  ? "bg-[#22c55e]/15 text-[#22c55e]"
                  : "bg-[#1f1f1f] text-[#52525b]"
              }`}
            >
              {shuffleAnswers ? "On" : "Off"}
            </span>
          </button>
        </div>

        <button
          onClick={startQuiz}
          className="w-full py-3 rounded-xl bg-[#22c55e] text-black font-semibold text-sm hover:bg-[#16a34a] transition-colors"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  // ── Results ──
  if (phase === "results") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <ResultsView
          questions={quizQuestions}
          selectedAnswers={selectedAnswers}
          onRetry={handleReset}
          title={`PYQ Quiz Results (${total} Qs)`}
          elapsed={elapsed}
        />
      </div>
    );
  }

  // ── Active Quiz ──
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-28">
      {/* Sticky top bar */}
      <div className="sticky top-14 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1f1f1f] pb-3 mb-8 pt-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-[#71717a]">
            {answeredCount}/{total} answered · PYQs
          </p>
          <Timer elapsed={elapsed} isRunning={isTimerRunning} onTick={handleTick} />
        </div>
        <div className="h-px bg-[#1f1f1f] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#22c55e] rounded-full transition-all duration-300"
            style={{ width: `${total > 0 ? (answeredCount / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {quizQuestions.map((question, i) => {
          const selected = selectedAnswers[question.id];
          return (
            <div key={question.id} className="border border-[#1f1f1f] rounded-xl p-5">
              <div className="flex gap-3 mb-4">
                <span className="shrink-0 text-xs font-semibold text-[#71717a] w-6 pt-0.5">
                  {i + 1}.
                </span>
                <p className="text-white text-sm leading-relaxed">{question.question}</p>
              </div>
              <div className="space-y-2 pl-9">
                {question.displayOptions.map((option, oi) => {
                  const isSelected = option === selected;
                  return (
                    <button
                      key={oi}
                      onClick={() =>
                        setSelectedAnswers((prev) => ({
                          ...prev,
                          [question.id]: option,
                        }))
                      }
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#22c55e]/40 bg-[#22c55e]/8 text-[#22c55e]"
                          : "border-[#1f1f1f] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white"
                      }`}
                    >
                      <span className="shrink-0 w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold text-[#3f3f46]">
                        {["A", "B", "C", "D"][oi]}
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

      {/* Fixed bottom submit bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-[#1f1f1f]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#71717a]">
              {answeredCount} of {total} answered
            </p>
            {answeredCount < total && (
              <p className="text-[11px] text-[#3f3f46]">
                {total - answeredCount} remaining
              </p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22c55e] text-black font-semibold text-sm hover:bg-[#16a34a] transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main PYQs Page ───────────────────────────────────────────────────────────
export default function PYQsPage() {
  const [mode, setMode] = useState<Mode>("home");

  if (mode === "learn") return <LearnMode onBack={() => setMode("home")} />;
  if (mode === "quiz") return <QuizMode onBack={() => setMode("home")} />;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-4 h-4 text-[#22c55e]" />
          <span className="text-[11px] font-semibold text-[#22c55e] uppercase tracking-widest">
            Previous Year Questions
          </span>
        </div>
        <h1 className="text-xl font-semibold text-white mb-2">PYQs</h1>
        <p className="text-sm text-[#71717a]">
          120 exam questions across 12 weeks — sourced from NPTEL ESD past papers.
        </p>
        <div className="flex items-center gap-4 mt-3 text-xs text-[#52525b]">
          <span>12 weeks</span>
          <span>·</span>
          <span>120 questions</span>
          <span>·</span>
          <span>10 per week</span>
        </div>
      </div>

      <div className="space-y-2">
        {/* Learn card */}
        <button
          onClick={() => setMode("learn")}
          className="group w-full flex items-center gap-4 px-4 py-4 rounded-xl border border-[#1f1f1f] hover:border-[#3f3f46] hover:bg-white/3 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-[#22c55e]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">Learn</p>
            <p className="text-xs text-[#52525b]">
              Browse all 120 PYQs by week · reveal answers at your own pace
            </p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#3f3f46] group-hover:text-[#71717a] group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>

        {/* Quiz card */}
        <button
          onClick={() => setMode("quiz")}
          className="group w-full flex items-center gap-4 px-4 py-4 rounded-xl border border-[#1f1f1f] hover:border-[#3f3f46] hover:bg-white/3 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">Start Quiz</p>
            <p className="text-xs text-[#52525b]">
              Random 50 or all 120 questions · timed · submit for results
            </p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#3f3f46] group-hover:text-[#71717a] group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>
      </div>

      {/* Week breakdown */}
      <div className="mt-8 border border-[#1f1f1f] rounded-xl p-4">
        <p className="text-[11px] font-semibold text-[#52525b] uppercase tracking-wider mb-3">
          Coverage
        </p>
        <div className="grid grid-cols-6 gap-2">
          {weeks.map((w) => {
            const count = allPYQs.filter((q) => q.week === w).length;
            return (
              <div
                key={w}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[#1f1f1f]"
              >
                <span className="text-[10px] font-semibold text-[#22c55e]">W{w}</span>
                <span className="text-[10px] text-[#52525b]">{count}q</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
