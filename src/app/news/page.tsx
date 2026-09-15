import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { news } from "@/lib/content";

export const metadata: Metadata = {
  title: "News",
  description: "Neuigkeiten aus dem Restaurant Salmarina.",
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("de-CH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function NewsPage() {
  return (
    <div className="pb-20">
      <PageHero title={news.title} titleAccent intro={news.intro} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-12">
        {news.items.length === 0 ? (
          <p className="text-center text-brand-blue/70">Bald gibt es hier Neuigkeiten.</p>
        ) : (
          news.items.map((item) => (
            <article
              key={item.id}
              className="border-b border-brand-mint/20 pb-12 last:border-0"
            >
              <time dateTime={item.date} className="text-sm font-semibold text-brand-mint">
                {formatDate(item.date)}
              </time>
              <h2 className="font-serif text-2xl md:text-3xl text-brand-blue mt-2 mb-3 font-semibold">
                {item.title}
              </h2>
              <p className="text-brand-blue/85 leading-relaxed mb-3">{item.excerpt}</p>
              {item.body && (
                <p className="text-brand-blue/75 leading-relaxed text-sm">{item.body}</p>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
