"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import mainData from "@/data/mentalHealthAndWellbeing.json";
import pyqData from "@/data/PYQs.json";
import type { Question } from "@/types";
import ResultsView from "@/components/ResultsView";
import QuizRunner from "@/components/QuizRunner";
import ActionBar from "@/components/ActionBar";
import PageHeader from "@/components/PageHeader";
import { useProgress, recordQuiz } from "@/store/progress";

interface Item extends Question {
  displayOptions: string[];
}

const lookup = new Map<string, Question>([
  ...(mainData as Question[]).map((q) => [`main:${q.id}`, q] as const),
  ...(pyqData as Question[]).map((q) => [`pyq:${q.id}`, q] as const),
]);

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "setup" | "quiz" | "results";

export default function ReviewPage() {
  const { wrong } = useProgress();
  const missed = useMemo(() => wrong.filter((k) => lookup.has(k)), [wrong]);

  const byWeek = useMemo(() => {
    const m = new Map<number, number>();
    missed.forEach((k) => {
      const w = lookup.get(k)!.week;
      m.set(w, (m.get(w) ?? 0) + 1);
    });
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [missed]);

  const [phase, setPhase] = useState<Phase>("setup");
  const [items, setItems] = useState<Item[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  const handleTick = useCallback(() => setElapsed((t) => t + 1), []);

  // the question set is frozen at start, so fixing one mid-session doesn't reshuffle the page
  const start = () => {
    setItems(
      shuffleArray(missed).map((k) => {
        const q = lookup.get(k)!;
        return { ...q, id: k, displayOptions: q.options };
      })
    );
    setAnswers({});
    setElapsed(0);
    setRunning(true);
    setPhase("quiz");
    window.scrollTo({ top: 0 });
  };

  const submit = () => {
    recordQuiz(
      { mode: "review", seconds: elapsed },
      items.map((q) => ({ key: q.id, correct: answers[q.id] === q.correctAnswer }))
    );
    setRunning(false);
    setPhase("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setPhase("setup");
    setItems([]);
    setAnswers({});
    setElapsed(0);
    setRunning(false);
    window.scrollTo({ top: 0 });
  };

  if (phase === "results") {
    return (
      <ResultsView questions={items} selectedAnswers={answers} onRetry={reset} title="Review results" elapsed={elapsed} />
    );
  }

  if (phase === "quiz") {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <QuizRunner
          questions={items}
          answers={answers}
          onAnswer={(id, opt) => setAnswers((prev) => ({ ...prev, [id]: opt }))}
          elapsed={elapsed}
          isRunning={running}
          onTick={handleTick}
          onSubmit={submit}
          submitLabel="Submit review"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-12 sm:px-6 sm:pt-16">
      <PageHeader title="Review Mistakes">
        Questions you got wrong in earlier quizzes. Get one right and it leaves this list.
      </PageHeader>

      {missed.length === 0 ? (
        <div className="mt-10 border-y border-[#1f1f1f] py-8">
          <p className="text-[15px] text-white">Nothing to review yet.</p>
          <p className="mt-1 text-sm text-[#71717a]">
            Questions you miss will collect here.{" "}
            <Link
              href="/quiz"
              className="text-[#a1a1aa] underline decoration-[#3f3f46] underline-offset-4 transition-colors hover:text-white"
            >
              Take a quiz
            </Link>
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10 border-t border-[#1f1f1f]">
            {byWeek.map(([week, n]) => (
              <div key={week} className="flex items-baseline justify-between border-b border-[#1f1f1f] py-3.5">
                <span className="text-[15px] text-white">Week {week}</span>
                <span className="text-sm tabular-nums text-[#71717a]">
                  {n} {n === 1 ? "question" : "questions"}
                </span>
              </div>
            ))}
          </div>
          <ActionBar info={`${missed.length} questions to review`} action="Start review" onAction={start} />
        </>
      )}
    </div>
  );
}