# Records and PIM

`fungos-records` is the first local-first PIM core. The current slice imports the
macOS address book, stores namespaced contact records, keeps a per-device op log,
and syncs between devices.

**Status:** working first slice. SSH is the current transport; Unibus and
encryption are next.

## Current shape

```text
SQLite projection   fast local list/search
per-device op log   durable, idempotent sync
book                ownership boundary
schema              namespaced record meaning
transport           SSH today, Unibus next
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

## Sync

```sh
records --root ~/.local/share/fungos/records sync \
  --book personal/avery/contacts \
  --ssh studio
```

Each side publishes a vector, then pulls and pushes missing ops. `op_id` is a
BLAKE3 digest, and `(book_id, device_id, seq)` is unique, so re-delivery is a
no-op.

## What is live

- 591 imported contact ops
- 589 unique contact records after collapsing duplicate cards
- MacBook ↔ studio ↔ agora-one sync verified
- bidirectional temp-book sync verified

## Boundaries

- one home book per record
- no cross-book links yet
- no team/company grants yet
- no share projections or tickets yet
- no encryption or device key wrapping yet
- no CardDAV yet
- no calendar yet

The design and the book/ticket boundary are in
[the records repository](https://github.com/fungOS-linux/records).
