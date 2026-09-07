// The committed diary store, and the challenge-year arithmetic the page needs.

import { readFile, writeFile } from "node:fs/promises";

export const DIARY_PATH = new URL("../../src/data/diary.json", import.meta.url);
export const VENUES_PATH = new URL(
  "../../src/data/venues.json",
  import.meta.url,
);

// Alistair moved to London on 27 August 2024 and set the challenge that day, so
// a challenge year runs from one anniversary of that date to the day before the
// next. Everything on the page - the year tabs, the counts, the pace - hangs
// off this one date.
export const CHALLENGE_START = "2024-08-27";
export const CHALLENGE_TARGET = 52;

export async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

export async function readDiary() {
  return readJson(DIARY_PATH, { entries: [] });
}

export async function writeDiary(diary) {
  const entries = [...diary.entries].sort(compareEntries);
  await writeFile(
    DIARY_PATH,
    `${JSON.stringify({ ...diary, entries }, undefined, 2)}\n`,
  );
}

// Newest first, and stable for two films on the same day: the key keeps the
// order identical between builds, so a rebuild that changes nothing produces
// no diff.
function compareEntries(a, b) {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1;
  return entryKey(a).localeCompare(entryKey(b));
}

// The two sources identify a viewing differently - the RSS feed by its
// `letterboxd-watch-NNN` guid, the CSV export not at all - so neither can be
// the store's key without the history and the feed double-counting the same
// screening. What both always carry is the watched date and the film, and
// Letterboxd hands out the same title string to both, so that pair is the
// natural key. Two viewings of one film on one day collapse into one entry;
// that is a rounding error against counting every screening twice.
export function entryKey(entry) {
  return `${entry.date}|${normaliseTitle(entry.title)}`;
}

function normaliseTitle(title = "") {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Incoming entries win on every field they actually carry, so a re-import can
// correct a title or add a poster, but a field the source does not know about
// (a poster the RSS feed had and the CSV export does not) is never wiped.
export function mergeEntries(existing, incoming) {
  const byKey = new Map(existing.map((entry) => [entryKey(entry), entry]));

  for (const entry of incoming) {
    const key = entryKey(entry);
    const merged = { ...(byKey.get(key) ?? {}) };
    for (const [field, value] of Object.entries(entry)) {
      if (value !== undefined && value !== null && value !== "") {
        merged[field] = value;
      }
    }
    byKey.set(key, merged);
  }

  return [...byKey.values()].sort(compareEntries);
}

function addYears(iso, count) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${String(year + count).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Which challenge year a date falls in: 0 is the first year, 1 the second, and
// so on. Dates before the challenge started come back as -1.
export function challengeYearIndex(date) {
  let index = -1;
  while (date >= addYears(CHALLENGE_START, index + 1)) {
    index += 1;
    if (index > 100) break; // guard against a malformed date looping forever
  }
  return date >= CHALLENGE_START ? index : -1;
}

export function challengeYears(entries, today) {
  const currentIndex = challengeYearIndex(today);
  const years = [];

  for (let index = 0; index <= Math.max(currentIndex, 0); index += 1) {
    const start = addYears(CHALLENGE_START, index);
    const end = addYears(CHALLENGE_START, index + 1);
    years.push({
      index,
      start,
      end,
      label: `${start.slice(0, 4)}–${end.slice(2, 4)}`,
      current: index === currentIndex,
      entries: entries.filter(
        (entry) => entry.date >= start && entry.date < end,
      ),
    });
  }

  return years.reverse();
}

// How far through the challenge year today is, as a count of films you would
// need by now to be exactly on a 52-a-year pace.
export function paceFor(year, today) {
  const days = Math.round(
    (Date.parse(`${year.end}T00:00:00Z`) -
      Date.parse(`${year.start}T00:00:00Z`)) /
      86400000,
  );
  const elapsed = Math.min(
    days,
    Math.max(
      0,
      Math.round(
        (Date.parse(`${today}T00:00:00Z`) -
          Date.parse(`${year.start}T00:00:00Z`)) /
          86400000,
      ),
    ),
  );
  return {
    days,
    elapsed,
    week: Math.floor(elapsed / 7) + 1,
    expected: (CHALLENGE_TARGET * elapsed) / days,
  };
}
