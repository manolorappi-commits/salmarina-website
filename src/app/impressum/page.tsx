import type { Metadata } from "next";
import { getLegal, markdownToHtml } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: true, follow: true },
};

export default function Page() {
  const html = markdownToHtml(getLegal("impressum"));
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16 prose-legal">
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
