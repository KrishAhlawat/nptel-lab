"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/quiz", label: "Quiz" },
  { href: "/pyqs", label: "PYQs" }, // re-enable when the PYQs page is back
  { href: "/review", label: "Review" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-[#1f1f1f] bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-2xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-[15px] font-semibold tracking-tight text-white">
          NPTEL <span className="text-[#22c55e]">Lab</span>
        </Link>

        <nav aria-label="Main" className="-mr-2.5 flex items-center sm:gap-1">
          {links.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`px-2.5 py-2 text-sm transition-colors ${
                  active
                    ? "text-white underline decoration-[#22c55e] decoration-2 underline-offset-[10px]"
                    : "text-[#71717a] hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}