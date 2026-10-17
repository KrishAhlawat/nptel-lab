"use client";

import { useEffect } from "react";

export function formatTime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

export default function Timer({
  elapsed,
  isRunning,
  onTick,
}: {
  elapsed: number;
  isRunning: boolean;
  onTick: () => void;
}) {
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
  }, [isRunning, onTick]);

  return (
    <span className="text-sm tabular-nums text-[#a1a1aa]" aria-label="Time elapsed">
      {formatTime(elapsed)}
    </span>
  );
}