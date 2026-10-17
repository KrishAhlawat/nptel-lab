import type { ReactNode } from "react";

export default function ActionBar({
  info,
  action,
  onAction,
  disabled,
}: {
  info: ReactNode;
  action: string;
  onAction: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="sticky bottom-0 z-40 -mx-4 mt-12 border-t border-[#1f1f1f] bg-[#0a0a0a]/90 px-4 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:-mx-6 sm:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        <p className="min-w-0 truncate text-sm text-[#a1a1aa]">{info}</p>
        <button
          onClick={onAction}
          disabled={disabled}
          className="h-11 shrink-0 rounded-lg bg-[#22c55e] px-6 text-sm font-semibold text-black transition-colors hover:bg-[#16a34a] disabled:opacity-40"
        >
          {action}
        </button>
      </div>
    </div>
  );
}