# Soil shell

`soil` mounts a VFS workspace through FUSE and starts an interactive shell
inside it.

```sh
soil --root ~/fungos-node shell --mount ~/fungOS
```

It also runs under the Soil terminal:

```sh
soil-terminal --command soil --root ~/fungos-node shell --mount ~/fungOS
```

## Safe deletion

The VFS projection already separates namespace from storage:

```text
write -> new ContentId/version under the path
rm    -> namespace unlink, blob and history retained
```

`soil rm` makes the behavior explicit and prints the content id, version, and
history command:

```sh
soil --root ~/fungos-node rm notes/today.md
```

The interactive shell installs an `rm` alias to `soil rm` for bash and zsh.

## Other commands

```text
soil ls [PREFIX]
soil stat PATH
soil cat PATH
soil history PATH
soil search QUERY
```

## Boundaries

- FUSE owns the mount projection, not content identity.
- The shell runs on the host pty; `soil-vt` remains the terminal emulator.
- Deleting the mount or stopping FUSE does not delete blobs or history.
- `soil search` is fuzzy index search, not shell globbing.
