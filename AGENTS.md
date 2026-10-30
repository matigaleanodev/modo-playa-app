# modo-playa-app

## Contexto de trabajo

Si existe un workspace con AGENTS.md en los directorios padre, leerlo explícitamente antes de editar y seguir sus referencias. Una raíz Git anidada puede impedir la herencia automática. Fuera de ese entorno, este archivo y el README deben ser suficientes para trabajar.

## Aplicación y límites

- Angular standalone, Ionic y Capacitor; catálogo público orientado a móviles.
- La app permite explorar alojamientos, imágenes, destinos y datos de contacto.
- Los datos de negocio vienen de la API; los filtros/favoritos usan estado local liviano.
- No consumir rutas admin ni introducir edición de alojamientos, usuarios o administración de propietarios.
- Mantener los modelos alineados con las respuestas públicas de la API compatible.
- El panel de gestión vive en modo-playa-admin.

## Desarrollo y verificación

- Instalar con npm ci; iniciar con npm start; compilar con npm run build.
- npm test utiliza el navegador headless configurado en Karma.
- npm run test:watch abre la modalidad interactiva de tests.
- Consultar DEVELOPMENT para navegador, entornos y comandos nativos.
- Verificar navegación, filtros y estados vacíos/error cuando cambien servicios o pantallas.

## Restricciones

- No duplicar lógica de negocio ni procesamiento de imágenes del backend.
- Evitar dependencias de sesiones administrativas en navegación anónima.
- Conservar presentación mobile-first y costos acotados de carga de imágenes.
- La validación web no sustituye pruebas de Capacitor/Android.
- No modificar contratos o configuración de la API desde este repositorio.
