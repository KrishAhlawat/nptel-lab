"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Zap, Dumbbell, Layers, ArrowRight } from "lucide-react";

const actions = [
  {
    href: "/learn",
    label: "Learn",
    desc: "Browse all 120 questions by week",
    icon: BookOpen,
    color: "text-[#22c55e]",
  },
  {
    href: "/quiz",
    label: "Quiz",
    desc: "Timed · scroll through all questions · submit at end",
    icon: Zap,
    color: "text-white",
  },
  {
    href: "/practice",
    label: "Practice Extras",
    desc: "20 AI-generated questions",
    icon: Dumbbell,
    color: "text-white",
  },
  {
    href: "/all",
    label: "All Questions",
    desc: "Search and filter all 120",
    icon: Layers,
    color: "text-white",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            NPTEL <span className="text-[#22c55e]">Lab</span>
          </h1>
          <p className="text-sm text-[#71717a]">
            Practice. Experiment. Master.
          </p>
          <p className="text-sm text-white font-medium mt-2">
            Education for Sustainable Development
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-[#71717a]">
            <span>12 weeks</span>
            <span>·</span>
            <span>120 questions</span>
            <span>·</span>
            <span>20 extras</span>
          </div>
        </div>

        <div className="space-y-1.5">
          {actions.map(({ href, label, desc, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border border-[#1f1f1f] hover:border-[#3f3f46] hover:bg-white/3 transition-all"
            >
              <Icon className={`w-4 h-4 ${color} shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-[#52525b]">{desc}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#3f3f46] group-hover:text-[#71717a] group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
