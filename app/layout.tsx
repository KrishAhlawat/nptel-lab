import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Viewport } from "next";
export const viewport: Viewport = { viewportFit: "cover" };

export const metadata: Metadata = {
  title: "NPTEL Lab",
  description:
    "A calm, distraction-free platform to practice and revise MCQs for Mental Health and Wellbeing. 12 weeks, 120 questions.",
  keywords: ["NPTEL", "ESD", "MCQ", "quiz", "Mental Health and Wellbeing"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className="bg-[#0a0a0a] text-[#f4f4f5] antialiased min-h-screen"
        cz-shortcut-listen="true"
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
