# Install and build

There are three distinct install paths: build a node rootfs, install runtime services on a node, or build an app with Soil. They do not share one installer.

## Build a fungOS base rootfs

The public base builder validates its declarations first:

```sh
git clone https://github.com/fungOS-linux/fungos.git
cd fungos
./base/scripts/check.sh
```

On a Debian build host with `mmdebstrap`, the Debian archive keyring, and the required privileges:

```sh
sudo ./base/scripts/build.sh amd64 base
sudo ./base/scripts/inspect.sh base/out/fungos-base-amd64.tar
```

The output is a **rootfs tarball**. It is not a ready-to-flash SD card or an installer ISO. Board firmware, kernels, boot installation, enrollment, and signed first-party executables remain separate integration steps.

See the repository runbooks for [base](https://github.com/fungOS-linux/fungos/tree/main/base), [packages](https://github.com/fungOS-linux/fungos/tree/main/packages), and [installer](https://github.com/fungOS-linux/fungos/tree/main/installer) details.

## Install a content node

`fungos-vfs` builds the kernel-adjacent tools:

```sh
git clone https://github.com/fungOS-linux/fungos-vfs.git
cd fungos-vfs
cargo build --release --bin fungos-vfs
cargo build --release -p fungos-vfs-unibus --bin fungos-vfs-provider
cargo build --release -p fungos-vfs-unibus --bin fungos-vfs-fetch
cargo build --release -p fungos-vfs-fuse --features fuse
```

Put the binaries in `~/.local/bin` or a service-specific path. A full node owns a VFS root:

```sh
fungos-vfs --root ~/fungos-node put ./README.md docs/README.md
```

A cache node registers a placeholder and hydrates it later:

```sh
fungos-vfs --root ~/fungos-cache --role cache placeholder \
  docs/README.md blake3:<hex> 1024 --media-type text/markdown
```

## Mount the VFS

Linux:

```sh
mkdir -p ~/fungOS
fungos-vfs-fuse --root ~/fungos-node --mount ~/fungOS
```

macOS uses macFUSE. Install macFUSE, reboot, and approve the system extension in **System Settings → Privacy & Security** before the first mount.

## Build Soil

Soil is a Rust workspace. The exact gates are in [Build and test](#/build). For a quick contract check:

```sh
git clone https://github.com/fungOS-linux/soil.git
cd soil
cargo test -p soil-abi
```

## What is not installed here

- no signing key
- no enrollment claim
- no fleet credential
- no pre-approved device access
- no claim that a built rootfs is a release candidate

Those are provisioning decisions, not build side effects.
