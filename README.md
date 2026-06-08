# arellan-client-portal

Portal público para clientes de la Clínica Automotriz Arellan Hnos. Permite consultar el estado del vehículo, historial de servicios, aprobar cotizaciones y programar citas. Sin autenticación requerida para la consulta básica.

## Descripción

`arellan-client-portal` es la cara pública del taller hacia sus clientes. Un dueño de vehículo puede consultar en tiempo real qué le están haciendo a su auto ingresando solo la placa o el código de OT — sin necesidad de llamar al taller ni esperar. Optimizado para SEO y carga rápida en celulares.

## Audiencia

| Tipo | Descripción |
|------|-------------|
| Cliente anónimo | Consulta por placa/código OT sin login |
| Cliente registrado (Fase 2) | Historial completo, múltiples vehículos, citas online |

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14+ con TypeScript (SSR/SSG para SEO) |
| Estilos | Tailwind CSS + `@arellan/ui` |
| Fetching | TanStack Query v5 |
| Auth (Fase 2) | Supabase Auth (login opcional) |
| Testing | Vitest + Playwright (E2E) |
| Deploy | Vercel (free tier → Pro según tráfico) |

## Estructura de Carpetas

```
src/
├── app/
│   ├── lookup/                 # Búsqueda por placa o código OT (sin login)
│   ├── status/[id]/            # Estado actual del vehículo en tiempo real
│   ├── history/                # Historial de servicios
│   ├── quotes/[id]/            # Ver y aprobar cotizaciones digitalmente
│   └── account/                # Perfil y vehículos (login opcional - Fase 2)
├── features/
│   ├── tracking/               # Estado en tiempo real de la OT
│   ├── cotizaciones/           # Visualización y aprobación de cotizaciones
│   ├── historial/              # Servicios anteriores por vehículo
│   └── pagos/                  # Pago online (Fase 3)
├── components/
│   ├── StatusBadge/            # Indicadores de estado del vehículo
│   ├── VehicleCard/            # Tarjeta de resumen del vehículo
│   └── TimelineProgress/       # Progreso visual de la OT
├── lib/
│   └── api/                    # Endpoints públicos de arellan-platform
└── types/
```

## Estados del Vehículo

El portal muestra el estado de la OT en tiempo real:

| Estado | Descripción |
|--------|-------------|
| `RECEIVED` | Vehículo ingresado al taller, pendiente de diagnóstico |
| `IN_DIAGNOSIS` | Mecánico evaluando el problema |
| `BUDGETED` | Cotización disponible para aprobación del cliente |
| `IN_PROGRESS` | Trabajo en curso |
| `IN_REVIEW` | Revisión final antes de entrega |
| `READY` | Vehículo listo, se puede pasar a recoger |
| `DELIVERED` | Vehículo entregado al cliente |
| `CANCELLED` | Orden cancelada |

## Funcionalidades MVP

- **Consulta anónima** — búsqueda por número de placa o código OT, sin registro
- **Estado en tiempo real** — qué se le está haciendo al vehículo en este momento
- **Historial de servicios** — qué se le hizo al vehículo en cada visita anterior
- **Aprobación de cotizaciones** — el cliente aprueba o rechaza cotizaciones digitalmente desde su celular

## Funcionalidades Fase 2

- Login opcional para historial completo y múltiples vehículos
- Carga de documentos (SOAT, tarjeta de propiedad)
- Programación de citas online
- Calificación del servicio recibido (NPS)
- Notificaciones SMS/WhatsApp cuando el vehículo está listo

## Funcionalidades Fase 3

- Pagos online — pago parcial o total desde el portal (Culqi / Yape Business)
- Recordatorios automáticos de próximo mantenimiento o RTV

## Variables de Entorno

```env
NEXT_PUBLIC_API_URL=https://api.arellan.pe
NEXT_PUBLIC_APP_URL=https://cliente.arellan.pe
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Scripts de Desarrollo

```bash
npm install
npm run dev          # localhost:3004
npm run build
npm run start
npm run test
npm run test:e2e     # Playwright E2E
```

## SEO

- Server-side rendering para páginas de estado (`/status/[id]`)
- Metadata dinámica por OT (sin exponer datos privados del cliente)
- Open Graph básico para compartir estado del vehículo

## Dominio

`cliente.arellan.pe` — Público, sin autenticación requerida para consulta básica.

## Repos Relacionados

- `arellan-platform` — API pública de consulta de OTs (endpoints `/public/orders/lookup`)
- `arellan-design-system` — Componentes de UI

## Licencia

Privado — © 2026 Arellan Hnos. Todos los derechos reservados.
