"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import type { Question } from "@/types";

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: string;
  isSubmitted: boolean;
  onSelect: (answer: string) => void;
}

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isSubmitted,
  onSelect,
}: QuizCardProps) {
  // Keyboard shortcuts: 1-4 for option selection
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isSubmitted) return;
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < question.options.length) {
        onSelect(question.options[idx]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [question, isSubmitted, onSelect]);

  const getOptionStyle = (option: string) => {
    if (!isSubmitted) {
      if (option === selectedAnswer) {
        return "border-[#22c55e]/60 bg-[#22c55e]/10 text-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.1)]";
      }
      return "border-[#1e293b] bg-[#162032] text-[#94a3b8] hover:border-[#334155] hover:text-[#e2e8f0] hover:bg-[#1a2840]";
    }

    // After submission
    if (option === question.correctAnswer) {
      return "border-[#22c55e]/60 bg-[#22c55e]/10 text-[#22c55e]";
    }
    if (option === selectedAnswer && option !== question.correctAnswer) {
      return "border-[#ef4444]/50 bg-[#ef4444]/10 text-[#ef4444]";
    }
    return "border-[#1e293b] bg-[#162032] text-[#64748b]";
  };

  const getOptionIcon = (option: string) => {
    if (!isSubmitted) return null;
    if (option === question.correctAnswer)
      return <CheckCircle className="w-4 h-4 text-[#22c55e] shrink-0" />;
    if (option === selectedAnswer && option !== question.correctAnswer)
      return (
        <span className="w-4 h-4 flex items-center justify-center text-[#ef4444] shrink-0 font-bold text-sm">
          ✕
        </span>
      );
    return null;
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-[#64748b]">
          Question {questionNumber} of {totalQuestions}
        </span>
        {selectedAnswer && !isSubmitted && (
          <span className="text-xs text-[#22c55e] font-medium">✓ Selected</span>
        )}
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="text-[#e2e8f0] text-lg sm:text-xl font-medium leading-relaxed">
          {question.question}
        </h2>
        {question.week > 0 && (
          <span className="inline-block mt-2 text-xs text-[#64748b] bg-[#1e293b] px-2 py-0.5 rounded-md">
            Week {question.week}
          </span>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            disabled={isSubmitted}
            onClick={() => onSelect(option)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm text-left transition-all ${getOptionStyle(option)} ${
              isSubmitted ? "cursor-default" : "cursor-pointer"
            }`}
          >
            <span
              className={`shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold ${
                option === selectedAnswer && !isSubmitted
                  ? "border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]"
                  : "border-[#334155] bg-[#0f172a]/60 text-[#64748b]"
              }`}
            >
              {["1", "2", "3", "4"][i]}
            </span>
            <span className="flex-1 leading-relaxed">{option}</span>
            {getOptionIcon(option)}
          </button>
        ))}
      </div>

      {/* Keyboard hint */}
      {!isSubmitted && (
        <p className="mt-4 text-xs text-[#475569] text-center">
          Press{" "}
          <kbd className="px-1.5 py-0.5 bg-[#1e293b] rounded border border-[#334155] font-mono text-[11px]">
            1–4
          </kbd>{" "}
          to select · Use{" "}
          <kbd className="px-1.5 py-0.5 bg-[#1e293b] rounded border border-[#334155] font-mono text-[11px]">
            ← →
          </kbd>{" "}
          to navigate
        </p>
      )}
    </motion.div>
  );
}
