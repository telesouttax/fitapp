import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitTrack — Treinos e Dieta",
  description: "Monte treinos, dietas e acompanhe calorias e macros.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-body antialiased min-h-screen flex">
        <Nav />
        <main className="flex-1 min-h-screen pb-20 md:pb-0">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">{children}</div>
        </main>
      </body>
    </html>
  );
}
