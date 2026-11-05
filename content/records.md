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

## Boundaries

- one home book per record
- no cross-book links yet
- no team/company grants yet
- no share projections or tickets yet
- no encryption or device key wrapping yet; Unibus frames are authenticated but not E2EE
- no CardDAV yet
- no calendar yet

The design and the book/ticket boundary are in
[the records repository](https://github.com/fungOS-linux/records).
