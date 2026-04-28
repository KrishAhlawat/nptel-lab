"use client";

import { useEffect, useRef } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  elapsed: number;
  isRunning: boolean;
  onTick?: () => void;
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Timer({ elapsed, isRunning, onTick }: TimerProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => onTick?.(), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, onTick]);

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#1f1f1f] font-mono text-xs text-[#71717a] tabular-nums">
      <Clock className="w-3 h-3" />
      <span>{formatTime(elapsed)}</span>
    </div>
  );
}
