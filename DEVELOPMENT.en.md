# Development Guide -- Modo Playa App

This document explains how to work with the public Modo Playa frontend locally.

---

## Requirements

- Node.js 22+ (LTS recommended)
- npm
- Angular CLI (optional)
- Ionic CLI (optional)
- Android Studio (only if you build Android)

---

## Installation

```bash
npm install
```

---

## Local run (web)

```bash
npm run start
```

Available at:

`http://localhost:4200`

---

## API in development

By default, the app points to:

`http://localhost:3000/api`

Make sure `modo-playa-api` is running locally for integrated testing.

---

## Useful scripts

- `npm run start`: local server
- `npm run build`: production build
- `npm run watch`: development watch build
- `npm run test`: unit tests in ChromeHeadlessCI
- `npm run test:watch`: unit tests in watch mode
- `npm run lint`: lint checks

---

## Environments

- `src/environments/environment.ts`: development
- `src/environments/environment.prod.ts`: production

---

## Android (Capacitor)

Sync web changes into Android platform:

```bash
npx cap sync android
```

Open Android project:

```bash
npx cap open android
```

Notes:

- `android/local.properties` is gitignored.
- Current Android app version:
  - `versionCode = 10000`
  - `versionName = 1.0.0`

---

## Project architecture

Main structure in `src/app`:

- `pages/`: screens (home, favorites, destinations, info, legal)
- `lodgings/`: lodging domain (models, services, resolver, components)
- `destinations/`: destination models and services
- `shared/`: reusable services (theme, storage, nav, toastr)
- `tabs/`: primary navigation (tab bar)

---

## Repository scope

This repo is only the public catalog.

Do not implement here:

- admin CRUD flows for lodgings
- owner management workflows
- business logic already implemented in API

Always validate endpoint/model changes against `modo-playa-api`.
