#!/usr/bin/env node
// Fill in posters for entries that arrived without one.
//
// The RSS feed carries a poster URL; a CSV export does not. Film pages are one
// of the few Letterboxd routes not behind the Cloudflare challenge, so a
// poster can be resolved from there - once per film, cached in the store
// forever, because the answer never changes.
//
// Take it from the page's JSON-LD, not its og:image: og:image is the 1200x675
// landscape card built for social previews, which in a 2:3 poster frame is
// cropped to a strip of someone's face. The JSON-LD `image` is the real
// poster, in the same 600x900 form the RSS feed publishes.

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

// Letterboxd serves posters from two paths - /film-poster/ for its own
// artwork and /sm/upload/ for a member upload - and builds each film's social
// card from the same file, so the path says nothing either way. What separates
// them is the crop baked into the filename, which carries the region as
// x-width-y-height: a poster is `0-600-0-900` and portrait, the share card is
// `1200-1200-675-675` and landscape. So check the shape, not the path.
export function posterCrop(url = "") {
  const crop = url.match(/-(\d+)-(\d+)-(\d+)-(\d+)-crop/);
  if (!crop) return undefined;

  const [, , width, , height] = crop.map(Number);
  return height > width ? { width, height } : undefined;
}

export const isPoster = (url) => posterCrop(url) !== undefined;

// The RSS feed sometimes carries a 230px-wide thumbnail where the film page
// publishes the full 600x900. At two device pixels per CSS pixel the small one
// is visibly soft in a 140px frame, so it is re-resolved rather than kept.
const MIN_POSTER_WIDTH = 600;

const needsPoster = (entry) =>
  (posterCrop(entry.poster)?.width ?? 0) < MIN_POSTER_WIDTH;

function findPoster(html) {
  const block = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  )?.[1];

  try {
    const image = JSON.parse(
      block
        .replace(/\/\* <!\[CDATA\[ \*\//, "")
        .replace(/\/\* \]\]> \*\//, "")
        .trim(),
    ).image;
    if (isPoster(image)) return image;
  } catch {
    // No JSON-LD, or not the shape we expect - fall through.
  }

  // og:image is a last resort and only if it happens to be a poster; a share
  // card here is worse than no image, since the page has a placeholder for
  // that and no way to tell a bad crop from a good one.
  const fallback = html.match(
    /<meta property="og:image" content="([^"]+)"/,
  )?.[1];
  return isPoster(fallback) ? decodeEntities(fallback) : undefined;
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

    const poster = findPoster(html);
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

// Anything that is not a real poster, or is too small to render crisply, is
// re-resolved - which also lets a store filled in by an earlier, wronger
// version of this script heal itself.
const pending = diary.entries.filter(needsPoster);
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
