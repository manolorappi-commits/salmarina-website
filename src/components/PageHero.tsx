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
    <div className={cn("text-center px-4 pt-10 md:pt-14 pb-8 md:pb-12", className)}>
      {eyebrow && (
        <p className="font-serif text-brand-blue text-base md:text-lg mb-2">{eyebrow}</p>
      )}
      <h1
        className={cn(
          "font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight",
          titleAccent ? "text-brand-coral underline decoration-brand-coral decoration-4 underline-offset-8" : "text-brand-blue",
        )}
      >
        {title}
      </h1>
      {intro && (
        <p className="mx-auto mt-6 max-w-2xl text-brand-blue/80 leading-relaxed">{intro}</p>
      )}
    </div>
  );
}
