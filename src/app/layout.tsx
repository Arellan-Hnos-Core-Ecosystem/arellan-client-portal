import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "./layout-client";

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
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
