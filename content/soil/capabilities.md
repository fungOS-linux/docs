# Capability contracts

Canonical WIT lives in [`soil/wit`](https://github.com/fungOS-linux/soil/tree/main/wit). `crates/soil-abi` embeds every source and asserts its package name, interface, and functions.

| Package | Grant | Status |
|---|---|---|
| `soil:canvas@1` | `soil:canvas` | WIT + input normalizer + S22/Android hosts |
| `soil:vfs@1` | `soil:vfs` | WIT + host adapter over `fungos-vfs` |
| `soil:index@1` | `soil:index` | WIT + derived path/text index |
| `soil:view@1` | `soil:view` | WIT + Viewer state machine |
| `soil:time@1` | `soil:time` | WIT |
| `soil:storage@1` | `soil:storage.read` / `.write` | WIT |
| `soil:appdata@1` | `soil:appdata` | WIT + guest SDK; host next |
| `soil:records@0.1` | `soil:records` | WIT + generic host + guest SDK |
| `soil:ble@1` | `soil:ble.*` | WIT + real host + COLMI ring Spore |
| `wasi:webgpu@0.3.0-rc.2` | upstream `wasi:webgpu` | host + compute/render fixtures |
| `wasi:audio@0.1.0` | link `wasi:audio` | draft WIT + cpal host |

## Private app storage

`soil:appdata` is separate from `soil:vfs` and `soil:storage`:

- `local` is device-only
- `synced` is per-app, per-user, encrypted, replicated
- not indexed, shareable, or cross-app referenceable
- quota-bounded
- opaque keys and bytes; no host paths or app ids

Use records for durable, searchable, shareable data. Use VFS/storage for large
assets.

## Records

`soil:records` is the structured, schema-tagged store for Spores:

```text
get(key)                               -> entry
scan(collection, cursor, limit)        -> page
upsert(entry)                          -> entry
delete(key)                            -> ()
changes(since, limit)                  -> page
apply(entries)                         -> apply-result
```

The host owns durability, revisions, tombstones, and merge. The Spore owns the
collection name, schema, and body encoding.

Current status:

- `soil-records-host` adapts one `fungos-records` book as one collection
- local `get` / `scan` / `upsert` / `delete` work
- `changes` / `apply` merge materialized entries with revision/origin LWW
- `soil-sdk-records` provides dynamic and typed guest books
- native `records.sync.*` over Unibus remains the peer-sync implementation
- semantic/records search and end-to-end encryption are not done

See [Records and PIM](#/records) for the native book model.

## Read-only filesystem

`soil:vfs`:

```text
ls(parent, offset, limit) -> page
stat(path)                -> entry
read(path, offset, length) -> chunk
```

The host canonicalizes workspace-relative paths, owns the provider choice, and bounds pages and ranges. `content-id` is the canonical `blake3:` identity, not a provider CID.

`soil:index`:

```text
browse(parent, order, offset, limit) -> page
search(query)                        -> page
state()                              -> index-state
refresh()                            -> index-state
```

Search modes are `substring`, `fuzzy`, `full-text`, and `semantic`. The first host adapter implements path/text substring, fuzzy path matching, and text-file full-text. Semantic search returns `unsupported` until an embedding backend exists.

## The file-browser shape

The browser is a Spore with an authoritative state machine. GUI, CLI, Lua, and agents dispatch the same transitions:

```text
query.set · sort.set · cursor.move · page.load
selection.add/remove/toggle/replace/clear
plan.preview · plan.approve · plan.execute
```

The GUI renders state. It does not receive synthetic clicks or raw OS events. A prompt can compile to an inspectable query/action plan, but execution remains a host capability with budgets and receipts.

## What is not in v1

- raw sockets, DNS, arbitrary HTTP
- filesystem paths or directory traversal
- raw keycodes or display enumeration
- process spawning
- per-frame Wasm callbacks
- secrets in Wasm memory
- a global application-specific package such as Isochrone

See [VFS and index](#/soil-vfs) and [Canvas and input](#/soil-canvas).
