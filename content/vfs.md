# VFS and content

`fungos-vfs` is a local-first content-addressed workspace. It separates the namespace from the bytes and the transport.

## Model

- **Full node**: can write, retain versions, serve blobs, and pin content.
- **Cache node**: registers placeholders, hydrates ranges, leases open files, and evicts old content. It refuses authoritative writes.
- A path is workspace-relative and canonical. It cannot escape the root.
- A write creates a new immutable `ContentId` version.
- The sync queue is durable and acknowledged explicitly.
- A lease protects an open file from eviction.
- Eviction changes a file to a placeholder but preserves namespace and history.

## Identity vs locator

```text
content_id = blake3:<hex>          canonical whole-content identity
locator    = local | ipfs | iroh   provider-specific address
```

The VFS entry stores the `ContentId`. A Kubo raw-block CID or Iroh hash is a locator that can change without changing the entry. The IPFS stub emits a real raw-block CIDv1, not a UnixFS file root.

## Range hydration

`Hydrator` is the transport seam. A cache can fetch a placeholder through a full node:

```rust
let source = UnibusHydrator::new(client, Some("studio-content".into()));
let bytes = vfs.get_or_hydrate("docs/report.pdf", &source)?;
```

The VFS verifies the fetched bytes against the registered `ContentId` before marking the file present.

The Unibus lane bounds every request:

```text
unibus.content.fetch.v1
unibus.content.data.v1
unibus.content.error.v1
unibus.content.available.v1
```

## Native mounts

`fungos-vfs-fuse` projects the namespace as a real filesystem:

- macOS: macFUSE
- Linux: FUSE3

Reads hydrate placeholders through Unibus when configured. Writes are buffered for the open file and committed as a new content version on release. The first slice has no rename, symlink, xattr, hard-link, sparse, or page-granular write support.

See [Soil: VFS and index](#/soil-vfs) for the Spore-facing contracts.

## What is not owned here

- application meaning or graph relationships
- search ranking and OCR/embedding generation
- identity and access
- a provider's internal storage format
- native file-picker UI
