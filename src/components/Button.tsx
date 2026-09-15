import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const base =
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:opacity-60";

const variants = {
  primary: "bg-brand-blue text-white hover:bg-brand-blue/90 rounded-full px-6 py-3",
  secondary: "bg-brand-coral text-white hover:bg-brand-coral/90 rounded-full px-6 py-3",
  outline:
    "border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white rounded-full px-6 py-3",
  pill: "bg-brand-blue text-white hover:bg-brand-blue/90 rounded-md px-5 py-2.5 text-sm",
} as const;

type Variant = keyof typeof variants;

type Common = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
};

type AsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AsLink = Common & {
  href: string;
  target?: string;
  rel?: string;
};

export function Button(props: AsButton | AsLink) {
  const { children, className, variant = "primary" } = props;
  const classes = cn(base, variants[variant], className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes} target={props.target} rel={props.rel}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as AsButton;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
