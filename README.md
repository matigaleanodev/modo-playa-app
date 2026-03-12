# Modo Playa App

English version: [README.en.md](./README.en.md)

`modo-playa-app` es el catalogo publico mobile-first de Modo Playa.
Esta aplicacion esta pensada para usuarios anonimos que exploran alojamientos, destinos e informacion de contacto.

No es:

- el backend API
- el panel admin
- una app de gestion

## Rol en el ecosistema

- `modo-playa-api`: reglas de negocio, contratos publicos y datos
- `modo-playa-admin`: gestion privada
- `modo-playa-app`: experiencia publica de catalogo

La API es la fuente de verdad para modelos, endpoints y codigos de error.

## Stack actual

- Angular 20 standalone
- Ionic 8
- TypeScript con signals y computed
- SCSS
- Capacitor 8 para Android
- Jasmine + Karma

## Flujos publicos cubiertos

- home con catalogo paginado
- detalle de alojamiento
- favoritos persistidos en `localStorage`
- destinos con contexto publico
- informacion de la app y paginas legales
- tema claro, oscuro y sistema

## Contratos publicos relevantes

Endpoints consumidos:

- `GET /api/lodgings`
- `GET /api/lodgings/:id`
- `GET /api/destinations`
- `GET /api/destinations/:id/context`

Supuestos de contrato actualmente adoptados en frontend:

- `mediaImages` publicos no deben asumir `key`, `bytes` ni `mime` como base del contrato
- `mainImage` e `images` siguen disponibles como fallback legacy-compatible
- `DestinationContext` contempla `destinationId` y `timezone`
- los errores publicos pueden discriminarse por `code` cuando la UX lo necesita

## Desarrollo

La guia operativa local esta en [DEVELOPMENT.md](./DEVELOPMENT.md).

## Criterio de cambios

- no duplicar logica de negocio ya resuelta en `modo-playa-api`
- no consumir endpoints `admin/*`
- mantener foco mobile-first
- validar cualquier cambio de contrato mirando primero `modo-playa-api`
