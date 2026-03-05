# Modo Playa App

🌎 Version en espanol: [README.md](./README.md)

**Modo Playa App** is the public app of the Modo Playa ecosystem.
It is designed for anonymous users who want to browse lodgings on the Argentine coast.

It is not an admin panel and does not contain backend business logic.

---

## Ecosystem role

- `modo-playa-api`: backend and business rules.
- `modo-playa-admin`: private management panel.
- `modo-playa-app` (this repo): public mobile-first catalog.

---

## Tech stack

- Ionic + Angular standalone (v20)
- TypeScript + Signals
- SCSS
- Angular Router
- Capacitor (Android)
- Jasmine + Karma for unit testing

---

## Main features

- Home with paginated lodging catalog
- Lodging detail page
- Favorites persisted in local storage
- Destinations with weather context (current weather, forecast, sunrise, sunset)
- App info page
- Legal pages (Terms and Privacy)
- Theme selector (light, dark, system)
- Global side menu and bottom tab bar

---

## API integration

The app consumes Modo Playa API and does not duplicate business logic.

Public endpoints currently used:

- `GET /api/lodgings`
- `GET /api/lodgings/:id`
- `GET /api/destinations`
- `GET /api/destinations/:id/context`

Environment setup:

- Development: `src/environments/environment.ts`
- Production: `src/environments/environment.prod.ts`

---

## Main routes

- `/home`
- `/favoritos`
- `/destinos`
- `/lodging/:id`
- `/info`
- `/terms`
- `/privacy`

---

## Version

Current app version: **1.0.0**

---

## Development

Local development guide:

👉 [DEVELOPMENT.en.md](./DEVELOPMENT.en.md)
