// Venue labelling.
//
// Alistair keeps a Letterboxd list per cinema. A list carries no dates, so it
// can never say *when* something was seen - the diary does that. What it can do
// is name the venue for a film, joined on the film slug. That is a per-film
// answer, so it cannot tell two viewings of the same film apart; where a film
// sits in a venue list, every viewing of it inherits that venue. Labels are
// decoration on the timeline, never a filter, so a wrong one costs a line of
// text rather than a missing screening.

import { readJson, VENUES_PATH } from "./diary.mjs";
import { MEMBER, fetchText } from "./letterboxd.mjs";

export async function readVenues() {
  return readJson(VENUES_PATH, { venues: [] });
}

export async function fetchVenueFilms(slug) {
  const html = await fetchText(
    `https://letterboxd.com/${MEMBER}/list/${slug}/`,
  );
  return new Set(
    [...html.matchAll(/data-item-slug="([^"]+)"/g)].map((match) => match[1]),
  );
}

// Attaches a `venue` slug to each entry whose film appears in a venue list.
// Never removes one: a list Alistair has since tidied should not silently strip
// the venue off an old screening.
export async function attachVenues(entries) {
  const { venues } = await readVenues();
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
