import { mkdirSync, writeFileSync } from "node:fs";

const maxLength = 500;
const locales = ["en-US", "es-419", "es-US"];
const outputDirectory = process.env.RELEASE_NOTES_DIR;
const versionName = process.env.RELEASE_VERSION_NAME;

if (!outputDirectory) {
  throw new Error("Missing RELEASE_NOTES_DIR");
}

if (!versionName) {
  throw new Error("Missing RELEASE_VERSION_NAME");
}

mkdirSync(outputDirectory, { recursive: true });

for (const locale of locales) {
  writeFileSync(
    `${outputDirectory}/whatsnew-${locale}`,
    buildNotes(locale),
    "utf8",
  );
}

function buildNotes(locale) {
  const notesByLocale = {
    "en-US": [
      `What's new in ${versionName}`,
      "",
      "- Refined spacing and visual balance across home, favorites, and detail screens.",
      "- Improved backgrounds, headers, and safe-area behavior for a cleaner mobile feel.",
      "- Polished filters, chips, and shared UI styles for a more consistent browsing experience.",
    ].join("\n"),
    "es-419": [
      `Novedades de ${versionName}`,
      "",
      "- Refinamos espaciados y balance visual en home, favoritos y detalle de alojamiento.",
      "- Mejoramos fondos, headers y comportamiento de safe area para una vista mobile mas prolija.",
      "- Pulimos filtros, chips y estilos compartidos para que navegar se sienta mas consistente.",
    ].join("\n"),
    "es-US": [
      `Novedades de ${versionName}`,
      "",
      "- Refinamos espaciados y balance visual en home, favoritos y detalle de alojamiento.",
      "- Mejoramos fondos, headers y comportamiento de safe area para una vista mobile mas prolija.",
      "- Pulimos filtros, chips y estilos compartidos para que navegar se sienta mas consistente.",
    ].join("\n"),
  };

  const notes = notesByLocale[locale];

  if (!notes) {
    throw new Error(`Unsupported locale for release notes: ${locale}`);
  }

  if (notes.length > maxLength) {
    throw new Error(
      `Release notes exceed ${maxLength} characters for ${locale}`,
    );
  }

  return notes;
}
