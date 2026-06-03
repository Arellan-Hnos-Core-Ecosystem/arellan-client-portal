import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Clínica Automotriz Arellan Hnos — Consulta el estado de tu vehículo",
    template: "%s | Clínica Automotriz Arellan Hnos",
  },
  description:
    "Consulta el estado de tu vehículo en tiempo real en la Clínica Automotriz Arellan Hnos. Ingresa tu placa o código de OT y conoce el avance de tu reparación sin necesidad de llamar.",
  keywords: [
    "taller mecánico",
    "consulta estado vehículo",
    "reparación automotriz",
    "Arellan Hnos",
    "orden de trabajo",
    "estado de reparación",
  ],
  openGraph: {
    title: "Clínica Automotriz Arellan Hnos — Consulta el estado de tu vehículo",
    description:
      "Consulta el estado de tu vehículo en tiempo real. Sin llamadas, sin esperas.",
    type: "website",
    locale: "es_PE",
    siteName: "Clínica Automotriz Arellan Hnos",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-700">Arellan Hnos</span>
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
      </body>
    </html>
  );
}
