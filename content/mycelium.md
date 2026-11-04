# Mycelium

Mycelium is the control plane for the node fleet. It owns:

- identity and enrollment
- topology and observed endpoints
- access grants and roles
- trusted software and update delivery
- fleet status and scoped execution

It is not the application message bus, the content index, or a general-purpose database.

## Enrollment before access

A node does not participate by being reachable. It participates after enrollment establishes its identity and grants. A discovered address, a known hostname, or a valid TLS certificate alone is not fleet authority.

```text
invite / claim
  -> node identity
  -> scoped grants
  -> service registration
  -> operational access
```

## Identity is separate from application identity

A Mycelium node key is not automatically the right key for every application. Unibus peer endpoints and content providers use their own persistent application keys. Reusing the daemon key would conflate the control plane with application authority.

## Updates

Mycelium manages release channels, signed artifacts, policy, and rollout state. The security rule is simple: an update is a signed artifact from a trusted publisher, and failure is visible. A node does not silently degrade to an unsigned binary because a channel is unavailable.

## Access

Access grants are explicit and scoped. SSH, remote execution, and service access are not implied by network reachability. For host-level automation, use the reviewed access path rather than embedding credentials in an app or Spore.

## Relationship to the rest of fungOS

- [Unibus](#/unibus) consumes Mycelium identity and grants but does not mint them.
- [Canvas](#/canvas) is a local presentation owner; it does not become the fleet access controller.
- [fungos-vfs](#/vfs) stores content locally; it does not own identity.
- [Soil](#/soil) links capabilities for a Spore; it does not replace Mycelium policy.

## Current status

Mycelium has working enrollment, topology, access, update, and fleet tooling. It is also an active development system; treat operational commands as engineering operations, not a finished consumer product.
