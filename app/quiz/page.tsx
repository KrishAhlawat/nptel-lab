"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import questionsData from "@/data/mentalHealthAndWellbeing.json";
import type { Question } from "@/types";
import ResultsView from "@/components/ResultsView";
import WeekSelector from "@/components/WeekSelector";
import QuizRunner from "@/components/QuizRunner";
import ActionBar from "@/components/ActionBar";
import PageHeader from "@/components/PageHeader";
import { recordQuiz, saveDraft, loadDraft, clearDraft, type Draft } from "@/store/progress";

const allQuestions: Question[] = questionsData as Question[];

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

type Phase = "setup" | "quiz" | "results";

/* ---------- small setup controls ---------- */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 py-5 sm:grid-cols-[8rem_1fr] sm:items-center">
      <p className="text-sm text-[#a1a1aa]">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" className="inline-flex rounded-lg border border-[#1f1f1f] p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`h-10 rounded-md px-4 text-sm transition-colors sm:h-9 ${
            value === o.value ? "bg-white/[0.07] text-white" : "text-[#71717a] hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SwitchRow({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between gap-4 py-4 text-left"
    >
      <span>
        <span className="block text-[15px] text-white">{label}</span>
        <span className="block text-sm text-[#71717a]">{hint}</span>
      </span>
      <span className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${on ? "bg-[#22c55e]" : "bg-[#27272a]"}`}>
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${on ? "translate-x-4" : ""}`}
        />
      </span>
    </button>
  );
}

const chip = (on: boolean) =>
  `h-10 rounded-md border px-3.5 text-sm transition-colors sm:h-9 ${
    on
      ? "border-[#22c55e]/50 bg-[#22c55e]/10 text-[#22c55e]"
      : "border-[#1f1f1f] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white"
  }`;

export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [quizMode, setQuizMode] = useState<"week" | "full">("week");
  const [pickWeek, setPickWeek] = useState<number>(1);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<DisplayQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [elapsed, setElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [fullCount, setFullCount] = useState<number | "all">("all");
  const [draft, setDraft] = useState<Draft | null>(null);

  // load any unfinished quiz once on mount
  useEffect(() => {
    setDraft(loadDraft());
  }, []);

  // autosave the in-progress quiz whenever an answer changes
  useEffect(() => {
    if (phase !== "quiz") return;
    saveDraft({
      quizMode,
      pickWeek,
      items: quizQuestions.map((q) => ({ id: q.id, displayOptions: q.displayOptions })),
      answers: selectedAnswers,
      elapsed,
      savedAt: Date.now(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, selectedAnswers]);

  const startQuiz = () => {
    let base = quizMode === "full" ? allQuestions : allQuestions.filter((q) => q.week === pickWeek);
    if (quizMode === "full" && fullCount !== "all") base = shuffleArray(base).slice(0, fullCount);
    if (randomizeQuestions) base = shuffleArray(base);
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

  const resumeQuiz = () => {
    if (!draft) return;
    const byId = new Map(allQuestions.map((q) => [q.id, q]));
    const qs = draft.items
      .map((it) => (byId.has(it.id) ? { ...byId.get(it.id)!, displayOptions: it.displayOptions } : null))
      .filter(Boolean) as DisplayQuestion[];
    if (qs.length === 0) {
      clearDraft();
      setDraft(null);
      return;
    }
    setQuizMode(draft.quizMode);
    setPickWeek(draft.pickWeek);
    setQuizQuestions(qs);
    setSelectedAnswers(draft.answers);
    setElapsed(draft.elapsed);
    setIsTimerRunning(true);
    setPhase("quiz");
    window.scrollTo({ top: 0 });
  };

  const discardDraft = () => {
    clearDraft();
    setDraft(null);
  };

  const handleTick = useCallback(() => setElapsed((t) => t + 1), []);

  const handleSubmit = () => {
    recordQuiz(
      { mode: quizMode, week: quizMode === "week" ? pickWeek : undefined, seconds: elapsed },
      quizQuestions.map((q) => ({
        key: `main:${q.id}`,
        correct: selectedAnswers[q.id] === q.correctAnswer,
      }))
    );
    clearDraft();
    setDraft(null);
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

  /* ---------- results ---------- */
  if (phase === "results") {
    return (
      <ResultsView
        questions={quizQuestions}
        selectedAnswers={selectedAnswers}
        onRetry={handleReset}
        title={quizMode === "full" ? "Full quiz results" : `Week ${pickWeek} results`}
        elapsed={elapsed}
      />
    );
  }

  /* ---------- taking the quiz ---------- */
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

  /* ---------- setup ---------- */
  const weekCount = allQuestions.filter((q) => q.week === pickWeek).length;
  const count =
    quizMode === "week"
      ? weekCount
      : fullCount === "all"
        ? allQuestions.length
        : Math.min(fullCount, allQuestions.length);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-12 sm:px-6 sm:pt-16">
      <PageHeader title="Quiz">Timed and scored. Questions you miss are saved for Review.</PageHeader>

      {draft && (
        <div className="mt-8 rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/[0.04] p-4">
          <p className="text-[15px] text-white">You have an unfinished quiz.</p>
          <p className="mt-0.5 text-sm text-[#71717a]">
            {Object.keys(draft.answers).length} of {draft.items.length} answered.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={resumeQuiz}
              className="h-10 rounded-lg bg-[#22c55e] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#16a34a]"
            >
              Resume
            </button>
            <button
              onClick={discardDraft}
              className="h-10 rounded-lg border border-[#27272a] px-4 text-sm text-[#a1a1aa] transition-colors hover:text-white"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 divide-y divide-[#1f1f1f] border-y border-[#1f1f1f]">
        <Field label="Type">
          <Segmented
            value={quizMode}
            onChange={setQuizMode}
            options={[
              { value: "week", label: "One week" },
              { value: "full", label: "Full course" },
            ]}
          />
        </Field>

        {quizMode === "week" ? (
          <Field label="Week">
            <WeekSelector selectedWeek={pickWeek} onSelect={(w) => setPickWeek(w ?? 1)} allowAll={false} />
          </Field>
        ) : (
          <Field label="Questions">
            <div className="flex flex-wrap gap-1.5">
              {([10, 25, 50, "all"] as const).map((n) => (
                <button key={n} aria-pressed={fullCount === n} onClick={() => setFullCount(n)} className={chip(fullCount === n)}>
                  {n === "all" ? `All ${allQuestions.length}` : n}
                </button>
              ))}
            </div>
          </Field>
        )}

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

      <ActionBar
        info={`${quizMode === "week" ? `Week ${pickWeek}` : "Full course"}, ${count} questions`}
        action="Start quiz"
        onAction={startQuiz}
      />
    </div>
  );
}