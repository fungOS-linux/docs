# Spore model

A **Spore** is a signed manifest plus module bytes.

```text
manifest
  module CID
  capabilities
  target
  engine version
  publisher
module
  wasm component bytes
```

The host resolves the CID, verifies the manifest and module, computes the intersection of the manifest, Mycelium grant, and local policy, and links only that capability set.

## Lifecycle

```text
resolve CID
  -> verify signature and module digest
  -> intersect capabilities
  -> instantiate with explicit imports
  -> call/poll within budgets
  -> close or fail with a named reason
```

There is no ambient import fallback. A missing grant is a link-time refusal, not an empty success.

## No callbacks into Wasm

Host and device callbacks stay host-internal. Guest code is entered only through explicit, bounded call or poll boundaries.

Examples:

- a cpal device callback writes to a host queue; a guest audio thread drains it
- a BLE notification enters a host queue; the Spore polls `next-event`
- a Canvas frame is presented by a host call; there is no per-frame Spore callback
- a file read is a bounded range call; the host does not call back into the Spore for page faults

## Honest failure

A Spore may receive `denied`, `not-ready`, `over-budget`, `invalid`, `unsupported`, `not-hydrated`, or `closed`. These are typed contract results, not strings that the host hopes the Spore interprets.

## Distribution

The planned **Spore Store** publishes by CID and resolves by CID + target. Revocation is separate from re-signing. A Spore is never republished under a new identity to hide a bad build.

## Related

- [Capability contracts](#/soil-capabilities)
- [SDK](#/soil-sdk)
- [Security and updates](#/security)

## Feeds spike

The feeds reader is a first spike of a Spore that owns presentation and policy
but not transport:

```text
host feed poller -> records book -> soil:records -> Feeds Spore
settings         -> soil:appdata
```

The Spore imports only `soil:appdata` and `soil:records`. It has no network
capability, so it cannot scrape an arbitrary URL. Host-side `records import-rss`
or `records sync-feeds` writes `fungos.feeds/item@1`; the Spore reads a
host-mapped collection and keeps its private settings in synced AppData.

If human-editable settings are wanted, the host can project the AppData key to
a git-backed dotfile under `~/.config/fungos/soil/<spore-id>/`. That projection
is host-owned: the Spore still never receives a path, one side must be the
authority, and writes should use generation checks. Lua overrides follow the
same rule: reviewed package assets or an explicit host projection, never an
ambient filesystem grant.
