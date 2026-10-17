"use client";

import type { ReactNode } from "react";

export const chip = (on: boolean) =>
  `h-10 rounded-md border px-3.5 text-sm transition-colors sm:h-9 ${
    on
      ? "border-[#22c55e]/50 bg-[#22c55e]/10 text-[#22c55e]"
      : "border-[#1f1f1f] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white"
  }`;

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3 py-5 sm:grid-cols-[8rem_1fr] sm:items-center">
      <p className="text-sm text-[#a1a1aa]">{label}</p>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" className="inline-flex rounded-lg border border-[#1f1f1f] p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`h-10 rounded-md px-4 text-sm transition-colors sm:h-9 ${
            value === o.value ? "bg-white/[0.07] text-white" : "text-[#71717a] hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SwitchRow({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between gap-4 py-4 text-left"
    >
      <span>
        <span className="block text-[15px] text-white">{label}</span>
        <span className="block text-sm text-[#71717a]">{hint}</span>
      </span>
      <span className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${on ? "bg-[#22c55e]" : "bg-[#27272a]"}`}>
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${on ? "translate-x-4" : ""}`}
        />
      </span>
    </button>
  );
}