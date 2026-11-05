# Records and PIM

`fungos-records` is the first local-first PIM core. The current slice imports the
macOS address book, stores namespaced contact records, keeps a per-device op log,
and syncs between devices.

**Status:** working first slice. Unibus is the primary transport; SSH remains a
bootstrap/fallback. Encryption and device key wrapping are next.

## Current shape

```text
SQLite projection   fast local list/search
per-device op log   durable, idempotent sync
book                ownership boundary
schema              namespaced record meaning
transport           Unibus provider, SSH fallback
```

```text
book:    personal/avery/contacts
schema:  fungos.contacts/contact
version: 1
```

## Import the macOS address book

```sh
swift scripts/export-macos-contacts.swift > /tmp/contacts.vcf

records --root ~/.local/share/fungos/records init
records --root ~/.local/share/fungos/records import-vcf \
  --book personal/avery/contacts \
  /tmp/contacts.vcf
```

## RSS and Atom

Feed ingest is host-side, because a Spore has no ambient network capability:

```sh
records --root ~/.local/share/fungos/records import-rss \
  --book personal/avery/feeds \
  --feed https://blog.rust-lang.org/feed.xml

records --root ~/.local/share/fungos/records sync-feeds \
  --config ~/.config/fungos/feeds.toml
```

```toml
default_book = "personal/avery/feeds"

[[feeds]]
url = "https://blog.rust-lang.org/feed.xml"
title = "Rust Blog"
limit = 100
```

Items use `fungos.feeds/item@1` with title, link, summary, content, authors,
categories, published/updated timestamps, feed title, feed URL, and a stable
UID. They are ordinary records: sync, `soil:records`, and `soil:search` work
unchanged. The feed list is host config and can live in a dotfiles repo. A
reader Spore should use `soil:records` for items and `soil:appdata` for its
private settings; fetching stays in the host or a future explicit network
capability.

## Calendar import

```sh
records --root ~/.local/share/fungos/records import-ics \
  --book personal/avery/calendar \
  /tmp/calendar.ics

records --root ~/.local/share/fungos/records export-ics \
  --book personal/avery/calendar --output /tmp/calendar-out.ics
```

Events use schema `fungos.calendar/event@1`. The stored body includes the raw
VEVENT and referenced VTIMEZONE blocks plus summary, description, location,
start/end, all-day, organizer, attendees, categories, status, and RRULE. The
first slice preserves recurrence rules but does not expand instances or resolve
timezone transitions for presentation yet.

## Unibus sync

Providers run on studio and agora-one:

```sh
records --root ~/.local/share/fungos/records serve \
  --config ~/.config/unibus/records-studio.json
```

A device syncs:

```sh
records --root ~/.local/share/fungos/records unibus-sync \
  --book personal/avery/contacts \
  --config ~/.config/unibus/records-macbook.json \
  --peer records.studio
```

Protocol kinds:

```text
records.sync.pull.v1
records.sync.ops.v1
records.sync.push.v1
records.sync.ack.v1
records.sync.error.v1
```

Each side publishes a vector, then pulls and pushes missing ops. `op_id` is a
BLAKE3 digest, and `(book_id, device_id, seq)` is unique, so re-delivery is a
no-op. SSH sync remains available as a fallback.

## What is live

- 591 imported contact ops
- 589 unique contact records after collapsing duplicate cards
- MacBook ↔ studio ↔ agora-one sync verified over SSH and Unibus
- bidirectional Unibus temp-book transfer verified

## Soil access

A contacts Spore can use `soil:records` through `soil-sdk-records`:

```rust
use soil_sdk::records::{Book, Record, TypedBook};

let contacts = Book::new("contact");
let page = contacts.scan(None, 50)?;
```

The host adapter `soil-records-host` maps one book to one collection. It supports
`get`, `scan`, `upsert`, `delete`, `changes`, and revision/origin `apply`, with
opt-in schema and contact-body validation. Native `records.sync.*` remains the
peer transport.

## Boundaries

- one home book per record
- no cross-book links yet
- no team/company grants yet
- no share projections or tickets yet
- no encryption or device key wrapping yet; Unibus frames are authenticated but not E2EE
- no CardDAV yet
- calendar import/export is a first slice; recurrence expansion and timezone-aware display are not done yet

The design and the book/ticket boundary are in
[the records repository](https://github.com/fungOS-linux/records).

## Browser inspector

`soil-records-web` serves a read-only contact list and detail view through the
`soil:records` host adapter:

```sh
cargo run -p soil-records-host --bin soil-records-web -- \
  --book personal/avery/contacts --collection contact
```

Open <http://127.0.0.1:8787/>. It supports search, labels, raw vCard detail,
revision/origin metadata, and `.vcf` export. It is an inspection tool over the
same book the sync providers use, not a new store.

Point it at a calendar book with the event schema to render the calendar view:

```sh
cargo run -p soil-records-host --bin soil-records-web -- \
  --book personal/avery/calendar \
  --collection event \
  --schema fungos.calendar/event \
  --listen 127.0.0.1:8789
```

The calendar view shows date chips, event detail, attendees, recurrence, raw
VEVENT preview, and `.ics` export.
