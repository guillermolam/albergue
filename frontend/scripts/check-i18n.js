#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 Checking i18n implementation...");

// Check if i18nStore exists
const i18nStorePath = path.join(__dirname, "../src/stores/i18nStore.ts");
if (fs.existsSync(i18nStorePath)) {
  console.log("✅ i18nStore.ts found");
} else {
  console.log("❌ i18nStore.ts not found");
}

// Check if LanguageSelectorIsland exists
const languageSelectorPath = path.join(
  __dirname,
  "../src/islands/shared/LanguageSelectorIsland.astro",
);
if (fs.existsSync(languageSelectorPath)) {
  console.log("✅ LanguageSelectorIsland.astro found");
} else {
  console.log("❌ LanguageSelectorIsland.astro not found");
}

// Check if locale files exist
const localesDir = path.join(__dirname, "../src/components/LanguageSelector/locales");
if (fs.existsSync(localesDir)) {
  console.log("✅ Locale directory found");

  // Count files
  const languages = [
    "es",
    "en",
    "fr",
    "de",
    "it",
    "pt",
    "nl",
    "pl",
    "ko",
    "ja",
    "zh",
    "ru",
    "cs",
    "sk",
    "hu",
    "ca",
    "eu",
    "gl",
    "oc",
    "Gode",
  ];

  let fileCount = 0;
  languages.forEach((lang) => {
    const langDir = path.join(localesDir, lang);
    if (fs.existsSync(langDir)) {
      const files = fs.readdirSync(langDir);
      fileCount += files.length;
    }
  });

  console.log(`📁 Total locale files: ${fileCount}`);
} else {
  console.log("❌ Locale directory not found");
}

console.log("✅ i18n implementation check completed");
