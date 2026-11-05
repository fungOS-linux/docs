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

The first reader imports only `soil:appdata` and `soil:records`. The scraper
variant adds `soil:http`: it can request a user-configured feed URL, but the host
still owns the origin allowlist, TLS, budgets, transport route, and credential
handle. It never gets a socket, DNS API, or secret bytes. Host-side
`records import-rss` remains the offline path.

If human-editable settings are wanted, the host can project the AppData key to
a git-backed dotfile under `~/.config/fungos/soil/<spore-id>/`. That projection
is host-owned: the Spore still never receives a path, one side must be the
authority, and writes should use generation checks. Lua overrides follow the
same rule: reviewed package assets or an explicit host projection, never an
ambient filesystem grant.

## Peer sync opt-in

A Spore does not import Unibus, Iroh, or a peer transport. It imports
`soil:records` (and later `soil:appdata` or a Geode-backed credential handle).
The host decides which records book the collection maps to, whether that book
syncs, and which authenticated peer session carries it.

```text
Spore: soil:records collection + schema
Host:  book, peer session, grants, Geode credential handle, route
```

`records.sync.*` and `geode.sync.*` are message kinds on one shared
`unibus/peer/1` session. Mycelium supplies discovery, identity, grants, and
revocation; Iroh supplies encrypted reachability. Spores never name an endpoint,
DNS address, Iroh key, token, or transport. SSH/TCP remains an explicit host
fallback, not a Spore option.

`crates/soil-sync-host` now accepts an Iroh listener, verifies sessions through
the host-supplied `SessionConfig`, and routes records frames to
`fungos-records`. Its test performs a real encrypted Iroh loopback sync. The
production remaining input is the Mycelium/fpl-auth session verifier and
issuer; the host deliberately refuses permissive JSON assertions.
