# Development guide

This document summarizes how to operate `modo-playa-app` locally.

## Requirements

- Node.js 22+
- npm
- Angular CLI optional
- Ionic CLI optional
- Android Studio only for Android builds

## Install and run

```bash
npm install
npm run start
```

The web app is available at `http://localhost:4200`.

## Local API

Development points to `http://localhost:3000/api` by default.

For integrated validation, run `modo-playa-api` locally as well.
Before changing models, endpoints, or error handling, review that repo because it is the contractual source of truth.

## Useful scripts

- `npm run start`: local web server
- `npm run build`: production build
- `npm run watch`: continuous development build
- `npm run test`: unit suite in `ChromeHeadlessCI`
- `npm run test:watch`: unit suite in watch mode
- `npm run lint`: lint validation

## Local persistence

- favorites and lightweight preferences are stored in `localStorage`
- there is no native storage dependency for the public web app at this stage

## Operating notes

- `roadmap.md` is a local operating file; it is used for real tracking and must not be versioned
- this repo consumes public data and must not duplicate backend business logic
- do not implement admin flows or consume `admin/*`

## Android

```bash
npx cap sync android
npx cap open android
```

Notes:

- `android/local.properties` is gitignored
- current Android version:
  - `versionCode = 10001`
  - `versionName = 1.0.1`

## Main structure

- `src/app/pages`: public screens
- `src/app/lodgings`: catalog models, components, services, and resolver
- `src/app/destinations`: destination models and services
- `src/app/shared`: cross-cutting services such as storage, theme, nav, and toast
- `src/app/tabs`: mobile-first primary navigation

## Minimum validation before closing changes

- `npm run lint`
- `npm run test`
- `npm run build`
