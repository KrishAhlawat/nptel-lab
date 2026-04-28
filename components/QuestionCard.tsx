"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  index: number;
  selectedAnswer?: string;
  showAnswer?: boolean;
  onSelect?: (answer: string) => void;
  mode?: "learn" | "readonly";
}

export default function QuestionCard({ question, index, selectedAnswer, showAnswer = false, onSelect, mode = "learn" }: QuestionCardProps) {
  const getOptionStyle = (option: string) => {
    if (!showAnswer && !selectedAnswer) {
      return "border-[#1f1f1f] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white hover:bg-white/3";
    }
    if (!showAnswer && selectedAnswer) {
      if (option === selectedAnswer) return "border-[#22c55e]/50 bg-[#22c55e]/8 text-[#22c55e]";
      return "border-[#1f1f1f] text-[#52525b]";
    }
    if (option === question.correctAnswer) return "border-[#22c55e]/50 bg-[#22c55e]/8 text-[#22c55e]";
    if (option === selectedAnswer) return "border-red-500/40 bg-red-500/8 text-red-400";
    return "border-[#1f1f1f] text-[#52525b]";
  };

  const getOptionIcon = (option: string) => {
    if (!showAnswer) return null;
    if (option === question.correctAnswer) return <CheckCircle className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />;
    if (option === selectedAnswer) return <span className="w-3.5 h-3.5 text-red-400 shrink-0 text-xs font-bold flex items-center">✕</span>;
    return null;
  };

  return (
    <div className="border border-[#1f1f1f] rounded-xl p-5">
      <div className="flex gap-3 mb-4">
        <span className="shrink-0 text-xs font-semibold text-[#71717a] w-6 pt-0.5">{index}.</span>
        <p className="text-white text-sm leading-relaxed">{question.question}</p>
      </div>

      <div className="space-y-2 pl-9">
        {question.options.map((option, i) => (
          <button key={i} disabled={mode === "readonly"} onClick={() => onSelect?.(option)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-xs text-left transition-all ${getOptionStyle(option)} ${mode === "readonly" ? "cursor-default" : "cursor-pointer"}`}
          >
            <span className="shrink-0 w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold text-[#52525b]">
              {["A","B","C","D"][i]}
            </span>
            <span className="flex-1">{option}</span>
            {getOptionIcon(option)}
          </button>
        ))}
      </div>


    </div>
  );
}
