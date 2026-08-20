# Auditoria tecnica del dashboard ELI

Fecha: 13 de agosto de 2026

## 1. Resumen ejecutivo

Este proyecto es un dashboard web construido sobre un template de administracion en Next.js y adaptado para la operacion de consorcios de ELI.

Hoy el producto tiene un nucleo funcional claro:
- autenticacion propia contra Supabase
- monitoreo de tickets
- consulta de edificios
- edicion, cierre y borrado logico de tickets
- vista mobile custom reciente para la home operativa

Tambien conviven dentro del repo varias partes heredadas del template original:
- dashboards `crm` y `finance`
- multiples componentes duplicados o backup
- documentacion general del template en lugar de documentacion del producto ELI
- rutas y pantallas en `coming soon`

Conclusion rapida:
- la base tecnica es moderna y suficiente para evolucionar el producto
- el dominio real hoy gira alrededor de 3 tablas de base de datos
- hay deuda tecnica media, principalmente por arrastre de template, duplicacion de archivos y falta de documentacion de datos

## 2. Stack tecnologico identificado

### Frontend
- Next.js 16.1.6 con App Router
- React 19.2.4
- TypeScript 5.9.3
- Tailwind CSS 4.1.5
- Radix UI + componentes estilo shadcn/ui
- Lucide React para iconografia
- Recharts para visualizaciones
- Sonner para notificaciones
- Zustand para preferencias de UI
- React Hook Form + Zod para formularios y validacion

### Backend dentro del mismo proyecto
- Route Handlers de Next.js para endpoints server-side
- Server Actions para login/logout y preferencias
- Supabase JS como cliente de base de datos
- bcryptjs para validacion de password hash

### Tooling y DX
- Biome como formatter/linter
- Husky + lint-staged para hooks de git
- React Compiler habilitado en `next.config.mjs`

### Integraciones externas detectadas
- Supabase como base de datos y autenticacion propia de admins
- n8n webhook: `https://n8n.ma-no.work/webhook/eli-ticket-closed`
  Se usa para avisar al vecino cuando un ticket se cierra desde dashboard.

## 3. Configuracion tecnica relevante

### Variables de entorno inferidas del codigo
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_KEEPALIVE_SECRET`
- `SUPABASE_KEEPALIVE_TABLE`

### Seguridad y sesion
- Cookie de sesion: `eli_session`
- Middleware protege `/dashboard/*` y redirige a `/login` si no hay cookie
- Login contra tabla `admin_users`
- Hay dos caminos de login en el repo:
  - `POST /api/auth/login`
  - `loginAction` en server actions

Observacion importante:
- En `src/app/api/auth/login/route.ts` la cookie se crea con `httpOnly: true`
- En `src/server/server-actions.ts` la cookie se crea con `httpOnly: false`

Esto genera una inconsistencia de seguridad y comportamiento.

## 4. Arquitectura funcional del proyecto

### Layout general
- `src/app/layout.tsx`
  Root layout global con metadata, tema, provider de preferencias y toaster.
- `src/app/(main)/dashboard/layout.tsx`
  Layout principal autenticado del dashboard.
- `src/app/(main)/dashboard/_components/dashboard-shell-client.tsx`
  Shell de navegacion desktop y mobile.

### Rutas principales activas
- `/login`
  Login principal del producto.
- `/dashboard/default`
  Home operativa principal de ELI.
- `/api/auth/login`
  Endpoint de autenticacion.
- `/api/keepalive/supabase`
  Endpoint de keepalive contra Supabase.

### Rutas secundarias o heredadas
- `/auth/v1/*` y `/auth/v2/*`
  Versiones de auth heredadas del template. No parecen ser el flujo principal.
- `/dashboard/crm`
  Dashboard demo/template.
- `/dashboard/finance`
  Dashboard demo/template.
- `/dashboard/coming-soon`
  Placeholder para modulos no implementados.

### Home publica
- `src/app/(external)/page.tsx`
  Actualmente redirige a `/dashboard/default`.

Implicancia:
- hoy no existe landing publica operativa dentro de este repo
- la raiz `/` funciona como redireccion al dashboard

## 5. Estado real de los modulos

### Modulos realmente conectados al dominio ELI
- Login administrativo
- Monitor principal
- Tickets
- Metricas basadas en tickets y edificios
- Edicion/cierre/borrado logico de tickets
- Vista mobile especifica para dashboard default

### Modulos presentes pero no conectados al producto real
- CRM
- Finance
- varias pantallas auth alternativas
- items de sidebar como `Reclamos`, `Urgencias`, `Edificios`, `Proveedores`, `Reportes`, `Finanzas`, `Configuracion` apuntan en gran parte a `coming-soon`

## 6. Base de datos detectada

No hay migraciones SQL ni esquema formal de base de datos versionado dentro del repo.

Por lo tanto, esta seccion esta inferida a partir del codigo fuente y de los campos que el dashboard consulta o actualiza.

## 7. Tablas detectadas y para que sirven

### 7.1 `admin_users`
Proposito:
- almacenar los usuarios administradores que pueden iniciar sesion en el dashboard
- servir como tabla de autenticacion custom
- opcion por defecto para el keepalive de Supabase

Campos inferidos desde el codigo:
- `id`
- `email`
- `password_hash`
- `name`
- `avatar_url`

Uso en codigo:
- login via API route
- login via Server Action
- keepalive opcional

Archivos clave:
- `src/app/api/auth/login/route.ts`
- `src/server/server-actions.ts`
- `src/app/api/keepalive/supabase/route.ts`

### 7.2 `edificios`
Proposito:
- catalogo de consorcios/edificios administrados
- fuente para filtros y asignacion de tickets
- fuente para conteo de edificios activos en metricas

Campos inferidos desde el codigo:
- `id`
- `nombre`
- `direccion`
- `codigo`

Uso en codigo:
- selector de consorcio en alta y edicion de tickets
- filtro de tickets por consorcio
- card de metricas `Edificios activos`

Archivos clave:
- `src/hooks/use-eli-data.ts`
- `src/app/(main)/dashboard/_components/edit-ticket-dialog.tsx`
- `src/app/(main)/dashboard/_components/ticket-dialog.tsx`

### 7.3 `tickets`
Proposito:
- entidad central del producto
- representa reclamos, urgencias, consultas y pagos
- motor del monitor, actividad reciente, metricas y chart historico

Campos inferidos desde el codigo:
- `id`
- `ticket_code`
- `ticket_type`
- `priority`
- `category`
- `description`
- `status`
- `created_at`
- `updated_at`
- `edificio_id`
- `chat_id`
- `data` (json)
- `deleted_at`
- `deleted_reason`
- `deleted_by`
- `created_by`
- `closed_reason`
- `closed_by`
- `closed_at`

Relacion inferida:
- `tickets.edificio_id -> edificios.id`

Convenciones funcionales observadas:
- `ticket_type` admite: `reclamo`, `urgencia`, `consulta`, `pago`
- `priority` admite: `alta`, `media`, `baja`
- `status` admite: `abierto`, `en_proceso`, `cerrado`
- borrado es logico, no fisico
- `data` se usa para guardar metadatos flexibles como:
  - `tags`
  - `source`

Uso en codigo:
- cards resumen
- tabla principal de tickets
- actividad reciente mobile
- chart de abiertos/cerrados por fecha
- cierre con motivo
- notificacion a n8n cuando se cierra un ticket de origen no-dashboard

Archivos clave:
- `src/hooks/use-eli-data.ts`
- `src/app/(main)/dashboard/_components/data-table.tsx`
- `src/app/(main)/dashboard/_components/edit-ticket-dialog.tsx`
- `src/app/(main)/dashboard/_components/delete-ticket-dialog.tsx`
- `src/app/(main)/dashboard/default/_components/mobile-dashboard-home.tsx`

## 8. Operaciones de base de datos identificadas

### Lecturas
- conteo de edificios
- conteo de tickets abiertos
- conteo de urgencias abiertas
- lectura de tickets abiertos para TPR
- lectura de tickets con join a `edificios(nombre)`
- lectura de series temporales por `created_at`

### Escrituras
- crear ticket
- editar ticket
- cambiar estado/prioridad/tipo
- cerrar ticket con motivo
- borrado logico del ticket

### Observacion de modelado
El dashboard depende fuertemente de `tickets` y solo marginalmente de `edificios` y `admin_users`.

Eso sugiere que hoy el verdadero modelo minimo viable del producto es:
- admins
- edificios
- tickets

## 9. Integraciones y flujos de negocio identificados

### Flujo de login
1. El admin envia email/password
2. Se consulta `admin_users`
3. Se valida `password_hash` con bcrypt
4. Se guarda cookie `eli_session`
5. Se redirige a `/dashboard/default`

### Flujo de cierre de ticket
1. Se cambia `status` a `cerrado`
2. Se exige `closed_reason` cuando el cierre es nuevo
3. Se guarda `closed_by` y `closed_at`
4. Si el ticket no fue creado desde dashboard, se llama a n8n webhook

### Flujo de borrado
1. No se elimina la fila
2. Se setean `deleted_at`, `deleted_reason`, `deleted_by`
3. Las consultas operativas filtran `deleted_at is null`

## 10. Hallazgos de deuda tecnica

### 10.1 Deuda documental
- El `README.md` sigue describiendo principalmente el template original `Studio Admin`
- No existe documentacion de dominio ELI ni de modelo de datos
- No hay migraciones ni esquema SQL versionado

### 10.2 Deuda estructural
- Existen multiples archivos duplicados o backup dentro de `src/`
  Ejemplos:
  - `use-eli-data-bu.ts`
  - `data-table-old.tsx`
  - `account-switcher_old.tsx`
  - `nav-main-bu.tsx`
  - `sidebar-items copy.ts`
  - `search-dialog copy.tsx`
  - `nav-user-backup.tsx`
- Hay componentes duplicados entre `_components` globales y `default/_components`

### 10.3 Deuda funcional
- Muchos modulos visibles siguen en `coming-soon`
- `crm` y `finance` parecen demos del template, no partes del producto operativo principal
- La home publica fue eliminada y la raiz ahora redirige al dashboard

### 10.4 Deuda tecnica concreta
- `middleware.ts` usa una convencion de Next marcada como deprecada; deberia migrarse a `proxy`
- Next detecta multiples `package-lock.json` y elige un root ambiguo en build/dev
- `keepalive` usa `count: exact`, lo que no es la opcion mas liviana para un ping periodico
- Hay una inconsistencia de seguridad en el tratamiento de la cookie `eli_session`
- En varios puntos se usa `document.cookie` para hidratar usuario en cliente, lo cual expone mas datos de los necesarios si la cookie no es `httpOnly`

## 11. Riesgos principales

### Riesgo 1: seguridad de sesion inconsistente
La cookie se crea con estrategias distintas segun el flujo de login. Esto puede derivar en comportamiento no uniforme y exponer datos de sesion al cliente.

### Riesgo 2: base de datos no versionada en repo
No tener migraciones o esquema versionado dificulta onboarding, auditoria, rollback y evolucion controlada del producto.

### Riesgo 3: mezcla de producto real y template
Convivir con dashboards demo, rutas legacy y archivos backup aumenta costo cognitivo, errores y tiempo de mantenimiento.

### Riesgo 4: documentacion desalineada
El repo no explica claramente que es ELI, que modulos estan vivos, que datos usa y cuales son sus dependencias.

## 12. Recomendaciones priorizadas

### Prioridad alta
1. Versionar el esquema de base de datos
   - agregar migraciones SQL o documentacion formal de tablas
2. Unificar el flujo de autenticacion
   - elegir un solo camino y homogeneizar el uso de `httpOnly`
3. Reescribir el `README.md`
   - orientado a ELI, no al template base
4. Migrar `middleware.ts` a `proxy`

### Prioridad media
5. Limpiar archivos duplicados, backups y variantes no usadas
6. Separar explicitamente modulos demo (`crm`, `finance`) de modulos producto
7. Documentar variables de entorno y dependencias externas
8. Revisar el endpoint de keepalive para que haga una consulta mas liviana

### Prioridad baja
9. Consolidar componentes duplicados de tickets entre rutas
10. Evaluar tests minimos para hooks de datos y flujos criticos de auth/tickets

## 13. Estado actual del producto, en una frase

ELI hoy es un dashboard operativo basado en Next.js + Supabase, con foco real en tickets y edificios, pero todavia conviviendo con bastante infraestructura heredada del template original.

## 14. Archivos clave para continuar la documentacion

- `package.json`
- `src/hooks/use-eli-data.ts`
- `src/app/api/auth/login/route.ts`
- `src/server/server-actions.ts`
- `src/app/(main)/dashboard/_components/data-table.tsx`
- `src/app/(main)/dashboard/_components/edit-ticket-dialog.tsx`
- `src/app/(main)/dashboard/_components/delete-ticket-dialog.tsx`
- `src/app/(main)/dashboard/default/_components/mobile-dashboard-home.tsx`
- `src/navigation/sidebar/sidebar-items.ts`
- `src/lib/supabase.ts`
- `src/lib/supabase-admin.ts`

