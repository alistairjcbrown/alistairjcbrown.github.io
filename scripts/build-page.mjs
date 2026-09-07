#!/usr/bin/env node
// Render src/cinema.html from the committed diary.
//
// The page is generated ahead of Parcel rather than fetched in the browser:
// the whole point of a static site is that the timeline is in the HTML, so it
// reads without JavaScript and search engines can see it. The only script on
// the page switches between challenge years.

import { mkdir, writeFile, readFile } from "node:fs/promises";
import {
  readDiary,
  challengeYears,
  paceFor,
  CHALLENGE_TARGET,
  CHALLENGE_START,
} from "./lib/diary.mjs";
import { readVenues } from "./lib/venues.mjs";

const TEMPLATE = new URL(
  "../src/templates/cinema.template.html",
  import.meta.url,
);
const OUTPUT = new URL("../src/cinema/index.html", import.meta.url);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const escape = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

// Half-star ratings are the whole point of a Letterboxd rating, so render them
// as Letterboxd does rather than rounding to a whole star.
function stars(rating) {
  if (!rating) return "";
  const full = "★".repeat(Math.floor(rating));
  return `${full}${rating % 1 ? "½" : ""}`;
}

function formatDay(date) {
  const [, month, day] = date.split("-").map(Number);
  return `${day} ${MONTHS[month - 1].slice(0, 3)}`;
}

function groupByMonth(entries) {
  const months = [];
  for (const entry of entries) {
    const key = entry.date.slice(0, 7);
    if (months.at(-1)?.key !== key) {
      const [year, month] = key.split("-").map(Number);
      months.push({ key, label: `${MONTHS[month - 1]} ${year}`, entries: [] });
    }
    months.at(-1).entries.push(entry);
  }
  return months;
}

function renderEntry(entry, venues) {
  const venue = venues.get(entry.venue);
  const rating = stars(entry.rating);

  return `
            <li class="film">
              <a class="film-link" href="${escape(entry.uri ?? `https://letterboxd.com/film/${entry.slug}/`)}">
                <span class="film-poster">${
                  entry.poster
                    ? `<img src="${escape(entry.poster)}" alt="" loading="lazy" decoding="async" width="140" height="210" />`
                    : `<span class="film-poster-missing" aria-hidden="true">🎬</span>`
                }</span>
                <span class="film-detail">
                  <span class="film-date">${escape(formatDay(entry.date))}</span>
                  <span class="film-title">${escape(entry.title)}</span>
                  <span class="film-meta">${entry.year ? `<span class="film-year">${entry.year}</span>` : ""}${
                    rating
                      ? `<span class="film-rating" title="${entry.rating} out of 5">${rating}</span>`
                      : ""
                  }${entry.liked ? `<span class="film-liked" title="Liked">♥</span>` : ""}${
                    entry.rewatch
                      ? `<span class="film-rewatch" title="Rewatch">↻</span>`
                      : ""
                  }</span>
                </span>
              </a>
              ${
                venue
                  ? `<p class="film-venue">${
                      venue.clusterflick
                        ? `<a href="https://clusterflick.com/venues/${escape(venue.clusterflick)}/">${escape(venue.name)}</a>`
                        : escape(venue.name)
                    }</p>`
                  : ""
              }
            </li>`;
}

function renderYear(year, venues, today) {
  const count = year.entries.length;
  const pace = paceFor(year, today);

  // A finished year states its total; the year in progress states where it is
  // against a 52-a-year pace, which is the only number that can still change.
  const standing = year.current
    ? `Week ${pace.week} · ${count === 0 ? "none yet" : `${count} so far`}${
        count > 0 ? ` · ${describePace(count - pace.expected)}` : ""
      }`
    : `${count >= CHALLENGE_TARGET ? "Challenge met" : `${CHALLENGE_TARGET - count} short`}`;

  const months = groupByMonth(year.entries)
    .map(
      (month) => `
        <section class="month">
          <h3 class="month-label"><span>${escape(month.label)}</span></h3>
          <ul class="films">${month.entries.map((entry) => renderEntry(entry, venues)).join("")}
          </ul>
        </section>`,
    )
    .join("");

  return `
      <section class="year" id="year-${year.index}" data-year="${year.index}"${year.current ? "" : " hidden"}>
        <p class="year-standing">
          <span class="year-count"><strong>${count}</strong> of ${CHALLENGE_TARGET}</span>
          <span class="year-note">${escape(standing)}</span>
        </p>
        ${
          count === 0
            ? `<p class="year-empty">Nothing logged for this year yet.</p>`
            : months
        }
      </section>`;
}

function describePace(difference) {
  const rounded = Math.round(difference);
  if (rounded === 0) return "bang on pace";
  return rounded > 0
    ? `${rounded} ahead of pace`
    : `${Math.abs(rounded)} behind pace`;
}

const today = process.env.TODAY ?? new Date().toISOString().slice(0, 10);
const diary = await readDiary();
const { venues } = await readVenues();
const venueMap = new Map(venues.map((venue) => [venue.id, venue]));

const entries = diary.entries.filter((entry) => entry.date >= CHALLENGE_START);
const years = challengeYears(entries, today);

const tabs = years
  .map(
    (year) => `
          <button type="button" class="year-tab${year.current ? " is-selected" : ""}" role="tab" aria-selected="${year.current}" aria-controls="year-${year.index}" data-year="${year.index}">
            ${escape(year.label)}${year.current ? '<span class="year-tab-now">now</span>' : ""}
          </button>`,
  )
  .join("");

const total = entries.length;
const html = (await readFile(TEMPLATE, "utf8"))
  .replace("{{TABS}}", tabs)
  .replace(
    "{{YEARS}}",
    years.map((year) => renderYear(year, venueMap, today)).join(""),
  )
  .replace(/{{TOTAL}}/g, String(total))
  .replace(/{{UPDATED}}/g, escape(diary.updated ?? today));

await mkdir(new URL("../src/cinema/", import.meta.url), { recursive: true });
await writeFile(OUTPUT, html);
console.log(
  `Wrote src/cinema.html — ${total} screenings across ${years.length} year(s).`,
);
