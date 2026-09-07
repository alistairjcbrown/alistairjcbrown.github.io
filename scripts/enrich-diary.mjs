#!/usr/bin/env node
// Fill in posters for entries that arrived without one.
//
// The RSS feed carries a poster URL; a CSV export does not. Film pages are one
// of the few Letterboxd routes not behind the Cloudflare challenge, so a
// poster can be resolved from there - once per film, cached in the store
// forever, because the answer never changes.

import { readDiary, writeDiary } from "./lib/diary.mjs";
import { fetchText, decodeEntities } from "./lib/letterboxd.mjs";

function slugCandidates(entry) {
  const base = entry.title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Letterboxd disambiguates a reused title by appending the year, so try the
  // bare slug first and the year-suffixed one second.
  return entry.slug
    ? [entry.slug]
    : [base, entry.year && `${base}-${entry.year}`].filter(Boolean);
}

async function resolveFilm(entry) {
  for (const slug of slugCandidates(entry)) {
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
