import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "NPTEL Lab — Practice. Experiment. Master.",
  description:
    "A calm, distraction-free platform to practice and revise MCQs for Education for Sustainable Development. 12 weeks, 120 questions.",
  keywords: ["NPTEL", "ESD", "MCQ", "quiz", "Education for Sustainable Development"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-[#f4f4f5] antialiased min-h-screen">
        <Navbar />
        <main className="min-h-[calc(100vh-56px)]">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
