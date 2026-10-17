"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Newsreader } from "next/font/google";
import { ArrowRight, Check, X } from "lucide-react";
import questionsData from "@/data/mentalHealthAndWellbeing.json";
import pyqData from "@/data/PYQs.json";
import type { Question } from "@/types";
import { useProgress, markResult } from "@/store/progress";
import OptionList from "@/components/OptionList";

const serif = Newsreader({ subsets: ["latin"], display: "swap" });

const pool = questionsData as Question[];
const nQ = pool.length;
const nPYQ = pyqData.length;
const weeks = Array.from({ length: 12 }, (_, i) => i + 1);
const LETTERS = ["A", "B", "C", "D"];

// long questions step down in size so no question becomes a wall of display type
const questionSize = (len: number) =>
  len > 160
    ? "text-[21px] sm:text-[24px]"
    : len > 90
      ? "text-[25px] sm:text-[29px]"
      : "text-[28px] sm:text-[36px]";

function Row({
  href,
  title,
  desc,
  badge,
}: {
  href: string;
  title: string;
  desc: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-0.5 py-3.5 border-b border-[#1f1f1f] first:border-t sm:grid-cols-[9.5rem_1fr_auto]"
    >
      <span className="text-[15px] font-medium text-white">{title}</span>
      <span className="col-start-1 row-start-2 text-sm text-[#71717a] sm:col-start-2 sm:row-start-1">
        {desc}
      </span>
      <span className="col-start-2 row-start-1 flex items-center gap-3 sm:col-start-3">
        {badge !== undefined && (
          <span className="text-sm text-[#22c55e] tabular-nums">{badge}</span>
        )}
        <ArrowRight className="w-4 h-4 text-[#3f3f46] transition-all group-hover:text-[#a1a1aa] group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export default function HomePage() {
  const { attempts, wrong } = useProgress();

  /* ---------- hero question ---------- */
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState<Question | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  const next = () => {
    const source = pool.filter((x) => x.id !== q?.id);
    setQ(source[Math.floor(Math.random() * source.length)]);
    setPicked(null);
  };

  const answer = (opt: string) => {
    if (!q || picked) return;
    setPicked(opt);
    markResult(`main:${q.id}`, opt === q.correctAnswer); // delete this line to stop Home answers feeding Review
  };

  // pick after mount so server and client markup match
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted) next();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // keyboard: A–D answer, N next
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (
        (e.target as HTMLElement | null)?.closest(
          "input, textarea, select, [contenteditable]",
        )
      )
        return;
      const k = e.key.toLowerCase();
      const i = "abcd".indexOf(k);
      if (i >= 0 && q && !picked && q.options[i]) answer(q.options[i]);
      else if (k === "n" && picked) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* ---------- progress ---------- */
  const valid = attempts.filter((a) => a.total > 0);
  const pct = (a: { score: number; total: number }) =>
    Math.round((a.score / a.total) * 100);
  const bestByWeek = new Map<number, number>();
  for (const a of valid) {
    if (a.mode === "week" && a.week) {
      bestByWeek.set(a.week, Math.max(bestByWeek.get(a.week) ?? 0, pct(a)));
    }
  }
  const summary =
    bestByWeek.size === 0
      ? "Take a week quiz to start tracking your progress."
      : `${bestByWeek.size} of 12 weeks attempted. Bars show your best score per week.`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24">
      <h1 className="sr-only">NPTEL Lab, Mental Health and Wellbeing</h1>

      {/* Hero: a live question */}
      <section className="min-h-[23rem]" aria-live="polite">
        {q && (
          <>
            <p className="text-sm text-[#71717a]">
              Mental Health and Wellbeing
            </p>

            <h2
              className={`${serif.className} mt-4 font-normal leading-[1.2] tracking-[-0.01em] text-white ${questionSize(q.question.length)}`}
            >
              {q.question}
            </h2>

            <div className="mt-8">
              <OptionList
                options={q.options}
                selected={picked}
                correct={q.correctAnswer}
                reveal={!!picked}
                readOnly={!!picked}
                onSelect={answer}
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <p
                className={
                  !picked
                    ? "text-[#71717a]"
                    : picked === q.correctAnswer
                      ? "text-[#22c55e]"
                      : "text-[#f87171]"
                }
              >
                {!picked
                  ? `Week ${q.week}`
                  : picked === q.correctAnswer
                    ? "Correct."
                    : "Not quite."}
              </p>
              <button
                onClick={next}
                className="text-[#a1a1aa] transition-colors hover:text-white"
              >
                {picked ? "Next question" : "Skip"}
              </button>
            </div>
          </>
        )}
      </section>

      {/* Destinations: 4 rows */}
      <nav className="mt-16" aria-label="Sections">
        <Row
          href="/quiz"
          title="Quiz"
          desc="Timed and scored. Pick a week or take them all."
        />
        <Row
          href="/learn"
          title="Learn"
          desc={`Browse, search and bookmark all ${nQ} questions.`}
        />
        {/* <Row href="/pyqs" title="PYQs" desc={`${nPYQ} past-year questions, with learn and quiz modes.`} /> */}
        <Row
          href="/review"
          title="Review Mistakes"
          desc={
            wrong.length > 0
              ? "Retry only the questions you missed."
              : "Questions you miss will collect here."
          }
          badge={wrong.length > 0 ? wrong.length : undefined}
        />
      </nav>

      {/* Progress by week */}
      <section className="mt-16" aria-label="Progress by week">
        <p className="text-sm text-[#71717a] mb-4">{summary}</p>
        <div className="grid grid-cols-12 gap-1.5 sm:gap-2">
          {weeks.map((w) => {
            const b = bestByWeek.get(w);
            return (
              <div
                key={w}
                title={
                  b === undefined
                    ? `Week ${w}: not attempted`
                    : `Week ${w}: best ${b}%`
                }
                className="flex flex-col items-center"
              >
                <div className="flex h-12 w-full items-end rounded-sm bg-[#111]">
                  <div
                    className="w-full rounded-sm bg-[#22c55e]"
                    style={{
                      height: b === undefined ? 0 : `${Math.max(b, 4)}%`,
                    }}
                  />
                </div>
                <span className="mt-2 text-xs tabular-nums text-[#a1a1aa]">
                  {w}
                </span>
                <span className="h-3 text-[10px] tabular-nums text-[#52525b]">
                  {b === undefined ? "" : b}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
