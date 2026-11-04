# Operations

This page describes the current content-node deployment shape. It is an engineering runbook, not a high-availability product claim.

## Full nodes

Both **studio** and **agora-one** run full VFS replicas and content providers:

```text
studio:   /Users/ajmwagar/fungos-node
agora:    /home/ajmwagar/fungos-node
```

They connect through existing SSH tunnels to the home-pi `unibus-router`:

```text
studio-content  -> 127.0.0.1:18792 -> home-pi:18790
agora-content   -> 127.0.0.1:18791 -> home-pi:18790
```

## Provider service

```sh
fungos-vfs-provider \
  --root /srv/fungos \
  --config /etc/unibus/studio-content.json
```

The Unibus router needs explicit nodes and routes:

```json
{
  "producer_id": "studio-content",
  "capabilities": ["content.provider"],
  "publishes": ["unibus.content.data.v1", "unibus.content.error.v1"],
  "publish_producers": ["studio-cache", "agora-cache"]
}
```

```json
{ "kind": "unibus.content.fetch.v1", "target": { "mode": "producer" } }
```

The cache node publishes only `fetch` and names the provider explicitly.

## Cache nodes

```sh
fungos-vfs --root ~/fungos-cache --role cache placeholder \
  docs/report.pdf blake3:<hash> 1048576 --media-type application/pdf
```

Hydrate:

```sh
fungos-vfs-fetch \
  --root ~/fungos-cache \
  --role cache \
  --config ~/.config/unibus/agora-cache.json \
  --provider studio-content \
  docs/report.pdf \
  --output /tmp/report.pdf
```

## Native mounts

Linux service:

```ini
[Service]
ExecStart=/home/ajmwagar/.local/bin/fungos-vfs-fuse \
  --root /home/ajmwagar/fungos-node \
  --mount /home/ajmwagar/fungOS
ExecStop=/usr/bin/fusermount3 -u /home/ajmwagar/fungOS
Restart=on-failure
```

macOS launchd:

```text
dev.fungos.vfs-content  -> fungos-vfs-provider
dev.fungos.vfs-fuse     -> fungos-vfs-fuse
```

macFUSE must be installed, loaded, and approved before the mount succeeds. The launchd job retries.

## Verification

```sh
mount | grep fungOS
sha256sum ~/fungOS/hello.bin
fungos-vfs --root ~/fungos-node stat hello.bin
```

A provider reply must carry the declared payload length. A direct-session reply must also match the negotiated maximum.
