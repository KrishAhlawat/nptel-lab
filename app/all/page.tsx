"use client";

import { useState, useMemo } from "react";
import { Search, Shuffle, Eye, EyeOff } from "lucide-react";
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

export default function AllQuestionsPage() {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [isRandomized, setIsRandomized] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let qs = selectedWeek ? allQuestions.filter((q) => q.week === selectedWeek) : allQuestions;
    if (search.trim()) {
      const s = search.toLowerCase();
      qs = qs.filter((q) => q.question.toLowerCase().includes(s) || q.options.some((o) => o.toLowerCase().includes(s)));
    }
    return isRandomized ? shuffleArray(qs) : qs;
  }, [selectedWeek, isRandomized, search]);

  const grouped = useMemo(() => {
    if (selectedWeek || search || isRandomized) return null;
    const map: Record<number, Question[]> = {};
    filtered.forEach((q) => { if (!map[q.week]) map[q.week] = []; map[q.week].push(q); });
    return map;
  }, [selectedWeek, search, isRandomized, filtered]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-white mb-1">All Questions</h1>
        <p className="text-sm text-[#71717a]">120 questions across 12 weeks.</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3f3f46]" />
        <input type="text" placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-transparent border border-[#1f1f1f] rounded-xl text-sm text-white placeholder:text-[#3f3f46] focus:outline-none focus:border-[#3f3f46] transition-all" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button onClick={() => setSelectedWeek(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedWeek === null ? "border-[#22c55e]/40 text-[#22c55e] bg-[#22c55e]/8" : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"}`}>
          All
        </button>
        {weeks.map((w) => (
          <button key={w} onClick={() => setSelectedWeek(w)}
            className={`w-8 h-8 rounded-lg text-xs font-medium border transition-all ${selectedWeek === w ? "border-[#22c55e]/40 text-[#22c55e] bg-[#22c55e]/8" : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"}`}>
            {w}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => setIsRandomized(!isRandomized)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isRandomized ? "border-[#22c55e]/40 text-[#22c55e] bg-[#22c55e]/8" : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"}`}>
            <Shuffle className="w-3 h-3" /> Shuffle
          </button>
          <button onClick={() => setShowAnswers(!showAnswers)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${showAnswers ? "border-[#22c55e]/40 text-[#22c55e] bg-[#22c55e]/8" : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"}`}>
            {showAnswers ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {showAnswers ? "Answers on" : "Answers"}
          </button>
        </div>
      </div>

      <p className="text-xs text-[#71717a] mb-6">{filtered.length} questions</p>

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
                  <QuestionCard key={q.id} question={q} index={i + 1} selectedAnswer={selectedAnswers[q.id]} showAnswer={showAnswers}
                    onSelect={(ans) => setSelectedAnswers((prev) => ({ ...prev, [q.id]: ans }))} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0
            ? <p className="text-sm text-[#3f3f46] text-center py-12">No questions found.</p>
            : filtered.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i + 1} selectedAnswer={selectedAnswers[q.id]} showAnswer={showAnswers}
                  onSelect={(ans) => setSelectedAnswers((prev) => ({ ...prev, [q.id]: ans }))} />
              ))
          }
        </div>
      )}
    </div>
  );
}
