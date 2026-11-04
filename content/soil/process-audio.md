# Process and audio

Soil has two guest execution lanes: ordinary `wasm32-wasip2` components and a threaded `wasm32-wasip1-threads` process lane.

## Why a threaded lane

`wasm32-wasip2` can compile `std::thread::spawn`, but the runtime may use a single-threaded wasi-libc `pthread_create` and fail at runtime. The process lane enables:

- shared linear memory
- Wasmtime `wasm_threads(true)` and `shared_memory(true)`
- `wasi.thread-spawn`
- explicit process imports for host audio

## cpal

A guest cpal callback must not synchronously enter Wasm from the host device callback. The host owns the device callback and moves data through a bounded queue. The guest callback runs on a guest thread.

```rust
let host = cpal_soil::host();
```

On native targets this returns the default cpal host. On `wasi` it returns the Soil custom host.

## Audio sink

The draft `wasi:audio@0.1.0` sink is a bounded PCM path:

```wit
open(format) -> result<output, error>
write(frames) -> result<u32, error>
drain(timeout-ms) -> result<_, error>
```

The host owns the device, final mix, conversion, and clock. The guest owns rendering and backpressure. A full queue returns zero accepted frames; the guest drains or yields.

## Verification

```sh
cargo run -p soil-process -- crates/soil-process/fixtures/cpal-tone.wasm
cargo test -p soil-process --test cpal_tone -- --ignored --nocapture
```

The verified result is a real cpal playback with zero steady-state underruns and a callback running on a guest thread.
