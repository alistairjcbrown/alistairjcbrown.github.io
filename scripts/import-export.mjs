#!/usr/bin/env node
// Seed the diary from a Letterboxd data export.
//
//   node scripts/import-export.mjs ~/Downloads/letterboxd-export/diary.csv
//
// The RSS feed only reaches back ~50 entries, so everything older than that
// window can only arrive this way. Run it once against a fresh export and the
// nightly feed top-up carries on from there; run it again any time and it will
// simply re-confirm what is already stored.

import { readFile } from "node:fs/promises";
import { readDiary, writeDiary, mergeEntries } from "./lib/diary.mjs";

const [path] = process.argv.slice(2);
if (!path) {
  console.error("Usage: node scripts/import-export.mjs <path-to-diary.csv>");
  process.exit(1);
}

// Letterboxd's export is well-formed CSV with quoted fields and doubled quotes
// for a literal one. Titles routinely contain commas, so a naive split is not
// enough.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (quoted) {
      if (char !== '"') field += char;
      else if (text[index + 1] === '"') ((field += '"'), (index += 1));
      else quoted = false;
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ",") (row.push(field), (field = ""));
    else if (char === "\n")
      (row.push(field), rows.push(row), (row = []), (field = ""));
    else if (char !== "\r") field += char;
  }
  if (field || row.length > 0) (row.push(field), rows.push(row));

  const [header, ...body] = rows.filter((entry) =>
    entry.some((cell) => cell !== ""),
  );
  return body.map((cells) =>
    Object.fromEntries(
      header.map((name, index) => [name.trim(), cells[index] ?? ""]),
    ),
  );
}

const rows = parseCsv(await readFile(path, "utf8"));
if (rows.length === 0) throw new Error(`No rows found in ${path}`);

const entries = rows
  .map((row) => {
    // diary.csv records both the day the entry was written ("Date") and the day
    // the film was actually seen ("Watched Date"). The screening is what the
    // timeline is about, so the watched date wins wherever it is present.
    const date = (row["Watched Date"] || row.Date || "").trim();
    const rating = Number.parseFloat(row.Rating);
    const year = Number.parseInt(row.Year, 10);

    return {
      date,
      title: row.Name?.trim(),
      year: Number.isFinite(year) ? year : undefined,
      slug: row["Letterboxd URI"]?.match(/\/film\/([^/]+)\/?/)?.[1],
      uri: row["Letterboxd URI"]?.trim() || undefined,
      rating: Number.isFinite(rating) ? rating : undefined,
      rewatch: row.Rewatch?.trim().toLowerCase() === "yes",
      tags: row.Tags?.trim() || undefined,
      source: "export",
    };
  })
  .filter((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.date) && entry.title);

const diary = await readDiary();
const before = diary.entries.length;
diary.entries = mergeEntries(diary.entries, entries);
await writeDiary(diary);

console.log(
  `Read ${rows.length} rows, imported ${entries.length} viewings; store now holds ${diary.entries.length} (+${diary.entries.length - before}).`,
);
console.log("Run `npm run enrich-diary` to fetch posters for the new entries.");
