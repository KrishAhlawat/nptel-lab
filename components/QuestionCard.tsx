"use client";

import { useState } from "react";
import { Eye, EyeOff, Star } from "lucide-react";
import type { Question } from "@/types";
import { useProgress, toggleBookmark } from "@/store/progress";
import QuestionBlock from "@/components/QuestionBlock";
import OptionList from "@/components/OptionList";

interface QuestionCardProps {
  question: Question;
  index: number;
  selectedAnswer?: string;
  showAnswer?: boolean;
  onSelect?: (answer: string) => void;
  mode?: "learn" | "readonly";
  bookmarkKey?: string;
}

export default function QuestionCard({
  question,
  index,
  selectedAnswer,
  showAnswer = false,
  onSelect,
  mode = "learn",
  bookmarkKey,
}: QuestionCardProps) {
  const [revealed, setRevealed] = useState(false);
  const { bookmarks } = useProgress();
  const reveal = showAnswer || revealed;
  const bookmarked = bookmarkKey ? bookmarks.includes(bookmarkKey) : false;

  return (
    <QuestionBlock
      index={index}
      text={question.question}
      aside={
        bookmarkKey ? (
          <button
            onClick={() => toggleBookmark(bookmarkKey)}
            aria-pressed={bookmarked}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark question"}
            className="-mr-2 -mt-1 shrink-0 p-2"
          >
            <Star
              className={`h-[18px] w-[18px] transition-colors ${bookmarked ? "fill-[#22c55e] text-[#22c55e]" : "text-[#3f3f46] hover:text-[#71717a]"}`}
            />
          </button>
        ) : undefined
      }
    >
      <OptionList
        options={question.options}
        selected={selectedAnswer}
        correct={question.correctAnswer}
        reveal={reveal}
        readOnly={mode === "readonly"}
        onSelect={onSelect}
      />
      {mode !== "readonly" && !showAnswer && (
        <button
          onClick={() => setRevealed((v) => !v)}
          className="mt-3 flex items-center gap-1.5 text-sm text-[#71717a] transition-colors hover:text-white"
        >
          {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {revealed ? "Hide answer" : "Show answer"}
        </button>
      )}
    </QuestionBlock>
  );
}