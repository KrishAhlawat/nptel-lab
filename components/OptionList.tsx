"use client";

import { Check, X } from "lucide-react";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

interface Props {
  options: string[];
  selected?: string | null;
  correct?: string;
  reveal?: boolean;
  readOnly?: boolean;
  onSelect?: (option: string) => void;
}

export default function OptionList({ options, selected, correct, reveal = false, readOnly = false, onSelect }: Props) {
  return (
    <ol className="-mx-3 border-t border-[#1f1f1f]">
      {options.map((opt, i) => {
        const isSelected = opt === selected;
        const isCorrect = reveal && opt === correct;
        const isWrong = reveal && isSelected && opt !== correct;

        const tone = isCorrect
          ? "text-[#22c55e]"
          : isWrong
            ? "text-[#f87171]"
            : reveal
              ? "text-[#52525b]"
              : isSelected
                ? "bg-white/[0.04] text-white shadow-[inset_2px_0_0_#22c55e]"
                : "text-[#d4d4d8] hover:text-white";

        const letter = reveal
          ? "opacity-60"
          : isSelected
            ? "text-[#22c55e]"
            : "text-[#52525b] group-hover:text-[#22c55e]";

        return (
          <li key={opt}>
            <button
              type="button"
              disabled={readOnly}
              aria-pressed={isSelected}
              onClick={() => onSelect?.(opt)}
              className={`group flex min-h-[3rem] w-full items-baseline gap-4 border-b border-[#1f1f1f] px-3 py-3 text-left transition-colors ${tone} ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            >
              <span className={`w-5 shrink-0 text-sm tabular-nums transition-colors ${letter}`}>{LETTERS[i]}</span>
              <span className="flex-1 text-[15px] leading-snug">{opt}</span>
              {isCorrect && <Check className="h-4 w-4 shrink-0 self-center" />}
              {isWrong && <X className="h-4 w-4 shrink-0 self-center" />}
            </button>
          </li>
        );
      })}
    </ol>
  );
}