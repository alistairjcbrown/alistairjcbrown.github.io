#!/usr/bin/env node
// Top the committed diary up from the Letterboxd RSS feed.
//
// The feed is a rolling window of the ~50 most recent entries, so this is
// append-only in practice: run it often enough and nothing is ever missed, but
// it can never reach back past the window. The store is the source of truth
// and is only ever added to.

import { readDiary, writeDiary, mergeEntries } from "./lib/diary.mjs";
import { RSS_URL, fetchText, parseDiaryFeed } from "./lib/letterboxd.mjs";
import { attachVenues, parseVenueLists } from "./lib/venues.mjs";

const diary = await readDiary();
const before = diary.entries.length;

const feed = await fetchText(RSS_URL);
const entries = parseDiaryFeed(feed);
if (entries.length === 0) {
  // An empty parse means the feed shape changed under us. Overwriting a good
  // store with nothing would be silent data loss, so stop instead.
  throw new Error(
    "Parsed no diary entries from the RSS feed - has it changed?",
  );
}

// The same feed publishes every venue list, so a cinema added on Letterboxd
// turns up here without anyone editing the registry.
const previous = JSON.stringify(diary.entries);
diary.entries = await attachVenues(
  mergeEntries(diary.entries, entries),
  parseVenueLists(feed),
);

// `updated` only moves when something actually changed. Stamping it every run
// would rewrite the file on a day with no new films, and since the workflow
// commits whatever the build touches, that is a commit a day forever saying
// nothing. It is the date of the last new screening, not of the last run.
const changed = JSON.stringify(diary.entries) !== previous;
if (changed) diary.updated = new Date().toISOString().slice(0, 10);
await writeDiary(diary);

const added = diary.entries.length - before;
console.log(
  changed
    ? `Feed carried ${entries.length} entries; store now holds ${diary.entries.length} (+${added}).`
    : `Feed carried ${entries.length} entries; nothing new.`,
);
