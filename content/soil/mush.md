# Mush

Mush is the sandboxed shell over one VFS workspace.

```sh
mush --root ~/fungos-node
```

It has no host filesystem, `PATH`, environment, subprocess, or network access.
Every path is workspace-relative.

## Commands

```text
pwd  cd  ls  cat  write  rm  mv  cp  stat  history  search  source  echo
```

Scripts are Mush commands stored in the VFS:

```text
mv notes/today.md notes/archive/today.md
echo archived
```

```sh
mush --root ~/fungos-node --script scripts/archive.mush
```

Mush scripts are not POSIX shell scripts. There is no host `/bin/sh`, no
`PATH`, and no `exec`.

## Storage

```text
write -> new ContentId/version
mv    -> namespace rename; ContentId and history preserved
cp    -> new version with the same bytes
rm    -> namespace unlink; blob and history retained
```

`rm` is not blob destruction; explicit VFS GC is the collector.

## Status

The current slice is a native process whose only data access is the VFS root
passed on the command line. It is not yet a Wasm Spore.

The next slice moves the same command engine into a component using:

```text
soil:vfs      read
soil:vfs      mutation
soil:index    search
soil:terminal cell grid + input
```

Then Mush runs inside Soil with no native filesystem or process authority.
