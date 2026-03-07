# Modo Playa App

🌐 English version: [README.en.md](./README.en.md)

**Modo Playa App** es la aplicacion publica del ecosistema Modo Playa.
Esta app esta orientada a usuarios anonimos que quieren explorar alojamientos en la costa argentina.

No es un panel administrativo ni contiene logica de negocio de backend.

---

## Rol en el ecosistema

- `modo-playa-api`: backend y reglas de negocio.
- `modo-playa-admin`: panel privado de gestion.
- `modo-playa-app` (este repo): catalogo publico mobile-first.

---

## Stack tecnologico

- Ionic + Angular standalone (v20)
- TypeScript + Signals
- SCSS
- Angular Router
- Capacitor (Android)
- Jasmine + Karma para unit testing

---

## Funcionalidades principales

- Home con listado paginado de alojamientos
- Detalle de alojamiento
- Favoritos persistidos en storage local
- Destinos con contexto climatico (clima, pronostico, amanecer, atardecer)
- Pantalla de info de app
- Paginas legales (Terminos y Privacidad)
- Selector de tema (claro, oscuro, sistema)
- Menu lateral global y tab bar inferior

---

## Integracion con API

La app consume la API de Modo Playa y no duplica logica de negocio.

Endpoints publicos usados actualmente:

- `GET /api/lodgings`
- `GET /api/lodgings/:id`
- `GET /api/destinations`
- `GET /api/destinations/:id/context`

Configuracion de entorno:

- Desarrollo: `src/environments/environment.ts`
- Produccion: `src/environments/environment.prod.ts`

---

## Navegacion principal

- `/home`
- `/favoritos`
- `/destinos`
- `/lodging/:id`
- `/info`
- `/terms`
- `/privacy`

---

## Version

Version actual de aplicacion: **1.0.1**

---

## Desarrollo

Guia de desarrollo local:

👉 [DEVELOPMENT.md](./DEVELOPMENT.md)

