"use client";

import { useState } from "react";
import Link from "next/link";
import type { Question } from "@/types";
import { serif } from "@/lib/fonts";
import { formatTime } from "@/components/Timer";
import PageHeader from "@/components/PageHeader";
import QuestionBlock from "@/components/QuestionBlock";
import OptionList from "@/components/OptionList";

type Item = Question & { displayOptions?: string[] };

export default function ResultsView({
  questions,
  selectedAnswers,
  onRetry,
  title,
  elapsed,
}: {
  questions: Item[];
  selectedAnswers: Record<string, string>;
  onRetry: () => void;
  title: string;
  elapsed?: number;
}) {
  const [onlyMissed, setOnlyMissed] = useState(false);

  const rows = questions.map((q, i) => ({
    q,
    i,
    picked: selectedAnswers[q.id],
    ok: selectedAnswers[q.id] === q.correctAnswer,
  }));
  const total = rows.length;
  const score = rows.filter((r) => r.ok).length;
  const missed = total - score;
  const pct = total ? Math.round((score / total) * 100) : 0;
  const shown = onlyMissed ? rows.filter((r) => !r.ok) : rows;

  const chip = (on: boolean) =>
    `h-9 rounded-md border px-3 text-sm transition-colors ${
      on
        ? "border-[#22c55e]/50 bg-[#22c55e]/10 text-[#22c55e]"
        : "border-[#1f1f1f] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white"
    }`;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
      <PageHeader title={title}>
        {`${pct}% correct${elapsed !== undefined ? `, in ${formatTime(elapsed)}` : ""}.`}
      </PageHeader>

      <p className={`${serif.className} mt-8 text-[56px] leading-none text-white`}>
        {score}
        <span className="text-[#52525b]"> / {total}</span>
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          onClick={onRetry}
          className="h-11 rounded-lg bg-[#22c55e] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#16a34a]"
        >
          Try again
        </button>
        {missed > 0 && (
          <Link
            href="/review"
            className="inline-flex h-11 items-center rounded-lg border border-[#27272a] px-5 text-sm text-[#d4d4d8] transition-colors hover:border-[#3f3f46] hover:text-white"
          >
            Review mistakes
          </Link>
        )}
      </div>

      {missed > 0 && (
        <div className="mt-10 flex gap-2">
          <button onClick={() => setOnlyMissed(false)} aria-pressed={!onlyMissed} className={chip(!onlyMissed)}>
            All {total}
          </button>
          <button onClick={() => setOnlyMissed(true)} aria-pressed={onlyMissed} className={chip(onlyMissed)}>
            Missed {missed}
          </button>
        </div>
      )}

      <div className="mt-8 space-y-12">
        {shown.map(({ q, i, picked }) => (
          <QuestionBlock key={q.id} index={i + 1} text={q.question}>
            <OptionList
              options={q.displayOptions ?? q.options}
              selected={picked}
              correct={q.correctAnswer}
              reveal
              readOnly
            />
            {!picked && <p className="mt-3 text-sm text-[#71717a]">Not answered.</p>}
          </QuestionBlock>
        ))}
      </div>
    </div>
  );
}