import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  titleAccent?: boolean;
  intro?: string;
  className?: string;
};

export function PageHero({ eyebrow = "Hier findest du unsere", title, titleAccent, intro, className }: Props) {
  return (
    <div className={cn("text-center px-4 pt-12 md:pt-16 pb-10 md:pb-14", className)}>
      {eyebrow && (
        <p className="font-serif text-brand-mint text-base md:text-lg mb-3">{eyebrow}</p>
      )}
      <h1
        className={cn(
          "font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight font-semibold",
          titleAccent
            ? "text-brand-coral underline decoration-brand-mint decoration-4 underline-offset-8"
            : "text-brand-blue",
        )}
      >
        {title}
      </h1>
      {intro && (
        <p className="mx-auto mt-7 max-w-2xl text-brand-ink/70 leading-relaxed text-base md:text-lg">
          {intro}
        </p>
      )}
    </div>
  );
}
