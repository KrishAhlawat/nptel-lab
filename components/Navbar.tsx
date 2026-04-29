"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Zap,
  LayoutGrid,
  Dumbbell,
  Home,
  Menu,
  X,
  FlaskConical,
  GraduationCap,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/quiz", label: "Quiz", icon: Zap },
  { href: "/all", label: "All Questions", icon: LayoutGrid },
  { href: "/practice", label: "Practice", icon: Dumbbell },
  { href: "/pyqs", label: "PYQs", icon: GraduationCap },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#1f1f1f] bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          {/* <FlaskConical className="w-4 h-4 text-[#22c55e]" /> */}
          <span className="font-semibold text-white text-sm tracking-tight">
            NPTEL <span className="text-[#22c55e]">Lab</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? "text-[#22c55e] bg-[#22c55e]/8"
                    : "text-[#71717a] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          className="md:hidden p-2 text-[#71717a] hover:text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#1f1f1f] bg-[#0a0a0a] overflow-hidden"
          >
            <nav className="flex flex-col gap-1 p-3">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "text-[#22c55e] bg-[#22c55e]/8"
                        : "text-[#71717a] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
