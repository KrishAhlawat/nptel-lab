const AUTHOR = { name: "Krish Ahlawat", url: "https://krishahlawat.vercel.app" }; // edit or delete

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[#1f1f1f]">
      <div className="mx-auto max-w-2xl space-y-3 px-4 py-10 text-sm leading-relaxed text-[#71717a] sm:px-6">
        <p className="text-[#a1a1aa]">A free practice site for the NPTEL Mental Health and Wellbeing course.</p>
        <p>
          It is not affiliated with NPTEL or any IIT. Check answers against your course material before the exam.
        </p>
        <p>Your scores, mistakes and bookmarks are saved only in this browser. Clearing site data erases them.</p>
        {/* <p>
          Built by{" "}
          <a
            href={AUTHOR.url}
            className="text-[#a1a1aa] underline decoration-[#3f3f46] underline-offset-4 transition-colors hover:text-white"
          >
            {AUTHOR.name}
          </a>
          .
        </p> */}
      </div>
    </footer>
  );
}