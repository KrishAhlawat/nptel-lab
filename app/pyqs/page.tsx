"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, Shuffle, Eye, EyeOff, Star } from "lucide-react";
import pyqData from "@/data/mentalPYQs.json";
import type { Question } from "@/types";
import QuestionCard from "@/components/QuestionCard";
import WeekSelector from "@/components/WeekSelector";
import QuizRunner from "@/components/QuizRunner";
import ActionBar from "@/components/ActionBar";
import ResultsView from "@/components/ResultsView";
import PageHeader from "@/components/PageHeader";
import { Field, Segmented, SwitchRow, chip } from "@/components/SetupControls";
import { serif } from "@/lib/fonts";
import { useProgress, recordQuiz } from "@/store/progress";

const allPYQs: Question[] = pyqData as Question[];
const weekCount = new Set(allPYQs.map((q) => q.week)).size;

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

type View = "learn" | "quiz";

function Top({ view, onView }: { view: View; onView: (v: View) => void }) {
  return (
    <>
      <PageHeader title="PYQs">
        {allPYQs.length} questions from previous NPTEL exams, across {weekCount} weeks.
      </PageHeader>
      <div className="mt-6">
        <Segmented
          value={view}
          onChange={onView}
          options={[
            { value: "learn", label: "Learn" },
            { value: "quiz", label: "Quiz" },
          ]}
        />
      </div>
    </>
  );
}

/* ---------------------------------- Learn ---------------------------------- */
function LearnView({ onView }: { onView: (v: View) => void }) {
  const { bookmarks } = useProgress();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [shuffleOrder, setShuffleOrder] = useState<Record<string, number> | null>(null);

  const toggleShuffle = () =>
    setShuffleOrder((prev) =>
      prev ? null : Object.fromEntries(allPYQs.map((q) => [q.id, Math.random()]))
    );

  const filtered = useMemo(() => {
    let qs = selectedWeek ? allPYQs.filter((q) => q.week === selectedWeek) : allPYQs;
    if (search.trim()) {
      const s = search.toLowerCase();
      qs = qs.filter(
        (q) => q.question.toLowerCase().includes(s) || q.options.some((o) => o.toLowerCase().includes(s))
      );
    }
    if (onlyBookmarked) qs = qs.filter((q) => bookmarks.includes(`pyq:${q.id}`));
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
      bookmarkKey={`pyq:${q.id}`}
      selectedAnswer={selectedAnswers[q.id]}
      showAnswer={showAnswers}
      onSelect={(ans) => setSelectedAnswers((prev) => ({ ...prev, [q.id]: ans }))}
    />
  );

  return (
    <div className="mx-auto max-w-2xl px-4 pt-12 sm:px-6 sm:pt-16">
      <Top view="learn" onView={onView} />

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
          <button
            onClick={() => setOnlyBookmarked((v) => !v)}
            aria-pressed={onlyBookmarked}
            className={`flex items-center gap-1.5 ${chip(onlyBookmarked)}`}
          >
            <Star className="h-4 w-4" /> Bookmarked
          </button>
          <button
            onClick={toggleShuffle}
            aria-pressed={shuffleOrder !== null}
            className={`flex items-center gap-1.5 ${chip(shuffleOrder !== null)}`}
          >
            <Shuffle className="h-4 w-4" /> Shuffle
          </button>
          <button
            onClick={() => setShowAnswers((v) => !v)}
            aria-pressed={showAnswers}
            className={`flex items-center gap-1.5 ${chip(showAnswers)}`}
          >
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

/* ---------------------------------- Quiz ----------------------------------- */
function QuizView({ onView }: { onView: (v: View) => void }) {
  const [phase, setPhase] = useState<"setup" | "quiz" | "results">("setup");
  const [count, setCount] = useState<number | "all">(allPYQs.length > 50 ? 50 : "all");
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<DisplayQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [elapsed, setElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const presets = [10, 25, 50].filter((n) => n < allPYQs.length);
  const total = count === "all" ? allPYQs.length : Math.min(count, allPYQs.length);

  const startQuiz = () => {
    let base = [...allPYQs];
    if (count !== "all") base = shuffleArray(base).slice(0, count);
    base = randomizeQuestions ? shuffleArray(base) : allPYQs.filter((q) => base.includes(q));
    setQuizQuestions(
      base.map((q) => ({ ...q, displayOptions: shuffleAnswers ? shuffleArray(q.options) : q.options }))
    );
    setSelectedAnswers({});
    setElapsed(0);
    setIsTimerRunning(true);
    setPhase("quiz");
    window.scrollTo({ top: 0 });
  };

  const handleTick = useCallback(() => setElapsed((t) => t + 1), []);

  const handleSubmit = () => {
    recordQuiz(
      { mode: "pyq", seconds: elapsed },
      quizQuestions.map((q) => ({
        key: `pyq:${q.id}`,
        correct: selectedAnswers[q.id] === q.correctAnswer,
      }))
    );
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

  if (phase === "results") {
    return (
      <ResultsView
        questions={quizQuestions}
        selectedAnswers={selectedAnswers}
        onRetry={handleReset}
        title="PYQ quiz results"
        elapsed={elapsed}
      />
    );
  }

  if (phase === "quiz") {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <QuizRunner
          questions={quizQuestions}
          answers={selectedAnswers}
          onAnswer={(id, opt) => setSelectedAnswers((prev) => ({ ...prev, [id]: opt }))}
          elapsed={elapsed}
          isRunning={isTimerRunning}
          onTick={handleTick}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-12 sm:px-6 sm:pt-16">
      <Top view="quiz" onView={onView} />

      <div className="mt-8 divide-y divide-[#1f1f1f] border-y border-[#1f1f1f]">
        <Field label="Questions">
          <div className="flex flex-wrap gap-1.5">
            {([...presets, "all"] as (number | "all")[]).map((n) => (
              <button key={n} aria-pressed={count === n} onClick={() => setCount(n)} className={chip(count === n)}>
                {n === "all" ? `All ${allPYQs.length}` : n}
              </button>
            ))}
          </div>
        </Field>
        <SwitchRow
          label="Randomize question order"
          hint="Mix the questions instead of going in course order."
          on={randomizeQuestions}
          onChange={setRandomizeQuestions}
        />
        <SwitchRow
          label="Shuffle answer choices"
          hint="Stops you memorizing option positions."
          on={shuffleAnswers}
          onChange={setShuffleAnswers}
        />
      </div>

      <ActionBar info={`${total} PYQs, all weeks`} action="Start quiz" onAction={startQuiz} />
    </div>
  );
}

export default function PYQsPage() {
  const [view, setView] = useState<View>("learn");
  return view === "learn" ? <LearnView onView={setView} /> : <QuizView onView={setView} />;
}