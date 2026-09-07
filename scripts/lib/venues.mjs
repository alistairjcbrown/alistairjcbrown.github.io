// Venue labelling.
//
// Alistair keeps a Letterboxd list per cinema, and adding a film to one is how
// a screening gets its venue. A list carries no dates, so it can never say
// *when* something was seen - the diary does that. What it can do is name the
// venue for a film, joined on the film slug. That is a per-film answer, so it
// cannot tell two viewings of the same film apart; where a film sits in a venue
// list, every viewing of it inherits that venue.
//
// The lists are discovered from the RSS feed rather than hand-listed here.
// `/lists/page/2/` is behind the Cloudflare challenge, so scraping the lists
// page only ever finds the first twelve - which quietly lost eight cinemas and
// the screenings they label. The feed publishes every list as its own item, so
// it is both the complete answer and one we already fetch.

import { writeFile } from "node:fs/promises";
import { readJson, VENUES_PATH } from "./diary.mjs";
import { MEMBER, fetchText, decodeEntities } from "./letterboxd.mjs";

export async function readVenues() {
  return readJson(VENUES_PATH, { venues: [] });
}

export async function fetchVenueFilms(id) {
  const html = await fetchText(`https://letterboxd.com/${MEMBER}/list/${id}/`);
  return new Set(
    [...html.matchAll(/data-item-slug="([^"]+)"/g)].map((match) => match[1]),
  );
}

// Every list in the feed is a venue - that is what Alistair uses lists for. A
// list that is not a cinema would need excluding here, but inventing that
// distinction before there is one to draw would just be guessing at it.
export function parseVenueLists(xml) {
  return (xml.match(/<item>[\s\S]*?<\/item>/g) ?? [])
    .filter((item) => /<guid[^>]*>letterboxd-list/.test(item))
    .map((item) => ({
      id: item.match(/<link>[^<]*\/list\/([^/]+)\//)?.[1],
      // Titles arrive XML-escaped, so "Everyman King's Cross" reaches us as
      // "Everyman King&#039;s Cross" - which would be stored, and rendered,
      // exactly like that.
      name: decodeEntities(
        item.match(/<title>([^<]*)<\/title>/)?.[1] ?? "",
      ).trim(),
    }))
    .filter((venue) => venue.id && venue.name);
}

// New cinemas are added to the registry as they are discovered, keeping the
// name the feed gives them. Anything already recorded is left exactly as it is:
// the `clusterflick` and `site` links are hand-set and there is nothing in the
// feed that could reconstruct them.
export async function syncVenueRegistry(discovered) {
  const registry = await readVenues();
  const known = new Set(registry.venues.map((venue) => venue.id));
  const added = discovered.filter((venue) => !known.has(venue.id));

  if (added.length > 0) {
    registry.venues = [...registry.venues, ...added].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    await writeFile(VENUES_PATH, `${JSON.stringify(registry, undefined, 2)}\n`);
    for (const venue of added) {
      console.log(`  + new venue: ${venue.name} (${venue.id})`);
    }
  }

  return registry;
}

// Attaches a `venue` id to each entry whose film appears in a venue list. Never
// removes one: a list since tidied should not silently strip the venue off an
// old screening.
export async function attachVenues(entries, discovered) {
  const { venues } = await syncVenueRegistry(discovered ?? []);
  if (venues.length === 0) return entries;

  const byFilm = new Map();
  for (const venue of venues) {
    let films;
    try {
      films = await fetchVenueFilms(venue.id);
    } catch (error) {
      console.warn(`  ! venue list ${venue.id} unavailable: ${error.message}`);
      continue;
    }
    for (const film of films) if (!byFilm.has(film)) byFilm.set(film, venue.id);
  }

  return entries.map((entry) => {
    const venue = byFilm.get(entry.slug);
    return venue ? { ...entry, venue } : entry;
  });
}
