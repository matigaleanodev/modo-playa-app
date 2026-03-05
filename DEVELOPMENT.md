# Development Guide -- Modo Playa App

Este documento describe como trabajar con el frontend publico de Modo Playa en local.

---

## Requisitos

- Node.js 22+ (LTS recomendado)
- npm
- Angular CLI (opcional)
- Ionic CLI (opcional)
- Android Studio (solo si vas a compilar Android)

---

## Instalacion

```bash
npm install
```

---

## Ejecucion local (web)

```bash
npm run start
```

Disponible en:

`http://localhost:4200`

---

## API en desarrollo

Por defecto, la app en desarrollo apunta a:

`http://localhost:3000/api`

Asegurate de levantar `modo-playa-api` localmente para pruebas integradas.

---

## Scripts utiles

- `npm run start`: servidor local
- `npm run build`: build de produccion
- `npm run watch`: build continuo en modo desarrollo
- `npm run test`: unit tests en ChromeHeadlessCI
- `npm run test:watch`: unit tests en modo watch
- `npm run lint`: validaciones de lint

---

## Entornos

- `src/environments/environment.ts`: desarrollo
- `src/environments/environment.prod.ts`: produccion

---

## Android (Capacitor)

Sincronizar cambios web con plataforma Android:

```bash
npx cap sync android
```

Abrir proyecto Android:

```bash
npx cap open android
```

Notas:

- `android/local.properties` esta ignorado por git.
- Version Android actual:
  - `versionCode = 10000`
  - `versionName = 1.0.0`

---

## Arquitectura del proyecto

Estructura principal en `src/app`:

- `pages/`: pantallas (home, favoritos, destinos, info, legales)
- `lodgings/`: dominio de alojamientos (modelos, servicios, resolver, componentes)
- `destinations/`: modelos y servicios de destinos
- `shared/`: servicios reutilizables (tema, storage, nav, toastr)
- `tabs/`: navegacion principal (tab bar)

---

## Alcance del repo

Este repo es solo catalogo publico.

No implementar aqui:

- ABM administrativo de alojamientos
- flujos de gestion de owners
- logica de negocio que ya vive en API

Siempre validar cambios de modelos/endpoints contra `modo-playa-api`.
