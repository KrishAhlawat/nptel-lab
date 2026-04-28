"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export default function ProgressBar({
  current,
  total,
  showLabel = true,
}: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#64748b]">Progress</span>
          <span className="text-xs font-medium text-[#94a3b8]">
            {current}/{total} answered
          </span>
        </div>
      )}
      <div className="h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#22c55e] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
