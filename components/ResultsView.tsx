"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw, TrendingUp, Clock } from "lucide-react";
import type { Question } from "@/types";
import Link from "next/link";

interface ResultsViewProps {
  questions: Question[];
  selectedAnswers: Record<string, string>;
  onRetry: () => void;
  title?: string;
  elapsed?: number;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ResultsView({ questions, selectedAnswers, onRetry, title = "Results", elapsed }: ResultsViewProps) {
  const correct = questions.filter((q) => selectedAnswers[q.id] === q.correctAnswer).length;

  const total = questions.length;
  const percent = Math.round((correct / total) * 100);

  const wrongByWeek: Record<number, Question[]> = {};
  questions.forEach((q) => {
    if (selectedAnswers[q.id] !== q.correctAnswer) {
      if (!wrongByWeek[q.week]) wrongByWeek[q.week] = [];
      wrongByWeek[q.week].push(q);
    }
  });

  const scoreColor = percent >= 80 ? "text-[#22c55e]" : percent >= 50 ? "text-yellow-400" : "text-white";
  const scoreLabel = percent >= 80 ? "Well done." : percent >= 50 ? "Good effort." : "Keep going.";

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl mx-auto pb-24">
      {/* Score */}
      <div className="border border-[#1f1f1f] rounded-xl p-6 mb-5 text-center">
        <p className="text-xs text-[#3f3f46] mb-3">{title}</p>
        <div className={`text-5xl font-bold mb-1 ${scoreColor}`}>{correct}/{total}</div>
        <p className="text-xs text-[#71717a] mb-1">{percent}% correct · {scoreLabel}</p>
        {elapsed !== undefined && (
          <p className="text-xs text-[#3f3f46] flex items-center justify-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> {formatTime(elapsed)}
          </p>
        )}
        <div className="mt-4 h-px bg-[#1f1f1f] rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.8, delay: 0.2 }}
            className={`h-full rounded-full ${percent >= 80 ? "bg-[#22c55e]" : percent >= 50 ? "bg-yellow-400" : "bg-white"}`} />
        </div>
      </div>

      {/* Weak areas */}
      {Object.keys(wrongByWeek).length > 0 && (
        <div className="border border-[#1f1f1f] rounded-xl p-4 mb-5">
          <p className="text-xs text-[#71717a] mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Review these weeks
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(wrongByWeek).sort(([a], [b]) => Number(a) - Number(b)).map(([week, qs]) => (
              <span key={week} className="text-xs px-2.5 py-1 rounded-lg border border-[#1f1f1f] text-[#a1a1aa]">
                {Number(week) === 0 ? "Extra" : `W${week}`} · {qs.length} wrong
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown — incorrect first, then correct */}
      {(() => {
        const incorrect = questions.filter((q) => selectedAnswers[q.id] !== q.correctAnswer);
        const correct = questions.filter((q) => selectedAnswers[q.id] === q.correctAnswer);
        const renderCard = (q: Question, label: number) => {
          const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
          const userAnswer = selectedAnswers[q.id];
          return (
            <div key={q.id} className={`border rounded-xl p-4 ${isCorrect ? "border-[#22c55e]/20" : "border-[#3f3f46]/60"}`}>
              <div className="flex items-start gap-3">
                {isCorrect
                  ? <CheckCircle className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" />
                  : <XCircle className="w-3.5 h-3.5 text-[#ef4444]/70 shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#a1a1aa] mb-1.5 leading-relaxed">
                    <span className="text-[#71717a] mr-1">{label}.</span>{q.question}
                  </p>
                  {!isCorrect && (
                    <div className="space-y-0.5">
                      {userAnswer
                        ? <p className="text-[11px] text-[#71717a]">Your answer: {userAnswer}</p>
                        : <p className="text-[11px] text-[#52525b]">Not answered</p>}
                      <p className="text-[11px] text-[#22c55e]">Correct: {q.correctAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        };
        return (
          <div className="space-y-2 mb-6">
            {incorrect.length > 0 && (
              <>
                <p className="text-[11px] text-[#ef4444]/70 uppercase tracking-wider font-medium px-1 mb-1">
                  Incorrect · {incorrect.length}
                </p>
                {incorrect.map((q, i) => renderCard(q, i + 1))}
              </>
            )}
            {correct.length > 0 && (
              <>
                <div className="flex items-center gap-3 pt-3 pb-1">
                  <p className="text-[11px] text-[#22c55e] uppercase tracking-wider font-medium px-1">
                    Correct · {correct.length}
                  </p>
                  <div className="flex-1 h-px bg-[#1f1f1f]" />
                </div>
                {correct.map((q, i) => renderCard(q, incorrect.length + i + 1))}
              </>
            )}
          </div>
        );
      })()}


      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-[#1f1f1f]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#22c55e] text-black font-semibold text-sm hover:bg-[#16a34a] transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Try Again
          </button>
          <Link href="/"
            className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-[#1f1f1f] text-[#71717a] text-sm font-medium hover:border-[#3f3f46] hover:text-white transition-all">
            Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
