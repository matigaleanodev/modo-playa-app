# Modo Playa App

Spanish version: [README.md](./README.md)

`modo-playa-app` is the public mobile-first catalog for Modo Playa.
It is designed for anonymous users browsing lodgings, destinations, and public contact information.

It is not:

- the backend API
- the admin panel
- a management app

## Ecosystem role

- `modo-playa-api`: business rules, public contracts, and data
- `modo-playa-admin`: private management
- `modo-playa-app`: public catalog experience

The API is the source of truth for models, endpoints, and error codes.

## Current stack

- Angular 20 standalone
- Ionic 8
- TypeScript with signals and computed
- SCSS
- Capacitor 8 for Android
- Jasmine + Karma

## Public flows covered

- home with paginated catalog
- lodging detail
- favorites persisted in `localStorage`
- destinations with public context
- app info and legal pages
- light, dark, and system theme

## Relevant public contracts

Consumed endpoints:

- `GET /api/lodgings`
- `GET /api/lodgings/:id`
- `GET /api/destinations`
- `GET /api/destinations/:id/context`

Contract assumptions currently adopted by the frontend:

- public `mediaImages` must not assume `key`, `bytes`, or `mime` as canonical fields
- `mainImage` and `images` remain available as legacy-compatible fallbacks
- `DestinationContext` includes `destinationId` and `timezone`
- public errors may be discriminated by `code` when the UX needs it

## Development

The local operating guide lives in [DEVELOPMENT.en.md](./DEVELOPMENT.en.md).

## Change criteria

- do not duplicate business logic already implemented in `modo-playa-api`
- do not consume `admin/*` endpoints
- keep the product mobile-first
- validate contract changes against `modo-playa-api` first
