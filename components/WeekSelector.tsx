"use client";

interface WeekSelectorProps {
  selectedWeek: number | null;
  onSelect: (week: number | null) => void;
  allowAll?: boolean;
}

export default function WeekSelector({ selectedWeek, onSelect, allowAll = true }: WeekSelectorProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {allowAll && (
        <button onClick={() => onSelect(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            selectedWeek === null
              ? "border-[#22c55e]/40 text-[#22c55e] bg-[#22c55e]/8"
              : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"
          }`}>
          All Weeks
        </button>
      )}
      {Array.from({ length: 12 }, (_, i) => i + 1).map((week) => (
        <button key={week} onClick={() => onSelect(week)}
          className={`w-9 h-9 rounded-lg text-xs font-medium border transition-all ${
            selectedWeek === week
              ? "border-[#22c55e]/40 text-[#22c55e] bg-[#22c55e]/8"
              : "border-[#1f1f1f] text-[#71717a] hover:border-[#3f3f46] hover:text-white"
          }`}>
          {week}
        </button>
      ))}
    </div>
  );
}
