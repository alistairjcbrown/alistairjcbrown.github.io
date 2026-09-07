// Shared helpers for reading Alistair's Letterboxd data.
//
// Letterboxd puts a Cloudflare JS challenge on the diary and on every paginated
// route, so the diary itself cannot be scraped from CI. What stays reachable is
// the member RSS feed (a rolling window of recent activity) and individual film
// pages. The feed is therefore the only automated source of new entries, and
// anything older than the window has to arrive once via a Letterboxd data
// export - see scripts/import-export.mjs.

export const MEMBER = "alistairjcbrown";
export const RSS_URL = `https://letterboxd.com/${MEMBER}/rss/`;

const USER_AGENT =
  "alistairjcbrown.com diary build (+https://www.alistairjcbrown.com)";

const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

export function decodeEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(parseInt(code, 16)),
    )
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name] ?? match);
}

// Letterboxd is behind Cloudflare and will occasionally drop a connection or
// answer 5xx under load. A personal-site build that fails on one flaky request
// is worse than one that waits a moment, so every fetch retries with jittered
// backoff. A 4xx is a permanent answer and is never retried.
export async function fetchText(url, { attempts = 4, timeout = 20000 } = {}) {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (attempt > 0) {
      const backoff = 500 * 2 ** (attempt - 1);
      await new Promise((resolve) =>
        setTimeout(resolve, backoff + Math.random() * backoff),
      );
    }

    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(timeout),
        headers: {
          "User-Agent": USER_AGENT,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-GB,en;q=0.9",
        },
      });

      if (response.status >= 400 && response.status < 500) {
        throw Object.assign(new Error(`${url} responded ${response.status}`), {
          permanent: true,
        });
      }
      if (!response.ok) throw new Error(`${url} responded ${response.status}`);

      // Read the body inside the retried attempt: a connection dropped
      // mid-stream is exactly the case worth retrying, and it happens after
      // the headers have already arrived.
      return await response.text();
    } catch (error) {
      if (error.permanent) throw error;
      lastError = error;
    }
  }

  throw new Error(`Failed to fetch ${url}: ${lastError?.message}`);
}

function tag(block, name) {
  const match = block.match(
    new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"),
  );
  return match ? decodeEntities(match[1].trim()) : undefined;
}

// The feed mixes diary entries (guid `letterboxd-watch-*`) with published lists
// (`letterboxd-list-*`). Only the former are viewings.
export function parseDiaryFeed(xml) {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  return items
    .map((item) => {
      const letterboxdId = tag(item, "guid");
      if (!letterboxdId?.includes("letterboxd-watch")) return undefined;

      const uri = tag(item, "link");
      const rating = tag(item, "letterboxd:memberRating");
      const year = tag(item, "letterboxd:filmYear");
      const tmdbId = tag(item, "tmdb:movieId");
      const description = item.match(/<description>([\s\S]*?)<\/description>/i);
      const poster = description?.[1].match(/<img src="([^"]+)"/)?.[1];

      return {
        letterboxdId,
        date: tag(item, "letterboxd:watchedDate"),
        title: tag(item, "letterboxd:filmTitle"),
        year: year ? Number(year) : undefined,
        slug: uri?.match(/\/film\/([^/]+)\//)?.[1],
        uri,
        rating: rating ? Number(rating) : undefined,
        rewatch: tag(item, "letterboxd:rewatch") === "Yes",
        liked: tag(item, "letterboxd:memberLike") === "Yes",
        tmdbId: tmdbId ? Number(tmdbId) : undefined,
        poster: poster ? decodeEntities(poster) : undefined,
      };
    })
    .filter((entry) => entry?.date && entry.slug);
}
