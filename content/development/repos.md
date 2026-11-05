# Repository map

Each repository owns one boundary. The docs site is a view over them, not a second source of truth.

| Repository | Owns |
|---|---|
| [`fungOS-linux/fungos`](https://github.com/fungOS-linux/fungos) | Debian base builder, profiles, package publisher, installer and release tooling |
| [`fungOS-linux/soil`](https://github.com/fungOS-linux/soil) | WIT contracts, Soil hosts, Spores, Canvas input/runtime adapters, VFS/index host adapter |
| [`fungOS-linux/unibus`](https://github.com/fungOS-linux/unibus) | Authenticated application bus, routes, TCP/QUIC/Iroh peer transport |
| [`fungOS-linux/fungos-vfs`](https://github.com/fungOS-linux/fungos-vfs) | Local-first VFS, content identity, pull-through cache, FUSE mount, Unibus content lane |
| [`fungOS-linux/records`](https://github.com/fungOS-linux/records) | PIM records, books, per-device op log, vCard import, device sync |
| [`fungOS-linux/mycelium`](https://github.com/fungOS-linux/mycelium) | Identity, enrollment, topology, access, trusted updates |
| [`FuturePresentLabs/transmog`](https://github.com/FuturePresentLabs/transmog) | Native CAD interoperability SDK and its docs |
| [`ajmwagar/docs-kit`](https://github.com/ajmwagar/docs-kit) | Reusable Mintlify-style Vite documentation shell |

## Where a change belongs

- A new host capability starts as a WIT package in Soil and a conformance test in `soil-abi`.
- A new content provider lives in the VFS/content layer, not in Canvas or the node profile.
- A new route or message kind belongs to Unibus, with grants and a bounded payload.
- A new machine profile belongs to the fungOS base builder.
- A new screen layout belongs to Canvas, not to a Spore's UI tree.

## Documentation

This site uses `@ajmwagar/docs-kit`. The same shell is used by the Transmog docs. Content stays in each repository; the shell only owns navigation, rendering, search, theme, and the public/internal split.
