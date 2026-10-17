import type { ReactNode } from "react";
import { serif } from "@/lib/fonts";

export default function QuestionBlock({
  index,
  text,
  aside,
  children,
}: {
  index: number;
  text: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  const size = text.length > 160 ? "text-[18px] sm:text-[21px]" : "text-[20px] sm:text-[24px]";
  return (
    <article>
      <div className="flex items-start gap-4">
        <span className="w-6 shrink-0 pt-1.5 text-sm tabular-nums text-[#52525b] sm:w-8">{index}</span>
        <h2 className={`${serif.className} flex-1 font-normal leading-[1.3] text-white ${size}`}>{text}</h2>
        {aside}
      </div>
      <div className="mt-4 pl-10 sm:pl-12">{children}</div>
    </article>
  );
}