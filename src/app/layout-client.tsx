"use client";

import { ThemeProvider } from "@arellan-hnos-core-ecosystem/ui";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultScheme="system">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-brand-primary">Arellan Hnos</span>
          </a>
          <span className="text-sm text-gray-500">Clínica Automotriz</span>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Clínica Automotriz Arellan Hnos.</p>
          <p className="mt-1">Confianza, calidad y transparencia en cada reparación.</p>
        </div>
      </footer>
    </ThemeProvider>
  );
}
