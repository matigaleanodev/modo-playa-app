# Guia de desarrollo

Este documento resume como operar `modo-playa-app` en local.

## Requisitos

- Node.js 22+
- npm
- Angular CLI opcional
- Ionic CLI opcional
- Android Studio solo para builds Android

## Instalacion y ejecucion

```bash
npm install
npm run start
```

Aplicacion web disponible en `http://localhost:4200`.

## API local

Por defecto, desarrollo apunta a `http://localhost:3000/api`.

Para validacion integrada, levantar tambien `modo-playa-api` en local.
Antes de cambiar modelos, endpoints o manejo de errores, revisar ese repo porque es la fuente de verdad contractual.

## Scripts utiles

- `npm run start`: servidor web local
- `npm run build`: build productivo
- `npm run watch`: build continuo de desarrollo
- `npm run test`: suite unitaria en `ChromeHeadlessCI`
- `npm run test:watch`: suite unitaria en watch mode
- `npm run lint`: validacion de lint

## Persistencia local

- favoritos y preferencias livianas se guardan en `localStorage`
- no hay dependencias de storage nativo en la web publica para esta etapa

## Notas operativas

- `roadmap.md` es un archivo local y operativo; se usa para seguimiento real, no debe versionarse
- este repo consume datos publicos; no debe duplicar logica de negocio del backend
- no implementar flujos administrativos ni consumo de `admin/*`

## Android

```bash
npx cap sync android
npx cap open android
```

Notas:

- `android/local.properties` esta ignorado por git
- version Android actual:
  - `versionCode = 10001`
  - `versionName = 1.0.1`

## Estructura principal

- `src/app/pages`: pantallas publicas
- `src/app/lodgings`: modelos, componentes, servicios y resolver del catalogo
- `src/app/destinations`: modelos y servicios de destinos
- `src/app/shared`: servicios transversales como storage, tema, nav y toast
- `src/app/tabs`: navegacion principal mobile-first

## Validacion minima antes de cerrar cambios

- `npm run lint`
- `npm run test`
- `npm run build`
