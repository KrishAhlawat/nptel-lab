"use client";

import { useState, useMemo } from "react";
import { Search, Shuffle, Eye, EyeOff, Star } from "lucide-react";
import questionsData from "@/data/mentalHealthAndWellbeing.json";
import type { Question } from "@/types";
import QuestionCard from "@/components/QuestionCard";
import WeekSelector from "@/components/WeekSelector";
import PageHeader from "@/components/PageHeader";
import { serif } from "@/lib/fonts";
import { useProgress } from "@/store/progress";

const allQuestions: Question[] = questionsData as Question[];

const chip = (on: boolean) =>
  `flex h-10 items-center gap-1.5 rounded-md border px-3 text-sm transition-colors sm:h-9 ${
    on
      ? "border-[#22c55e]/50 bg-[#22c55e]/10 text-[#22c55e]"
      : "border-[#1f1f1f] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white"
  }`;

export default function LearnPage() {
  const { bookmarks } = useProgress();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  // id -> random sort key; null means not shuffled. Stable until toggled again.
  const [shuffleOrder, setShuffleOrder] = useState<Record<string, number> | null>(null);

  const toggleShuffle = () =>
    setShuffleOrder((prev) =>
      prev ? null : Object.fromEntries(allQuestions.map((q) => [q.id, Math.random()]))
    );

  const filtered = useMemo(() => {
    let qs = selectedWeek ? allQuestions.filter((q) => q.week === selectedWeek) : allQuestions;
    if (search.trim()) {
      const s = search.toLowerCase();
      qs = qs.filter(
        (q) => q.question.toLowerCase().includes(s) || q.options.some((o) => o.toLowerCase().includes(s))
      );
    }
    if (onlyBookmarked) qs = qs.filter((q) => bookmarks.includes(`main:${q.id}`));
    if (shuffleOrder) qs = [...qs].sort((a, b) => (shuffleOrder[a.id] ?? 0) - (shuffleOrder[b.id] ?? 0));
    return qs;
  }, [selectedWeek, search, onlyBookmarked, bookmarks, shuffleOrder]);

  const grouped = useMemo(() => {
    if (selectedWeek || search || onlyBookmarked || shuffleOrder) return null;
    const map: Record<number, Question[]> = {};
    filtered.forEach((q) => {
      (map[q.week] ||= []).push(q);
    });
    return map;
  }, [selectedWeek, search, onlyBookmarked, shuffleOrder, filtered]);

  const card = (q: Question, i: number) => (
    <QuestionCard
      key={q.id}
      question={q}
      index={i + 1}
      bookmarkKey={`main:${q.id}`}
      selectedAnswer={selectedAnswers[q.id]}
      showAnswer={showAnswers}
      onSelect={(ans) => setSelectedAnswers((prev) => ({ ...prev, [q.id]: ans }))}
    />
  );

  return (
    <div className="mx-auto max-w-2xl px-4 pt-12 sm:px-6 sm:pt-16">
      <PageHeader title="Learn">
        Browse, search and bookmark all {allQuestions.length} questions. Reveal answers when you are ready.
      </PageHeader>

      <div className="mt-8 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52525b]" />
          <input
            type="search"
            placeholder="Search questions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-lg border border-[#1f1f1f] bg-transparent pl-10 pr-4 text-[15px] text-white placeholder:text-[#52525b] transition-colors focus:border-[#3f3f46] focus:outline-none"
          />
        </div>

        <WeekSelector selectedWeek={selectedWeek} onSelect={setSelectedWeek} />

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setOnlyBookmarked((v) => !v)} aria-pressed={onlyBookmarked} className={chip(onlyBookmarked)}>
            <Star className="h-4 w-4" /> Bookmarked
          </button>
          <button onClick={toggleShuffle} aria-pressed={shuffleOrder !== null} className={chip(shuffleOrder !== null)}>
            <Shuffle className="h-4 w-4" /> Shuffle
          </button>
          <button onClick={() => setShowAnswers((v) => !v)} aria-pressed={showAnswers} className={chip(showAnswers)}>
            {showAnswers ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {showAnswers ? "Answers shown" : "Show all answers"}
          </button>
        </div>
      </div>

      <p className="mb-10 mt-8 text-sm text-[#71717a]">
        {filtered.length} questions{selectedWeek ? ` in week ${selectedWeek}` : ""}.
      </p>

      {grouped ? (
        <div className="space-y-20">
          {Object.entries(grouped)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([week, qs]) => (
              <section key={week}>
                <div className="flex items-baseline justify-between border-b border-[#1f1f1f] pb-3">
                  <h2 className={`${serif.className} text-[26px] font-normal text-white`}>Week {week}</h2>
                  <span className="text-sm text-[#71717a]">{qs.length} questions</span>
                </div>
                <div className="mt-8 space-y-12">{qs.map(card)}</div>
              </section>
            ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-sm text-[#71717a]">
          {onlyBookmarked ? "No bookmarks yet. Tap the star on any question to save it." : "No questions match your search."}
        </p>
      ) : (
        <div className="space-y-12">{filtered.map(card)}</div>
      )}
    </div>
  );
}