# Build and test

The repositories use different toolchains. The common rule is that a contract or safety gate must fail loudly.

## Soil

```sh
cd soil
cargo test --workspace
cargo clippy --workspace --all-targets -- -D warnings
```

Focused checks:

```sh
cargo test -p soil-abi
cargo test -p soil-vfs-host
cargo test -p soil-webgpu --test wgpu_compute -- --ignored --nocapture
cargo test -p soil-webgpu --test wgpu_canvas -- --ignored --nocapture
cargo test -p soil-process --test cpal_tone -- --ignored --nocapture
```

GPU and audio tests require real host devices and are explicitly ignored in ordinary runs.

The VFS host adapter depends on the sibling `../../fungos-vfs` checkout. For a clean workspace, clone both repositories under the same parent.

## fungos-vfs

```sh
cd fungos-vfs
cargo test --workspace
cargo clippy --workspace --all-targets -- -D warnings
```

Native FUSE:

```sh
cargo build --release -p fungos-vfs-fuse --features fuse
```

macOS needs macFUSE and:

```sh
export PATH="/opt/homebrew/bin:$PATH"
export PKG_CONFIG_PATH="/usr/local/lib/pkgconfig"
```

## Docs

```sh
cd docs
npm install
npm run dev
npm run build
```

Public builds exclude internal pages at bundle time. A public check must also prove that private repository names, source paths, and internal evidence did not enter the bundle.

## Disk-constrained builds

```sh
CARGO_INCREMENTAL=0 RUSTFLAGS='-C debuginfo=0' cargo test --workspace
```

Clean target directories before large builds when disk is tight.
