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

// Writes the registry back whole, so the leading _comment survives.
async function writeVenues(registry) {
  await writeFile(VENUES_PATH, `${JSON.stringify(registry, undefined, 2)}\n`);
}

export async function fetchVenueList(id) {
  const html = await fetchText(`https://letterboxd.com/${MEMBER}/list/${id}/`);

  return {
    films: new Set(
      [...html.matchAll(/data-item-slug="([^"]+)"/g)].map((match) => match[1]),
    ),
    site: findListSite(html),
  };
}

// Each list's description ends with the cinema's own address, which Letterboxd
// renders as "About this list: www.example.com/whatever". That is where the
// site links in the registry came from when they were typed in by hand, so
// read them from there instead. The address is written without a scheme.
function findListSite(html) {
  const description = html.match(
    /<meta name="description" content="([^"]*)"/,
  )?.[1];
  const site = decodeEntities(description ?? "").match(
    /About this list:\s*(\S+)/,
  )?.[1];

  if (!site) return undefined;
  return /^https?:\/\//.test(site) ? site : `https://${site}`;
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
    await writeVenues(registry);
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
  const registry = await syncVenueRegistry(discovered ?? []);
  const { venues } = registry;
  if (venues.length === 0) return entries;

  const byFilm = new Map();
  let learned = 0;

  for (const venue of venues) {
    let list;
    try {
      list = await fetchVenueList(venue.id);
    } catch (error) {
      console.warn(`  ! venue list ${venue.id} unavailable: ${error.message}`);
      continue;
    }

    // Fill in a site link the registry does not have yet, but never overwrite
    // one: a hand-corrected link is worth more than whatever the description
    // happens to say, and only the Clusterflick slug is left to set by hand.
    if (!venue.site && list.site) {
      venue.site = list.site;
      learned += 1;
      console.log(`  + site for ${venue.name}: ${list.site}`);
    }

    for (const film of list.films) {
      if (!byFilm.has(film)) byFilm.set(film, venue.id);
    }
  }

  if (learned > 0) await writeVenues(registry);

  return entries.map((entry) => {
    const venue = byFilm.get(entry.slug);
    return venue ? { ...entry, venue } : entry;
  });
}
