"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Input, Card, CardHeader, CardContent, CardFooter, Alert, Spinner } from "@arellan-hnos-core-ecosystem/ui"

export default function ClientLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json() as { message?: string }

      if (!res.ok) {
        setError(data.message ?? "Error al iniciar sesion. Verifique sus credenciales.")
        return
      }

      // HttpOnly cookie set by BFF route — no token in JS
      router.push("/dashboard")
    } catch {
      setError("Error de conexion con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Portal de Clientes</h1>
              <p className="mt-2 text-gray-500">
                Acceda al historial de sus vehículos y órdenes de trabajo.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {error && <Alert variant="error" title="Error" description={error} className="mb-4" />}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="client-email" className="block text-sm font-medium text-gray-700 mb-1">Correo electronico</label>
                <Input id="client-email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cliente@email.com" required />
              </div>
              <div>
                <label htmlFor="client-password" className="block text-sm font-medium text-gray-700 mb-1">Contrasena</label>
                <Input id="client-password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner size="sm" /> : "Ingresar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center">
              <a href="/" className="text-sm text-blue-600 hover:underline">
                Volver al inicio
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
