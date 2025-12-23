---
layout: post
title: "sync-rs: Simple File Sync Between Machines"
date: 2025-01-05
tags: [rust, cli, productivity]
---

rsync is powerful. It's also verbose. The typical command for syncing a project folder looks like:

```bash
rsync -avz --exclude='.git' --exclude='node_modules' --exclude='target' \
  ~/projects/app/ user@server:~/projects/app/
```

That's a lot to type for "send this folder there."

**sync-rs** wraps rsync with sensible defaults:

```bash
sync-rs ~/projects/app server
```

<!-- TODO: Add screenshot of sync in progress -->

## The Scenario

You're working locally and need to sync code to a dev server. Or you've run experiments on a GPU machine and need to pull results back. Or you're setting up a new laptop and want to copy config files from another machine.

The workflow is always: local path, remote host, go. The details - exclusions, flags, path mapping - are usually the same.

## What It Does

**Path mapping**: Your local home is `/Users/you`, the remote is `/home/you`. sync-rs handles this translation automatically. `~/projects/app` syncs to the equivalent path on the remote.

**Default exclusions**: `.git/`, `node_modules/`, `target/`, `.DS_Store` - the usual suspects you never want to sync.

**SSH config integration**: Uses hostnames from `~/.ssh/config`. No need to type full user@host strings.

**Bidirectional**: Push by default. Pull with `--pull`:
```bash
sync-rs --pull ./results server
```

## Dry Run

Before syncing, preview what would happen:

```bash
sync-rs -d ~/projects/app server
```

Shows files that would be added, modified, or deleted. Useful for sanity-checking before overwriting anything.

<!-- TODO: Add screenshot of dry-run output -->

## Host Picker

Don't remember the exact hostname? Omit it:

```bash
sync-rs ~/projects/app
```

A fuzzy-search picker shows all hosts from your SSH config.

<!-- TODO: Add screenshot of host picker -->

## Installation

```bash
cargo install --git https://github.com/JiwanChung/sync-rs
```

Requires `rsync` and `ssh` in PATH.

---

[GitHub](https://github.com/JiwanChung/sync-rs)
