# Global search

`soil:search` is a host-composed discovery surface over sources the host has
already granted. It is the connective layer for a Spotlight-like experience
across files, records, and later app actions.

```text
files        -> soil:index / soil:vfs
records      -> soil:records books
repositories -> explicit local Git roots
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

Kinds are `file`, `record-entry`, `repository`, and the reserved `action`.

## Host composition

`crates/soil-search-host` composes:

- the VFS SQLite/FTS5 index, including exact path promotion and optional
  semantic vectors
- substring search over an explicit allowlist of `fungos-records` books
- bounded Git discovery under host-granted roots, with credential-stripped origins

Results are merged by score and title, then paginated. `refresh` rebuilds the
VFS index and advances the generation.

The host supplies the roots and approved books. A Spore never chooses a path,
book, provider, or source. Search cannot widen access.

## What comes next

- a Canvas command-palette / finder surface over `soil:search`
- an explicit action source for app commands
- repository actions such as open, branch switch, and worktree creation
- record field filters and per-schema ranking
- cross-source semantic ranking with one embedding space
