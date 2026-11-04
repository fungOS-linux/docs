<div class="hero">
  <p class="eyebrow">fungOS · Linux for connected machines</p>
  <h1>A mesh-native work OS, built from explicit capabilities.</h1>
  <p class="hero-lead">fungOS combines Debian nodes, Mycelium identity and access, Unibus application transport, Canvas presentation, a local-first content VFS, and the Soil WASM runtime. Each layer has one owner and a narrow boundary.</p>
  <div class="hero-actions">
    <a class="button primary" href="#/architecture">Read the architecture</a>
    <a class="button" href="#/install">Build a node</a>
  </div>
</div>

<div class="card-grid">
  <a class="doc-card" href="#/node-profiles">
    <span class="card-kicker">Platform</span>
    <strong>Nodes with explicit profiles</strong>
    <span>Base, edge, headless-edge, and cloud declarations. The image is a rootfs artifact, not a hidden appliance.</span>
  </a>
  <a class="doc-card" href="#/mycelium">
    <span class="card-kicker">Identity</span>
    <strong>Enrollment before access</strong>
    <span>Mycelium owns identity, topology, grants, and trusted release delivery. There is no ambient fleet authority.</span>
  </a>
  <a class="doc-card" href="#/unibus">
    <span class="card-kicker">Transport</span>
    <strong>Capabilities, not sockets</strong>
    <span>Producers publish typed kinds. Consumers hold scoped capabilities. The hub enforces identity and scope.</span>
  </a>
  <a class="doc-card" href="#/canvas">
    <span class="card-kicker">Presentation</span>
    <strong>Canvas owns the window</strong>
    <span>Layout, focus, input, and timing stay host-owned. Spores ask Canvas to present; they never submit a UI tree.</span>
  </a>
  <a class="doc-card" href="#/vfs">
    <span class="card-kicker">Content</span>
    <strong>CID is a locator</strong>
    <span><code>ContentId</code> is identity. The graph owns meaning. The index is derived. Providers are replaceable.</span>
  </a>
  <a class="doc-card" href="#/soil">
    <span class="card-kicker">Apps</span>
    <strong>Spores, not ambient programs</strong>
    <span>Soil links only the capabilities a signed Spore was granted, with bounded calls and named refusals.</span>
  </a>
</div>

## What works today

This is an engineering documentation set, not a claim of a stable distribution.

- The generic Debian base builder and capability-derived profiles are public.
- Mycelium enrollment, topology, access, and signed update paths exist.
- Unibus runs authenticated producers, capability routing, IPFS retrieval, and Iroh peer sessions.
- Canvas presents host-owned surfaces on macOS, Linux, Android/Fire TV, and the S22 reference host.
- `fungos-vfs` implements local full nodes, pull-through caches, ranged Unibus fetch/serve, and native macOS/Linux FUSE mounts.
- Soil parses every reviewed WIT contract, runs the BLE COLMI ring Spore, real `wasi:webgpu` programs, threaded audio, and the `soil:vfs`/`soil:index` host adapter.

## Read in order

1. [Architecture](#/architecture) for the ownership model.
2. [Node profiles](#/node-profiles) for what a machine is.
3. [Mycelium](#/mycelium), [Unibus](#/unibus), and [Canvas](#/canvas) for the running platform.
4. [VFS and content](#/vfs) for local-first data.
5. [Soil](#/soil) for the app runtime and its capability contracts.
6. [Build and test](#/build) to reproduce the gates.
