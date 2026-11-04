# Security and updates

fungOS uses explicit authority, bounded interfaces, and honest failure.

## Rules

1. **No ambient authority.** No filesystem, network, clock, environment, or device access unless a named capability is linked and granted.
2. **No callbacks into Wasm.** Host/device callbacks stay host-internal. Guest execution happens at explicit, bounded call/poll boundaries.
3. **Soil owns the platform object.** GPU device, camera, audio device, window, radio, bus connection, VFS namespace, and index stay in the host.
4. **No second ACL.** Mycelium owns identity/grants; Unibus enforces on the bus; Soil enforces capability linking. A connector or Spore never mints authority.
5. **Honest absence.** Unsupported or denied is a named error, never a placeholder success.
6. **Transport in Soil, protocol in the Spore.** Radios and GPUs are host capabilities; wire formats and state machines ship as `.wasm`.

## Updates

Updates are signed artifacts from a trusted publisher. The node verifies the artifact and the publisher before applying it. A failed or unavailable channel is a visible failure; it does not become an unsigned fallback.

## Spore manifests

A Spore is a signed manifest plus module bytes. The manifest binds:

- module CID
- capabilities and target
- engine version
- publisher identity

The host links exactly the intersection of the manifest, Mycelium grant, and local policy.

## Content

- `ContentId` verification happens before a hydrated file is marked present.
- Unibus direct sessions bind both endpoint keys and a bounded kind/payload scope.
- The hub enforces producer identity and publish scope.
- Provider locators are replaceable and are not treated as identity.

## What this documentation will not claim

- that every profile is production-qualified
- that a built rootfs is a release
- that an unsupported device works
- that a semantic search backend exists when it does not
- that a public repository makes every internal service public
