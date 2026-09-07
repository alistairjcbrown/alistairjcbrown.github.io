# AlistairJCBrown.com

Code running http://www.alistairjcbrown.com

### Build

```
npm run build
```

Generates the cinema page and builds everything into `./docs`, which is what
GitHub Pages serves. `npm run dev` does the same behind Parcel's dev server.

### Serve

```
python3 -m http.server --directory ./docs
```

### Format

```
npm run format
```

## The cinema timeline

`/cinema/` is a chronological ribbon of every film seen in a cinema since
moving to London on 27 August 2024, against a challenge of 52 a year. A
challenge year runs from one anniversary of that date to the next; the page
opens on the current one and the tabs switch between them.

### Where the data comes from

Letterboxd puts a Cloudflare JS challenge in front of the diary and every
paginated route, so the diary cannot be scraped. Two routes stay open, and the
pipeline is built on those:

| Source                         | Gives                                            |
| ------------------------------ | ------------------------------------------------ |
| The member RSS feed            | The ~50 most recent viewings, with posters       |
| `letterboxd.com/film/<slug>/`  | A poster for anything the feed no longer carries |
| One Letterboxd list per cinema | Which venue a film was seen at                   |

`src/data/diary.json` is the store, and it is the source of truth — the scripts
only ever add to it. Because the feed is a rolling window, anything older than
~50 entries can only arrive from a Letterboxd data export.

### Commands

```
npm run fetch-diary                       # merge new viewings from the RSS feed
npm run import-export -- path/to/diary.csv  # seed history from a Letterboxd export
npm run enrich-diary                      # resolve posters for entries without one
npm run build-page                        # regenerate src/cinema/index.html
```

`src/cinema/index.html` is generated and git-ignored; edit
`src/templates/cinema.template.html` instead.

### Backfilling the first two years

The RSS window only reaches back so far, so years one and two need a one-off
import:

1. Letterboxd → Settings → Data → **Export your data**.
2. `npm run import-export -- ~/Downloads/letterboxd-.../diary.csv`
3. `npm run enrich-diary` to fetch posters for everything new.
4. Commit the updated `src/data/diary.json`.

Entries are keyed on watched date plus film title, so re-importing is safe and
an imported entry and the same viewing from the feed collapse into one.

### Venues

`src/data/venues.json` maps a Letterboxd list slug to a display name and,
where there is one, the venue's page on [Clusterflick](https://clusterflick.com).
Add a cinema by adding its list slug there. A list carries no dates, so this
only ever labels a viewing the diary already knows about — it never decides
whether something counts.

### Automation

`.github/workflows/update-cinema.yml` runs nightly, tops the store up from the
feed, rebuilds and commits. Nightly is far more often than the feed window
needs, so nothing is ever missed.
