"use client";

import { useState, useMemo } from "react";
import { Shuffle, Eye, EyeOff } from "lucide-react";
import questionsData from "@/data/nptel_lab_questions.json";
import type { Question } from "@/types";
import QuestionCard from "@/components/QuestionCard";

const allQuestions: Question[] = questionsData as Question[];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const weeks = Array.from({ length: 12 }, (_, i) => i + 1);

export default function LearnPage() {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [isRandomized, setIsRandomized] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const displayQuestions = useMemo(() => {
    const filtered = selectedWeek === null ? allQuestions : allQuestions.filter((q) => q.week === selectedWeek);
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
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-white mb-1">Learn</h1>
        <p className="text-sm text-[#71717a]">Practice freely. Reveal answers at your own pace.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button onClick={() => setSelectedWeek(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            selectedWeek === null ? "border-[#22c55e]/40 text-[#22c55e] bg-[#22c55e]/8" : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"
          }`}>
          All
        </button>
        {weeks.map((w) => (
          <button key={w} onClick={() => setSelectedWeek(w)}
            className={`w-8 h-8 rounded-lg text-xs font-medium border transition-all ${
              selectedWeek === w ? "border-[#22c55e]/40 text-[#22c55e] bg-[#22c55e]/8" : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"
            }`}>
            {w}
          </button>
        ))}

        <div className="flex items-center gap-1.5 ml-auto">
          <button onClick={() => setIsRandomized(!isRandomized)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isRandomized ? "border-[#22c55e]/40 text-[#22c55e] bg-[#22c55e]/8" : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"
            }`}>
            <Shuffle className="w-3 h-3" /> Shuffle
          </button>
          <button onClick={() => setShowAnswer(!showAnswer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showAnswer ? "border-[#22c55e]/40 text-[#22c55e] bg-[#22c55e]/8" : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"
            }`}>
            {showAnswer ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {showAnswer ? "Answers on" : "Show answers"}
          </button>
        </div>
      </div>

      <p className="text-xs text-[#3f3f46] mb-6">
        {displayQuestions.length} questions{selectedWeek ? ` · Week ${selectedWeek}` : " · All weeks"}
      </p>

      {grouped ? (
        <div className="space-y-10">
          {Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b)).map(([week, qs]) => (
            <section key={week}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-semibold text-[#22c55e] uppercase tracking-widest">Week {week}</span>
                <div className="flex-1 h-px bg-[#1f1f1f]" />
              </div>
              <div className="space-y-3">
                {qs.map((q, i) => (
                  <QuestionCard key={q.id} question={q} index={i + 1} selectedAnswer={selectedAnswers[q.id]} showAnswer={showAnswer}
                    onSelect={(ans) => setSelectedAnswers((prev) => ({ ...prev, [q.id]: ans }))} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {displayQuestions.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i + 1} selectedAnswer={selectedAnswers[q.id]} showAnswer={showAnswer}
              onSelect={(ans) => setSelectedAnswers((prev) => ({ ...prev, [q.id]: ans }))} />
          ))}
        </div>
      )}
    </div>
  );
}
