"use client";

const weeks = Array.from({ length: 12 }, (_, i) => i + 1);

export default function WeekSelector({
  selectedWeek,
  onSelect,
  allowAll = true,
}: {
  selectedWeek: number | null;
  onSelect: (week: number | null) => void;
  allowAll?: boolean;
}) {
  const chip = (on: boolean) =>
    `h-10 w-full rounded-md border text-sm tabular-nums transition-colors sm:h-9 sm:w-auto sm:min-w-[2.25rem] sm:px-3 ${
      on
        ? "border-[#22c55e]/50 bg-[#22c55e]/10 text-[#22c55e]"
        : "border-[#1f1f1f] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white"
    }`;

  return (
    <div role="group" aria-label="Week" className="grid grid-cols-7 gap-1.5 sm:flex sm:flex-wrap">
      {allowAll && (
        <button aria-pressed={selectedWeek === null} onClick={() => onSelect(null)} className={chip(selectedWeek === null)}>
          All
        </button>
      )}
      {weeks.map((w) => (
        <button key={w} aria-pressed={selectedWeek === w} onClick={() => onSelect(w)} className={chip(selectedWeek === w)}>
          {w}
        </button>
      ))}
    </div>
  );
}