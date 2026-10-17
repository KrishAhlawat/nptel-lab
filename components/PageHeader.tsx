import type { ReactNode } from "react";
import { serif } from "@/lib/fonts";

export default function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header>
      <h1
        className={`${serif.className} text-[36px] font-normal leading-[1.1] tracking-[-0.01em] text-white sm:text-[44px]`}
      >
        {title}
      </h1>
      {children && <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-[#71717a]">{children}</p>}
    </header>
  );
}