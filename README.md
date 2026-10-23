# Remates Vargas

Aplicación web para publicar y gestionar **remates de vivienda en Colombia**.

- **Sitio público**: landing, listado filtrable (con filtros en la URL), detalle con galería y mapa, contacto.
- **Panel administrativo** (`/admin`): dashboard, CRUD de remates con subida de imágenes, bandeja de solicitudes y limpieza de imágenes huérfanas.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions) · React 19 · TypeScript estricto |
| UI | HeroUI v3 · Tailwind CSS 4 · `lucide-react` · `motion` (solo en el hero) |
| Base de datos | PostgreSQL en **Neon** · Drizzle ORM + `drizzle-kit` |
| Autenticación | Better Auth (correo y contraseña, sin registro público) |
| Imágenes | **Neon Object Storage** (compatible con S3, bucket privado) |
| Formularios | React Hook Form + Zod (se validan de nuevo en el servidor) |
| Gestor de paquetes | pnpm |

## Arquitectura

**Backend → Clean Architecture** (`src/server/`). Las dependencias solo apuntan hacia adentro:

```
src/server/
  domain/          Entidades y reglas de negocio, interfaces de repositorios y servicios, errores.
                   No importa nada de las demás capas.
  application/     Casos de uso, DTOs y mappers. Solo dependen de interfaces del dominio.
  infrastructure/  Drizzle (schema, migraciones, repositorios), Better Auth, almacenamiento S3.
  presentation/    Server Actions, validadores Zod, guard de administrador, route handlers.
```

Las Server Actions son la frontera entre la UI y los casos de uso: validan con Zod, ejecutan el caso de
uso y devuelven `{ ok, data }` o `{ ok: false, error }`. Toda acción administrativa llama a `requireAdmin()`.

**Frontend → Feature-Based Architecture** (`src/features/`). Cada feature (`landing`, `remates`, `contact`,
`auth`, `admin`) es autónomo y expone un `index.ts`. **Ningún feature importa de otro**: lo compartido vive en
`src/components/ui`, `src/components/layout` y `src/lib`, y las páginas de `src/app` los componen.

```
src/
  app/              Rutas (público en (public), panel en admin/(panel), login en admin/(auth))
  components/       Compartidos: ui/, layout/, branding/
  features/         landing · remates · contact · auth · admin
  lib/              Utilidades (formato COP/fechas, slug, datos de Colombia, constantes del sitio)
  server/           Backend (ver arriba)
  proxy.ts          Protege /admin/* (en Next 16 reemplaza a middleware.ts)
```

## Puesta en marcha local

Requisitos: **Node 22.18+** (se usa 24) y **pnpm**.

```bash
pnpm install
cp .env.example .env.local        # y completa los valores (ver tabla)
pnpm db:migrate                   # crea las tablas en Neon
pnpm db:seed                      # 12 remates de ejemplo + usuario administrador
pnpm dev                          # http://localhost:3000
```

Panel: <http://localhost:3000/admin/login>. El seed crea `admin@remates.co` con la clave de ejemplo
`Admin123!` — **cámbiala** (ver más abajo).

### Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión de Neon (la *pooled*). |
| `BETTER_AUTH_SECRET` | Secreto de sesiones. Mínimo 32 caracteres aleatorios. |
| `BETTER_AUTH_URL` | URL pública del sitio (`http://localhost:3000` en local). |
| `NEXT_PUBLIC_APP_URL` | Igual que la anterior; se usa para canonical, sitemap y Open Graph. |
| `AWS_ENDPOINT_URL_S3` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` | Credencial S3 de Neon Object Storage. |
| `S3_BUCKET` | Nombre del bucket (por defecto `uploads`). |
| `ORPHAN_MIN_AGE_MINUTES` | Opcional. Antigüedad mínima para considerar huérfana una imagen (por defecto 60). |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Solo para los scripts de administrador. |

### Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` / `build` / `start` | Desarrollo, build de producción y servidor de producción. |
| `pnpm lint` / `typecheck` | ESLint y `tsc --noEmit`. |
| `pnpm db:generate` | Genera una migración a partir de `schema.ts`. |
| `pnpm db:migrate` | Aplica las migraciones pendientes. |
| `pnpm db:studio` | Explorador visual de la base de datos. |
| `pnpm db:seed` | Remates de ejemplo + administrador (también `db:seed:remates` y `db:seed:admin`). |
| `pnpm db:admin-password` | Cambia la clave del administrador y cierra sus sesiones. |
| `pnpm storage:cors` | Restringe los orígenes que pueden subir imágenes al bucket. |

Los scripts `db:*` y `storage:cors` corren con Node directamente (sin `tsx`), por eso el código del servidor
importa con extensión `.ts`.

## Imágenes

El bucket es **privado**. En la base solo se guardan las *keys* (`remates/<uuid>.jpg`):

1. En el panel, el navegador pide una URL prefirmada (válida 5 min, atada al tipo y tamaño exactos del archivo) y
   sube **directo** al bucket. Se aceptan JPG, PNG y WebP de hasta 5 MB, máximo 10 por remate.
2. El sitio las sirve por `/api/images/remates/<key>`, que lee del bucket con caché larga y ETag. Las
   credenciales nunca llegan al navegador.

### Imágenes huérfanas

Si alguien sube una imagen y no guarda el formulario, el archivo queda en el bucket sin usar. El panel incluye la
sección **Imágenes huérfanas** (`/admin/imagenes`) para revisarlas y eliminarlas (una a una, varias o todas).

- Una imagen es huérfana si está en el bucket y **ningún remate la usa, ni activo ni eliminado** (un remate
  eliminado se puede restaurar, así que conserva sus fotos).
- Solo se consideran las imágenes que generó la subida (`remates/<uuid>.jpg|png|webp`); cualquier otro objeto
  del bucket no se toca.
- Las subidas de **menos de 1 hora** no se listan, por si pertenecen a un formulario que aún no se guardó. El
  margen se cambia con `ORPHAN_MIN_AGE_MINUTES`.
- Antes de borrar se vuelve a comprobar en el servidor que cada imagen siga siendo huérfana: si mientras tanto
  alguien la asignó a un remate, no se elimina. El borrado es definitivo.

## Despliegue en Vercel + Neon

1. **Neon**: ya tienes el proyecto y el bucket. Anota `DATABASE_URL` y la credencial S3.
2. **Migraciones en producción** (una vez, y después de cada cambio de esquema), desde tu máquina:
   ```bash
   DATABASE_URL="<cadena de producción>" pnpm exec drizzle-kit migrate
   ```
   > Usa una rama de Neon distinta para *Preview* y otra para *Production* si no quieres mezclar datos.
3. **Vercel**: importa el repositorio (framework *Next.js*, el build usa `pnpm build`). `vercel.json` fija la región
   `iad1` (Virginia), la más cercana a Neon `us-east-2`.
4. **Variables de entorno** en Vercel (*Production* y *Preview*): todas las de la tabla. Ojo con estas:
   - `DATABASE_URL` debe existir también **durante el build** (la landing se genera con datos de la base).
   - `BETTER_AUTH_URL` y `NEXT_PUBLIC_APP_URL` deben ser la URL real (`https://tu-dominio.com`), sin barra final.
   - `BETTER_AUTH_SECRET`: genera uno nuevo para producción.
5. **Crea el administrador de producción** apuntando a la base de producción:
   ```bash
   ADMIN_EMAIL="tu@correo.co" ADMIN_PASSWORD="una-clave-larga-y-unica" \
   DATABASE_URL="<cadena de producción>" \
   node --env-file=.env.local src/server/infrastructure/db/seed-admin.ts
   ```
   (Si usas el `.env.local` de siempre, define esas variables en la misma línea para que prevalezcan.) El seed
   de remates de ejemplo es opcional: no lo ejecutes en producción si no quieres datos de muestra.
6. **Restringe el CORS del bucket** a tu dominio:
   ```bash
   CORS_ORIGINS="https://tu-dominio.com" pnpm storage:cors
   ```
   Para seguir desarrollando en local, añade también `http://localhost:3000` (separados por coma).
7. **Dominio**: añádelo en Vercel y actualiza `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL`.

### Lista de verificación después de publicar

- [ ] Entrar a `/admin/login`, crear un remate con imágenes y verlo en el sitio público.
- [ ] `https://tu-dominio.com/sitemap.xml` y `/robots.txt` responden con tu dominio.
- [ ] Compartir un remate en WhatsApp/Facebook muestra su foto (Open Graph).
- [ ] La clave de ejemplo `Admin123!` **no** existe en producción.
- [ ] Rotaste las credenciales de Neon (base de datos y bucket) si alguna vez se compartieron en un chat o repositorio.

## Contenido que debes reemplazar

- Teléfono, correo y dirección: `src/lib/site.ts` (hoy son **datos de ejemplo**).
- Video del hero: constante `HERO_VIDEO_URL` en el mismo archivo.
- Logo: `src/components/branding/logo.tsx` (hoy es una marca de texto "RV · Remates Vargas").
- Términos y condiciones y política de privacidad: `src/app/(public)/legal/[doc]/page.tsx` es un texto
  provisional; el contenido legal debe redactarlo y revisarlo quien corresponda.
- Las fotos de los remates de ejemplo son de Unsplash y no corresponden a inmuebles reales.

## Seguridad

- Sesión en cookies `httpOnly`; sin registro público; el rol se verifica en el proxy, en el layout del panel y en
  **cada Server Action** administrativa.
- Better Auth limita los intentos de inicio de sesión. El formulario de contacto solo tiene un campo trampa
  anti-spam: si recibes spam, añade un límite de envíos o un captcha.
- Cabeceras de seguridad básicas en `next.config.ts` (sin CSP: el sitio incrusta Google Maps y el video del hero).

## Datos de Colombia

`src/lib/colombia.ts` incluye los 32 departamentos más Bogotá D.C. y datos de referencia de ciudades y
municipios para Antioquia, Cundinamarca, Bogotá, Valle del Cauca, Atlántico, Bolívar y Santander. En los demás
departamentos el panel permite escribir ciudad y municipio a mano; los filtros del sitio público filtran por esos
textos tal como se guardaron.
