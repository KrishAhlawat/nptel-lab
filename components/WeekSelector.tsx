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
    `h-10 min-w-[2.5rem] shrink-0 rounded-md border px-3 text-sm tabular-nums transition-colors sm:h-9 sm:min-w-[2.25rem] ${
      on
        ? "border-[#22c55e]/50 bg-[#22c55e]/10 text-[#22c55e]"
        : "border-[#1f1f1f] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white"
    }`;

  return (
    <div
      role="group"
      aria-label="Week"
      className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
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