"use client";

import Timer from "@/components/Timer";
import QuestionBlock from "@/components/QuestionBlock";
import OptionList from "@/components/OptionList";
import ActionBar from "@/components/ActionBar";

export interface RunnerQuestion {
  id: string;
  question: string;
  displayOptions: string[];
}

export default function QuizRunner({
  questions,
  answers,
  onAnswer,
  elapsed,
  isRunning,
  onTick,
  onSubmit,
  submitLabel = "Submit quiz",
}: {
  questions: RunnerQuestion[];
  answers: Record<string, string>;
  onAnswer: (id: string, option: string) => void;
  elapsed: number;
  isRunning: boolean;
  onTick: () => void;
  onSubmit: () => void;
  submitLabel?: string;
}) {
  const total = questions.length;
  const answered = questions.filter((q) => answers[q.id]).length;
  const left = total - answered;
  const pct = total ? (answered / total) * 100 : 0;

  return (
    <div>
      {/* sticky top bar: progress and timer */}
      <div className="sticky top-14 z-40 -mx-4 bg-[#0a0a0a]/90 px-4 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex h-11 items-center justify-between text-sm">
          <p className="tabular-nums text-[#a1a1aa]">
            {answered} of {total} answered
          </p>
          <Timer elapsed={elapsed} isRunning={isRunning} onTick={onTick} />
        </div>
        <div className="h-px bg-[#1f1f1f]">
          <div className="h-px bg-[#22c55e] transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-10 space-y-12">
        {questions.map((q, i) => (
          <QuestionBlock key={q.id} index={i + 1} text={q.question}>
            <OptionList
              options={q.displayOptions}
              selected={answers[q.id]}
              onSelect={(opt) => onAnswer(q.id, opt)}
            />
          </QuestionBlock>
        ))}
      </div>

      {/* sticky bottom bar: submit */}
      <ActionBar
        info={left === 0 ? "All questions answered." : `${left} left unanswered.`}
        action={submitLabel}
        onAction={onSubmit}
      />
    </div>
  );
}