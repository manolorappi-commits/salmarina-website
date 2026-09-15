"use client";

import { useEffect, useState } from "react";
import { getOpeningStatus, type OpeningStatus, type OpeningStatusKind } from "@/lib/opening-status";
import { cn } from "@/lib/utils";

const REFRESH_MS = 45_000;

const styles: Record<
  OpeningStatusKind,
  { pill: string; dot: string; pulse: boolean }
> = {
  open: {
    pill: "bg-emerald-600 text-white shadow-emerald-600/20",
    dot: "bg-emerald-200",
    pulse: true,
  },
  closing_soon: {
    pill: "bg-orange-500 text-white shadow-orange-500/20",
    dot: "bg-orange-100",
    pulse: true,
  },
  opening_soon: {
    pill: "bg-sky-600 text-white shadow-sky-600/20",
    dot: "bg-sky-100",
    pulse: true,
  },
  closed: {
    pill: "bg-rose-600 text-white shadow-rose-600/20",
    dot: "bg-rose-200",
    pulse: false,
  },
};

function compute(): OpeningStatus {
  return getOpeningStatus(new Date());
}

type Props = {
  className?: string;
  showHours?: boolean;
};

export function OpeningStatusBadge({ className, showHours = true }: Props) {
  const [status, setStatus] = useState<OpeningStatus | null>(null);

  useEffect(() => {
    setStatus(compute());
    const id = window.setInterval(() => setStatus(compute()), REFRESH_MS);
    return () => window.clearInterval(id);
  }, []);

  // Avoid SSR/client mismatch: render a neutral placeholder until mounted
  if (!status) {
    return (
      <div
        className={cn("inline-flex flex-col items-start gap-1.5", className)}
        aria-hidden
      >
        <span className="inline-flex h-9 min-w-[8.5rem] items-center rounded-full bg-brand-sea/80 px-4 ring-1 ring-brand-mint/20" />
      </div>
    );
  }

  const s = styles[status.kind];

  return (
    <div
      className={cn("inline-flex flex-col items-start gap-1.5", className)}
      aria-live="polite"
    >
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold tracking-wide shadow-sm",
          s.pill,
        )}
        role="status"
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
          {s.pulse ? (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                s.dot,
              )}
            />
          ) : null}
          <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", s.dot)} />
        </span>
        {status.label}
      </span>
      {showHours ? (
        <span className="text-xs text-brand-ink/55 tabular-nums">
          Heute: {status.hoursSnippet}
        </span>
      ) : null}
    </div>
  );
}
