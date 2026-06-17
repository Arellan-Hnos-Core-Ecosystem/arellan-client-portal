"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, CardHeader, CardContent, CardFooter } from "@arellan-hnos-core-ecosystem/ui";

export default function HomePage() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<"plate" | "ot">("plate");
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchValue.trim().toUpperCase();
    if (!trimmed) return;

    const params = new URLSearchParams();
    params.set(searchType === "plate" ? "plate" : "ot", trimmed);
    router.push(`/lookup?${params.toString()}`);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Consulta el estado de tu vehículo
              </h1>
              <p className="mt-2 text-gray-500">
                Ingresa tu número de placa o el código de la orden de trabajo para conocer
                el avance de tu reparación en tiempo real.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSearchType("plate")}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    searchType === "plate"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Por Placa
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType("ot")}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    searchType === "ot"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Por Código OT
                </button>
              </div>

              <div>
                <label htmlFor="search" className="sr-only">
                  {searchType === "plate" ? "Número de placa" : "Código de orden de trabajo"}
                </label>
                <Input
                  id="search"
                  type="text"
                  placeholder={searchType === "plate" ? "Ej: ABC-123" : "Ej: OT-20240001"}
                  value={searchValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full">
                Consultar Estado
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center text-xs text-gray-400">
              <p>Sin registro • Sin llamadas • Información en tiempo real</p>
              <p className="mt-1">
                Solo necesitas tu placa o código OT para consultar.
              </p>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { title: "Transparencia", desc: "Vea exactamente qué se le está haciendo a su vehículo" },
            { title: "Sin esperas", desc: "Consulte desde su celular, cuando quiera" },
            { title: "Confianza", desc: "El taller que cuida su vehículo como usted" },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-gray-100 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
              <p className="mt-1 text-xs text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
