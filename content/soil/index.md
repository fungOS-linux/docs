<div class="hero">
  <p class="eyebrow">Soil · WASM runtime for fungOS apps</p>
  <h1>Spores run on capabilities, not ambient authority.</h1>
  <p class="hero-lead">A Spore is a signed manifest plus module bytes. Soil links only the WIT capabilities the manifest was granted, keeps platform objects in the host, and makes every limit and refusal explicit.</p>
  <div class="hero-actions">
    <a class="button primary" href="#/soil-spores">Read the Spore model</a>
    <a class="button" href="#/soil-capabilities">Browse capabilities</a>
  </div>
</div>

<div class="card-grid">
  <a class="doc-card" href="#/soil-capabilities">
    <span class="card-kicker">Contracts</span>
    <strong>Reviewed WIT</strong>
    <span>Canvas, VFS, index, time, storage, BLE, view, WebGPU, and audio. Every package has a conformance test.</span>
  </a>
  <a class="doc-card" href="#/soil-canvas">
    <span class="card-kicker">Presentation</span>
    <strong>Canvas owns the surface</strong>
    <span>Spores present and receive normalized input. No UI tree, frame callback, raw keycode, or display handle.</span>
  </a>
  <a class="doc-card" href="#/soil-webgpu">
    <span class="card-kicker">GPU</span>
    <strong>Standard wasi:webgpu</strong>
    <span>Real wgpu 29 compute and render, with a narrow Canvas texture handoff.</span>
  </a>
  <a class="doc-card" href="#/soil-vfs">
    <span class="card-kicker">Files</span>
    <strong>Fast local browsing</strong>
    <span><code>soil:vfs</code> and <code>soil:index</code> expose namespaces and derived search without host paths.</span>
  </a>
  <a class="doc-card" href="#/soil-capabilities">
    <span class="card-kicker">Records</span>
    <strong>Durable structured state</strong>
    <span><code>soil:records</code> gives Spores book-scoped entries, tombstones, a change feed, and revision/origin merge without a second database.</span>
  </a>
  <a class="doc-card" href="#/soil-search">
    <span class="card-kicker">Search</span>
    <strong>One local discovery surface</strong>
    <span><code>soil:search</code> composes files, records, and future app actions without widening access.</span>
  </a>
  <a class="doc-card" href="#/soil-shell">
    <span class="card-kicker">Shell</span>
    <strong>Files you can actually use</strong>
    <span><code>soil shell</code> mounts the VFS through FUSE, with deletion as namespace unlink and blobs retained.</span>
  </a>
  <a class="doc-card" href="#/soil-mush">
    <span class="card-kicker">Mush</span>
    <strong>The sandboxed shell</strong>
    <span>No host PATH, no subprocesses, workspace-relative paths, and deletion that keeps content and history.</span>
  </a>
  <a class="doc-card" href="#/soil-process">
    <span class="card-kicker">Process</span>
    <strong>Threads and bounded audio</strong>
    <span>Guest threads and cpal callbacks run without synchronously entering Wasm from the host device callback.</span>
  </a>
  <a class="doc-card" href="#/soil-sdk">
    <span class="card-kicker">Build</span>
    <strong>Guest SDK</strong>
    <span>The umbrella re-exports capability crates so a Spore imports a narrow world, not one giant host.</span>
  </a>
</div>

## Status

Soil is early. The full runtime host is not a finished product, but several real pieces run:

- BLE host + COLMI ring protocol Spore
- `wasi:webgpu` compute and Canvas presentation fixtures
- threaded `wasm32-wasip1-threads` audio with a cpal host
- `soil:vfs` + `soil:index` host adapter over `fungos-vfs`
- contract conformance for every reviewed WIT package

The docs describe what the code does today and label the rest as design or next.
