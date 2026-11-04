# WebGPU

Soil uses upstream `wasi:webgpu@0.3.0-rc.2` rather than inventing a GPU ABI. The host owns the adapter, device, queue, shader compilation, and presentation decision.

## What runs

- real `wgpu-core` 29 compute programs
- real render programs producing a texture
- RGBA8/BGRA8 readback through a tightly packed buffer
- a standard WebGPU texture handed to a host-owned Canvas frame

The compute fixture requests an adapter/device, compiles WGSL, runs a storage-buffer dispatch, reads the result back, and verifies it. The Canvas fixture renders a triangle and presents the texture.

## Boundary

```text
Spore -> wasi:webgpu -> wgpu host -> GPU
                       |
                       +-> soil:canvas-gpu -> Canvas frame
```

The Spore never receives a Metal/Vulkan/D3D handle. Canvas owns the final presentation decision, including when a frame is shown and at what extent.

## Testing

GPU fixtures require a native adapter and are run explicitly:

```sh
cargo test -p soil-webgpu --test wgpu_compute -- --ignored --nocapture
cargo test -p soil-webgpu --test wgpu_canvas -- --ignored --nocapture
```

A software-only CI run validates linking and contracts, not pixel output.
