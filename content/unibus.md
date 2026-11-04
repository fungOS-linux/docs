# Unibus

Unibus is the authenticated application bus for fungOS. It carries typed messages between **producers** and **capability holders**.

## Model

- A node has an authenticated `producer_id`.
- A message has a kind, a body, optional bytes, a destination, and a schema version.
- A **route** maps a kind to a delivery target:
  - `capability`: a live node holding a named capability in the destination zone
  - `any_holder`: any live holder installation-wide
  - `producer`: the producer named by `destination`
- A node may publish only the kinds and target scopes in its grant.

The hub enforces identity, scope, payload bounds, and routing. It does not interpret the application payload.

## What Unibus is not

- not the content index
- not the product database
- not a raw socket or HTTP proxy
- not an authority minter
- not a replacement for Mycelium identity or Canvas layout

## The content lane

`fungos-vfs-unibus` is an L2 user of the bus. It defines:

```text
unibus.content.fetch.v1
unibus.content.data.v1
unibus.content.error.v1
unibus.content.available.v1
```

A cache sends a bounded `fetch` with a `ContentId`, offset, and length. A full-node provider answers with `data` or a typed `error`. Data frames are correlated by request id and verified against the `ContentId`.

The provider can serve two session shapes with the same logic:

- the TCP hub client used by `fungos-vfs-provider`
- an authenticated `unibus::PeerSession`, including `unibus/peer/1` over Iroh

## Iroh peers

The Iroh path uses a signed direct-session assertion binding both endpoint keys, an audience, an installation, allowed message kinds, and a maximum payload. The session is encrypted and authenticated before content frames are accepted.

The integration test in the VFS repository drives a real loopback Iroh session, a bounded range fetch, and a verified response.

## Operational shape

A deployed full node connects through an existing SSH tunnel or a local hub:

```text
studio-content  -> 127.0.0.1:18792 -> home-pi unibus-router:18790
agora-content   -> 127.0.0.1:18791 -> home-pi unibus-router:18790
```

Routes for the content kinds use `producer` mode. Clients name the provider explicitly. Providers publish only `data`/`error`; clients publish only `fetch`.

See [Operations](#/operations).
