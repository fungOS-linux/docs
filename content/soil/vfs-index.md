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
- a derived index with path/media/text
- substring, fuzzy, and full-text search
- explicit `unsupported` for semantic search

The index is rebuilt from the current namespace. It can index small `text/*` files; OCR and embeddings are future derived fields.

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
