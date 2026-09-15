import fs from "fs";
import path from "path";

export function getLegal(slug: "impressum" | "datenschutz" | "agb"): string {
  const filePath = path.join(process.cwd(), "content", "legal", `${slug}.md`);
  return fs.readFileSync(filePath, "utf-8");
}

/** Simple markdown → HTML for legal pages (headings, paragraphs, lists, bold, links). */
export function markdownToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inList = false;

  const flushList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  const inline = (text: string) =>
    text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="underline hover:opacity-80">$1</a>',
      )
      .replace(
        /(https?:\/\/[^\s<]+)/g,
        '<a href="$1" class="underline hover:opacity-80" rel="noopener noreferrer">$1</a>',
      )
      .replace(
        /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
        '<a href="mailto:$1" class="underline hover:opacity-80">$1</a>',
      );

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushList();
      continue;
    }
    if (line.startsWith("# ")) {
      flushList();
      html.push(
        `<h1 class="font-serif text-3xl md:text-4xl text-brand-blue mb-6">${inline(line.slice(2))}</h1>`,
      );
      continue;
    }
    if (line.startsWith("## ")) {
      flushList();
      html.push(
        `<h2 class="font-serif text-2xl text-brand-blue mt-10 mb-4">${inline(line.slice(3))}</h2>`,
      );
      continue;
    }
    if (line.startsWith("- ")) {
      if (!inList) {
        html.push('<ul class="list-disc pl-5 space-y-2 mb-4 text-brand-blue/90">');
        inList = true;
      }
      html.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    flushList();
    if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
      html.push(
        `<p class="text-sm italic text-brand-blue/70 mt-8">${inline(line.slice(1, -1))}</p>`,
      );
    } else {
      html.push(
        `<p class="mb-4 leading-relaxed text-brand-blue/90">${inline(line)}</p>`,
      );
    }
  }
  flushList();
  return html.join("\n");
}
