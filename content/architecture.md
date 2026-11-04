# Architecture

fungOS is layered by **ownership**, not by process boundary. A layer may be a library, a service, a host adapter, or a signed component. The rule is that each piece owns one kind of authority and does not borrow another layer's authority.

```text
┌──────────────────────────────────────────────────────────────┐
│ Canvas                                                       │
│ window · layout · focus · input · presentation timing        │
├──────────────────────────────────────────────────────────────┤
│ Spores (Soil)                                                │
│ signed module + manifest · capability imports · bounded calls│
├──────────────────────────────────────────────────────────────┤
│ Soil host capabilities                                       │
│ canvas · vfs · index · webgpu · audio · ble · time · view    │
├──────────────────────────────────────────────────────────────┤
│ Unibus                                                       │
│ authenticated producer/capability bus · typed kinds          │
├──────────────────────────────────────────────────────────────┤
│ Mycelium                                                     │
│ identity · enrollment · topology · access · updates          │
├──────────────────────────────────────────────────────────────┤
│ fungOS node                                                  │
│ Debian base · profiles · services · content locality         │
└──────────────────────────────────────────────────────────────┘
```

## The boundaries

**Mycelium is the identity and access plane.** A node enrolls before it participates. Grants are explicit and scoped. Mycelium does not become a general application database, and Unibus does not mint authority.

**Unibus is the application bus.** It carries typed messages between producers and capability holders. A producer id is authenticated. A route is explicit. A payload is bounded. Unibus is not the content index or the product database.

**Canvas is the presentation owner.** It owns the window, compositor, layout, focus, input normalization, and frame timing. A Spore may request presentation or navigation through a granted surface, but Canvas decides how and when that appears. Spores do not submit UI trees.

**fungos-vfs is local-first content.** A workspace is a SQLite namespace plus an immutable blob store. `ContentId` is the canonical whole-content identity. IPFS CID or Iroh hash are provider locators. The index is derived and rebuildable.

**Soil is the app runtime.** It links only explicitly granted WIT capabilities into a signed Spore. Calls are bounded and polled; host/device callbacks never synchronously enter Wasm.

## No ambient authority

The default is denial:

- no filesystem paths from a Spore
- no raw sockets, DNS, or arbitrary HTTP
- no clock, device handle, token, lease, or display handle
- no process spawning
- no per-frame callback into Wasm
- no silent fallback from a missing capability to an empty success

A Spore gets a named error such as `denied`, `not-ready`, `over-budget`, `not-hydrated`, or `unsupported`. The absence is data.

## Content identity

```text
CID is a locator.
ContentId is identity.
The graph owns meaning.
The index is derived.
Providers are replaceable.
```

A local CAS, Kubo block, Iroh blob, or remote full node can all locate the same `ContentId`. Changing providers must not change the namespace entry or the index key.

## Related pages

- [Node profiles](#/node-profiles)
- [Mycelium](#/mycelium)
- [Unibus](#/unibus)
- [Canvas](#/canvas)
- [VFS and content](#/vfs)
- [Soil overview](#/soil)
