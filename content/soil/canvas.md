# Canvas and input

`soil:canvas` is the narrow presentation capability. Canvas owns the surface; the Spore owns presentation state and normalized actions.

## Contract

```wit
present() -> result<state, failure>
observe() -> result<state, failure>
input(generation, event) -> result<state, failure>
close() -> result<_, failure>
```

State carries host-selected extent, scale, focus, visibility, and a generation. Input carries a normalized semantic key or one printable Unicode scalar plus modifiers. A stale generation is refused, never reordered.

## What never crosses

- pixels or framebuffer handles
- native window, display, DRM, or IOSurface handles
- raw keycodes or scan codes
- a Spore-submitted UI tree
- per-frame callbacks

## Host adapters

The portable input normalizer lives in `crates/soil-canvas-input`. The S22 reference runtime and Android JNI host use it. macOS and Linux Canvas use their own platform adapters while preserving the same normalized event model.

## Presentation timing

Canvas decides when a surface is ready and when to redraw. A Spore may `present` or `observe`, but it does not own the frame clock. The host retains the pixels.

## GPU handoff

A WebGPU Spore can hand a standard `wasi:webgpu` texture to Canvas through `soil:canvas-gpu`:

```wit
size: func() -> tuple<u32, u32>;
present: func(texture: borrow<gpu-texture>) -> result<_, string>;
```

The host copies or imports the texture according to its own presentation path. This is a frame handoff, not a swapchain or display API.
