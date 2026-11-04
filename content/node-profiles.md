# Node profiles

A fungOS machine is described by an explicit profile. The profile derives the Debian package set and the services it enables; it does not silently grant devices or network access.

| Profile | Shape | Typical role |
|---|---|---|
| `base` | Debian rootfs, minimal runtime, Mycelium enrollment path | general node, service host |
| `edge` | base plus Unibus and the native Canvas Wayland compositor | workstation, display node, local agent host |
| `headless-edge` | edge services without the desktop presentation stack | displayless edge, content/provider node |
| `cloud` | server-oriented package set and update path | remote relay, registry, build, or storage node |

Profiles live in `base/config/` in [fungOS-linux/fungos](https://github.com/fungOS-linux/fungos). The builder consumes them; the profile does not become a second configuration authority at runtime.

## What a profile is not

- not a hardware board definition
- not a bootloader or kernel image
- not an enrollment claim
- not a permission to use a discovered device
- not a stable release channel

## Edge desktop

The edge profile supplies runtime dependencies for Canvas and Unibus. It does **not** fork their implementations and does not grant every discovered device to every app.

Canvas owns the compositor and presentation. Unibus carries typed application traffic. Mycelium owns identity and access.

## Content nodes

A full content node is a normal fungOS node with a local VFS root and a content provider service. A cache node has the same runtime but a cache-role workspace.

See [Operations](#/operations) for the concrete provider and mount services.
