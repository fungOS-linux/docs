# VFS and index

`soil:vfs` and `soil:index` make a fast read-only file browser possible without giving a Spore a host path or a provider.

## Split

| Contract | Owns | Does not own |
|---|---|---|
| `soil:vfs` | canonical workspace namespace, entry metadata, bounded range reads | host paths, directory handles, providers, leases |
| `soil:index` | derived browse order, search, snippets, generation | authority, mutations, content bytes |

## Browser loop

1. `index.browse(parent, order, offset, limit)` for an initial page or sort.
2. `index.search(query)` for substring, fuzzy, full-text, or semantic search.
3. `vfs.stat(path)` for each visible row, or use entries from `vfs.ls`.
4. `vfs.read(path, offset, length)` for preview bytes, thumbnails, or a paged editor.
5. `index.state()` to detect readiness/generation, or `index.refresh()`.

`vfs.ls` is path-ordered and authoritative. `index.browse` may use a faster derived order, but it returns paths only; the Spore must stat before treating a row as current.

## Host adapter

`crates/soil-vfs-host` maps the contracts onto `fungos-vfs`:

- namespace listing and stat
- bounded range reads
- placeholder hydration through an optional `ContentHydrator`
- a persistent derived index in SQLite/FTS5
- substring, fuzzy, and full-text search
- exact path promotion in full-text results
- explicit `unsupported` for semantic search

The index lives at `<vfs-root>/.fungos/soil-index.sqlite3`, or at an explicit
path via `VfsHost::open_with_index`. It is a cache: delete it and the host
rebuilds from the namespace. A source hash over VFS entries avoids rebuilding
on every open.

It indexes small `text/*` files today; OCR and embeddings are future derived
fields. Vectors can be cached as `f32` BLOBs and ranked by brute-force cosine.
When scale requires ANN, replace the backend behind `IndexBackend`; the
`soil:index` contract does not change. Never sync this database: sync records
and content, then rebuild locally.

## Desktop projection

The same VFS is also mounted natively:

```sh
fungos-vfs-fuse --root ~/fungos-node --mount ~/fungOS
```

macOS uses macFUSE; Linux uses FUSE3. The mount is another view of the same authority, not a second store.

## Limits

- read-only in this slice: no rename, delete, or write contract
- pages and ranges are bounded
- no host paths, directory traversal, or provider selection
- no sparse/page-granular reads yet
- semantic search returns `unsupported` until an embedding backend is linked
