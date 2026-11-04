# SDK

The guest SDK is an umbrella over capability-specific crates. It deliberately does not generate one giant world: a Spore imports only the feature crates it uses, so the linker sees a narrow capability set.

## Shape

```text
soil-sdk
  feature audio -> soil-sdk-audio
  future vfs    -> soil-sdk-vfs
  future index  -> soil-sdk-index
```

A capability crate generates bindings from the canonical WIT and wraps the raw host calls in a small guest-side API.

## Audio example

```rust
let mut output = soil_sdk::audio::Output::open(48_000, 2)?;
output.write_all(&samples)?;
output.drain(1_000)?;
output.close()?;
```

The host still owns the device, clock, final mix, and conversion. The SDK only reduces guest-side boilerplate.

## Building a Spore

```sh
cargo check --target wasm32-wasip2
cargo clippy --target wasm32-wasip2 -- -D warnings
```

A Spore manifest must declare exactly the capabilities it imports. The host does not link an unused capability because a world happened to include it.

## Reading a file

```rust
let page = soil::index::browse("photos", Order::ModifiedDesc, 0, 50)?;
for hit in page.hits {
    let entry = soil::vfs::stat(&hit.path)?;
    if entry.kind == Kind::File {
        let chunk = soil::vfs::read(&hit.path, 0, 64 * 1024)?;
    }
}
```

The exact guest crate layout can evolve, but the WIT contracts are the stable boundary.

## Related

- [Capability contracts](#/soil-capabilities)
- [VFS and index](#/soil-vfs)
- [Canvas and input](#/soil-canvas)
