"use client";

import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-ink-soft border border-ink-line rounded-lg p-5 ${className}`}>{children}</div>
  );
}

export function SectionTitle({ children, eyebrow }: { children: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <span className="text-coral text-xs font-semibold tracking-widest uppercase">{eyebrow}</span>
      )}
      <h2 className="display-text text-xl font-bold text-paper mt-0.5">{children}</h2>
    </div>
  );
}

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const styles =
    variant === "primary"
      ? "bg-coral text-ink hover:bg-coral/90"
      : variant === "danger"
      ? "bg-transparent border border-ink-line text-coral hover:bg-coral-dim/30"
      : "bg-transparent border border-ink-line text-paper hover:bg-ink-line/40";
  return (
    <button
      className={`px-3.5 py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-40 ${styles} ${className}`}
      {...props}
    />
  );
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`bg-ink border border-ink-line rounded-md px-3 py-2 text-sm text-paper placeholder:text-paper-dim/60 focus:border-coral outline-none ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`bg-ink border border-ink-line rounded-md px-3 py-2 text-sm text-paper focus:border-coral outline-none ${className}`}
      {...props}
    />
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="border border-dashed border-ink-line rounded-lg p-8 text-center">
      <p className="text-paper font-medium">{title}</p>
      {hint && <p className="text-paper-dim text-sm mt-1">{hint}</p>}
    </div>
  );
}
