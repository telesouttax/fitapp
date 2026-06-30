"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, UtensilsCrossed, NotebookPen, UserCircle, Gauge } from "lucide-react";

const items = [
  { href: "/", label: "Painel", icon: Gauge },
  { href: "/treinos", label: "Treinos", icon: Dumbbell },
  { href: "/dietas", label: "Dietas", icon: UtensilsCrossed },
  { href: "/diario", label: "Diário", icon: NotebookPen },
  { href: "/perfil", label: "Perfil", icon: UserCircle },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar desktop */}
      <nav className="hidden md:flex md:flex-col md:w-56 md:shrink-0 border-r border-ink-line px-4 py-6 gap-1 print:hidden">
        <div className="px-2 mb-8">
          <span className="display-text text-2xl font-extrabold tracking-tight text-paper">
            Fit<span className="text-coral">Track</span>
          </span>
        </div>
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-ink-soft text-paper border border-ink-line"
                  : "text-paper-dim hover:text-paper hover:bg-ink-soft/60"
              }`}
            >
              <Icon size={18} strokeWidth={2} className={active ? "text-coral" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-ink-line bg-ink/95 backdrop-blur px-2 py-2 flex justify-between print:hidden">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-1.5 rounded-md text-[11px] font-medium ${
                active ? "text-coral" : "text-paper-dim"
              }`}
            >
              <Icon size={20} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
