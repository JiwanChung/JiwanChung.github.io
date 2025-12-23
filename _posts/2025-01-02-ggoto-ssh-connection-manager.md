---
layout: post
title: "ggoto: A TUI for SSH Connections"
date: 2025-01-02
tags: [rust, cli, ssh, tui]
---

SSH config files grow over time. Research clusters, cloud instances, dev servers, home machines - they accumulate. At some point, remembering hostnames becomes a chore. Was it `gpu-node-3` or `node-gpu-3`? Is the server even up right now?

**ggoto** puts all your SSH hosts in a navigable list with live health indicators.

<!-- TODO: Add screenshot of main interface -->

## The Scenario

You're about to SSH into a server. But first:
- Which hostname was it again?
- Is it responsive, or will you wait 30 seconds for a timeout?
- Is it overloaded? Should you pick a different node?

These questions interrupt the actual work. ggoto answers them at a glance.

## What It Does

Run `ggoto` and see every host from your `~/.ssh/config`. Each one shows:
- Latency (color-coded: green/yellow/red)
- CPU and RAM usage
- GPU utilization (for servers with nvidia-smi)

<!-- TODO: Add screenshot showing health metrics -->

Servers with similar names group automatically. `prod-web-01`, `prod-web-02`, `prod-web-03` collapse into `prod-web`.

Press a letter shortcut to connect instantly. No typing hostnames, no arrow-key navigation for frequently used servers.

## Tunnels Without the Syntax

SSH tunnel syntax is easy to forget:

```bash
ssh -L 8888:localhost:8888 -L 5432:db.internal:5432 server
```

In ggoto, press `t` and type `8888` or `5432:db.internal`. For multiple ports, use ranges: `8000-8010` creates eleven tunnels at once.

<!-- TODO: Add screenshot of tunnel dialog -->

## Installation

```bash
cargo install --git https://github.com/JiwanChung/ggoto.git
```

Reads your existing `~/.ssh/config` - no additional setup.

---

[GitHub](https://github.com/JiwanChung/ggoto)
