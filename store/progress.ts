"use client";
import { useSyncExternalStore } from "react";

export type QuizMode = "week" | "full" | "pyq" | "review";
export type Attempt = {
  at: number;
  mode: QuizMode;
  week?: number;
  score: number;
  total: number;
  seconds: number;
};
type State = { attempts: Attempt[]; wrong: string[]; bookmarks: string[] };

const KEY = "nptel-lab:progress:v1";
const EMPTY: State = { attempts: [], wrong: [], bookmarks: [] };
let cache: State = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): State {
  if (typeof window === "undefined") return EMPTY;
  if (!loaded) {
    try {
      const raw = localStorage.getItem(KEY);
      cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
    } catch {
      cache = EMPTY;
    }
    loaded = true;
  }
  return cache;
}

function write(next: State) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export const useProgress = () => useSyncExternalStore(subscribe, read, () => EMPTY);

/** key format: "main:<id>" or "pyq:<id>" */
export function recordQuiz(
  meta: { mode: QuizMode; week?: number; seconds: number },
  results: { key: string; correct: boolean }[]
) {
  if (results.length === 0) return;
  const s = read();
  const wrong = new Set(s.wrong);
  let score = 0;
  for (const r of results) {
    if (r.correct) {
      score++;
      wrong.delete(r.key); // answering correctly clears it from Review
    } else {
      wrong.add(r.key);
    }
  }
  write({
    ...s,
    wrong: [...wrong],
    attempts: [{ ...meta, score, total: results.length, at: Date.now() }, ...s.attempts].slice(0, 50),
  });
}

export function toggleBookmark(key: string) {
  const s = read();
  write({
    ...s,
    bookmarks: s.bookmarks.includes(key)
      ? s.bookmarks.filter((k) => k !== key)
      : [...s.bookmarks, key],
  });
}

/** Single-question result from Home. Updates the Review list without logging a quiz attempt. */
export function markResult(key: string, correct: boolean) {
  const s = read();
  const has = s.wrong.includes(key);
  if (correct && has) write({ ...s, wrong: s.wrong.filter((k) => k !== key) });
  else if (!correct && !has) write({ ...s, wrong: [...s.wrong, key] });
}

/* ---- unfinished quiz draft (Quiz page only) ---- */
const DRAFT = "nptel-lab:draft:v1";
export type Draft = {
  quizMode: "week" | "full";
  pickWeek: number;
  items: { id: string; displayOptions: string[] }[];
  answers: Record<string, string>;
  elapsed: number;
  savedAt: number;
};
export const saveDraft = (d: Draft) => {
  try { localStorage.setItem(DRAFT, JSON.stringify(d)); } catch {}
};
export const loadDraft = (): Draft | null => {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT) || "null") as Draft | null;
    return d && Date.now() - d.savedAt < 864e5 ? d : null; // expires after 24h
  } catch {
    return null;
  }
};
export const clearDraft = () => {
  try { localStorage.removeItem(DRAFT); } catch {}
};