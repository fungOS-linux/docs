# Roadmap and status

This page is deliberately conservative. "Implemented" means there is code and a test or a real run; "design" means the boundary is written down but the host is not built.

## Working

- Debian base builder and capability-derived profiles
- Mycelium enrollment, topology, access, and update paths
- Unibus producers, capabilities, routes, IPFS retrieval, Iroh peer sessions
- Canvas host-owned presentation and normalized input
- `fungos-vfs` full nodes, caches, Unibus range fetch/serve, FUSE mount
- Soil BLE host + COLMI ring Spore
- Soil `wasi:webgpu` compute and Canvas presentation
- Soil threaded cpal audio
- Soil `soil:vfs` + `soil:index` host adapter
- docs-kit shared documentation shell

## Next

1. **File-browser Spore.** Build the read-only browser over `soil:vfs`/`soil:index`: browse, substring/fuzzy search, multi-select, preview ranges, open in Canvas.
2. **Plan/action layer.** Compile prompts into inspectable plans: archive selection, send to a reviewed target, preview, approve, execute, receipt.
3. **Index extraction.** FTS5/trigram search, OCR, and an optional embedding backend. Semantic search stays `unsupported` until then.
4. **Sparse/page-granular VFS reads.** The current FUSE write path is whole-file on close.
5. **File Provider / Cloud Files adapter.** macFUSE works as a native mount; a signed File Provider extension is the next macOS-native path.
6. **Unibus multi-provider policy.** Provider health, fallback order, pin-on-open, and lease-aware eviction.
7. **Spore Store.** Signed publish/resolve/revoke by CID + target.

## Deferred

- raw sockets and arbitrary HTTP
- process spawning from a Spore
- per-frame Wasm callbacks
- `soil:surface` UI trees
- secrets in Wasm memory
- a globally replicated task authority
- treating an IPFS CID as the primary identity

## Open questions

- Which text/OCR extractors are cheap enough to run during index rebuild?
- Where should embedding generation live: host, a local model, or a separate content worker?
- How should a browser plan represent ambiguity and approval without becoming a chat transcript?
- Which parts of the FUSE write path can become sparse without weakening `ContentId` verification?
