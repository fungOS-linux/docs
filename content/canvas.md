# Canvas

Canvas is the cross-platform presentation owner. It is not a Spore and not a general window manager API exposed to Wasm.

## Canvas owns

- window and compositor lifecycle
- layout and workspace state
- focus and navigation
- host-normalized input
- presentation decision and timing
- theme and project identity
- frame retention and capture buffers

## Spores do not submit UI trees

A Spore asks the host to present or navigate a granted surface. It does not send a widget tree, a native window handle, a display id, or a framebuffer.

This keeps the same app usable on macOS, Linux, Android/Fire TV, and the S22 reference host without making every Spore own a platform UI.

## Input

Input crosses the boundary as a normalized semantic event:

- named keys and media keys
- one printable Unicode scalar for text
- explicit modifiers

Raw keycodes, scan codes, and device events stay in the host. The S22 and desktop adapters share the portable normalizer in `crates/soil-canvas-input`.

## Timing

There is no per-frame callback into Wasm. A Spore presents or observes through an explicit call. Canvas schedules redraws and decides when the owner surface is ready.

## The presentation bridge

The narrow `soil:canvas-gpu` contract lets a WebGPU program hand a standard `wasi:webgpu` texture to a host-owned Canvas frame. The contract exposes size and a bounded present operation; it does not expose a swapchain, display handle, or raw GPU object.

See [Soil: Canvas and input](#/soil-canvas) and [Soil: WebGPU](#/soil-webgpu).

## Project resources

Canvas is also the presentation plane for project notes, dashboards, retained views, and agent state. The document and lifecycle stay in Canvas; the underlying data stays with its source owner.
