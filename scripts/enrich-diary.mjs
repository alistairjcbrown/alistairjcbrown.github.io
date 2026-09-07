#!/usr/bin/env node
// Fill in posters for entries that arrived without one.
//
// The RSS feed carries a poster URL; a CSV export does not. Film pages are one
// of the few Letterboxd routes not behind the Cloudflare challenge, so a
// poster can be resolved from there - once per film, cached in the store
// forever, because the answer never changes.

import { readDiary, writeDiary } from "./lib/diary.mjs";
import {
  fetchText,
  decodeEntities,
  resolveSlugFromUri,
} from "./lib/letterboxd.mjs";

// Letterboxd's slugs follow conventions that only show up when they bite:
// `&` is dropped rather than spelled out (Batman & Robin is `batman-robin`,
// while `batman-and-robin` is the 1949 serial), and periods vanish without
// leaving a separator (`Doctor Butcher M.D.` is `doctor-butcher-md`, not
// `...-m-d`). Neither rule is universal, so try each reading rather than
// picking one, and let the year check in resolveFilm decide between them.
function slugify(title, { ampersand, periods }) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, ampersand === "and" ? " and " : " ")
    .replace(/\./g, periods === "strip" ? "" : " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function slugCandidates(entry) {
  if (entry.slug) return [entry.slug];

  const readings = [
    { ampersand: "and", periods: "separate" },
    { ampersand: "drop", periods: "separate" },
    { ampersand: "and", periods: "strip" },
    { ampersand: "drop", periods: "strip" },
  ].map((options) => slugify(entry.title, options));

  // Letterboxd disambiguates a reused title by appending the year, so every
  // reading is worth trying bare first and year-suffixed second.
  const candidates = [
    ...readings,
    ...(entry.year ? readings.map((slug) => `${slug}-${entry.year}`) : []),
  ];

  return [...new Set(candidates)];
}

async function resolveFilm(entry) {
  // The export's own link is exact, so it is tried ahead of any reading of the
  // title; the readings are the fallback for an entry that arrived without one.
  const fromUri = await resolveSlugFromUri(entry.uri);

  for (const slug of fromUri ? [fromUri] : slugCandidates(entry)) {
    let html;
    try {
      html = await fetchText(`https://letterboxd.com/film/${slug}/`);
    } catch {
      continue; // a 404 just means this was the wrong guess
    }

    const poster = html.match(
      /<meta property="og:image" content="([^"]+)"/,
    )?.[1];
    if (!poster) continue;

    // A bare slug can land on the wrong film of the same name - `childs-play`
    // is the 1988 one, and Letterboxd hands the 2019 remake a different slug.
    // The page states its year in the og:title ("Child's Play (1988)"), so
    // check it rather than trusting the first page that answers.
    const found = Number(
      decodeEntities(
        html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] ?? "",
      ).match(/\((\d{4})\)\s*$/)?.[1],
    );
    if (entry.year && found && Math.abs(found - entry.year) > 1) continue;

    const tmdbId = html.match(/themoviedb\.org\/movie\/(\d+)/)?.[1];
    return {
      slug,
      poster: decodeEntities(poster),
      tmdbId: tmdbId ? Number(tmdbId) : undefined,
    };
  }
  return undefined;
}

const diary = await readDiary();
const pending = diary.entries.filter((entry) => !entry.poster);
console.log(
  `${pending.length} of ${diary.entries.length} entries need a poster.`,
);

let resolved = 0;
for (const entry of pending) {
  const film = await resolveFilm(entry);
  if (!film) {
    console.warn(`  ! could not resolve ${entry.title} (${entry.year ?? "?"})`);
    continue;
  }
  Object.assign(entry, film, {
    uri: entry.uri ?? `https://letterboxd.com/film/${film.slug}/`,
  });
  resolved += 1;
  console.log(`  + ${entry.title} -> ${film.slug}`);
}

if (resolved > 0) await writeDiary(diary);
console.log(`Resolved ${resolved} poster${resolved === 1 ? "" : "s"}.`);
