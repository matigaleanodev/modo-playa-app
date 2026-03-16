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
      "- Explore each destination with clearer points of interest and quicker access to key spots.",
      "- Favorites now stay more reliable, so saved places feel more consistent when you come back.",
      "- We also refined shared app styles to keep browsing lighter, smoother, and more polished.",
    ].join("\n"),
    "es-419": [
      `Novedades de ${versionName}`,
      "",
      "- Ahora podes explorar cada destino con puntos de interes mas claros y acceso rapido a lugares clave.",
      "- Los favoritos se mantienen mas confiables para que tus lugares guardados se sientan consistentes al volver.",
      "- Tambien ajustamos estilos compartidos para que navegar se sienta mas liviano, fluido y prolijo.",
    ].join("\n"),
    "es-US": [
      `Novedades de ${versionName}`,
      "",
      "- Ahora podes explorar cada destino con puntos de interes mas claros y acceso rapido a lugares clave.",
      "- Los favoritos se mantienen mas confiables para que tus lugares guardados se sientan consistentes al volver.",
      "- Tambien ajustamos estilos compartidos para que navegar se sienta mas liviano, fluido y prolijo.",
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
