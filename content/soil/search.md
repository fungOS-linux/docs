# Global search

`soil:search` is a host-composed discovery surface over sources the host has
already granted. It is the connective layer for a Spotlight-like experience
across files, records, and later app actions.

```text
files        -> soil:index / soil:vfs
records      -> soil:records books
repositories -> explicit local Git roots
spores       -> explicit local Spore manifest roots
peers        -> explicit `mycelium peers --json` snapshot
services     -> explicit Mycelium/Unibus service catalog snapshot
actions      -> reserved for an explicit action registry
```

It is not authority. A hit is a locator plus display metadata. The caller
fetches the file through `soil:vfs` or the record through `soil:records`.

## Contract

```text
search(query)   -> page
state()         -> search-state
refresh()       -> search-state
```

A query carries `text`, `kinds`, `mode`, `offset`, and `limit`. A hit carries
`kind`, source-local `id`, `title`, `subtitle`, `snippet`, `score`, `source`,
and optional `updated-at-ms`.

Kinds are `file`, `record-entry`, `repository`, `spore`, `peer`, `service`,
and the reserved `action`. Modes are `substring`, `fuzzy`, `full-text`,
`semantic`, and `regex`.

## Host composition

`crates/soil-search-host` composes:

- the VFS SQLite/FTS5 index, including exact path promotion and optional
  semantic vectors
- substring search over an explicit allowlist of `fungos-records` books
- bounded Git discovery under host-granted roots, with credential-stripped origins
- local Spore manifests under host-granted roots
- a host-granted `mycelium peers --json` snapshot
- a host-granted Mycelium/Unibus service catalog snapshot
- optional Microsoft `tgrep` regex search over an explicit root or VFS mount

Results are merged by score and title, then paginated. `refresh` rebuilds the
VFS index and advances the generation.

The host supplies the roots, approved books, Spore roots, and discovery
snapshots. A Spore never chooses a path, book, provider, or source. Search
cannot widen access.

Discovery is opt-in. `SearchService::with_spore_roots` reads local `spore.toml`
manifests only. `with_mycelium_snapshot_dir` reads `peers.json` and
`services.json` exported by Mycelium; it never calls the daemon, opens a
network connection, or changes peer/service state. A service catalog may come
from `mycelium services --json` or an equivalent Unibus service inventory
snapshot.

## Browser inspector

`soil-search-web` is a read-only local UI over configured sources:

```sh
cargo run -p soil-search-host --bin soil-search-web -- \
  --vfs-root ~/.local/share/fungos/vfs \
  --records-root ~/.local/share/fungos/records \
  --book personal/avery/contacts \
  --spore-root ~/Documents/src/fungOS-linux/soil/spores \
  --mycelium-snapshot ~/.local/share/fungos/discovery
```

Open <http://127.0.0.1:8790/>. It exposes kind filters for files, records,
repositories, Spores, peers, services, and actions; modes include substring,
fuzzy, full-text, semantic, and regex. A source that was not granted simply
has no hits.

## What comes next

- a Canvas command-palette / finder surface over `soil:search`
- an explicit action source for app commands
- repository actions such as open, branch switch, and worktree creation
- record field filters and per-schema ranking
- cross-source semantic ranking with one embedding space
