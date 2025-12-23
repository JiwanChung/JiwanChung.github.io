---
layout: post
title: "Shepherd: Resilient Slurm Job Management"
date: 2025-01-04
tags: [python, slurm, ml, hpc]
---

Shared GPU clusters have a reliability problem. Nodes go down. GPUs throw memory errors. Jobs get preempted. Partitions fill up. Each failure requires someone to notice, diagnose, and resubmit manually.

**Shepherd** automates the recovery loop: detect failures, blacklist bad nodes, find alternative resources, resubmit.

<!-- TODO: Add screenshot of TUI -->

## The Scenario

You submit a training job before leaving for the day. Overnight, the node crashes. The job dies. You find out the next morning when you check - hours of potential training time lost.

Or: your job keeps failing on the same node. You manually exclude it, resubmit, and it fails again on a different node. Eventually you learn that an entire rack has a faulty switch.

Or: your preferred partition is overloaded. Jobs sit pending for hours. Another partition has capacity, but you don't notice because you always submit to the same one.

Shepherd handles all of these automatically.

## How It Works

Add directives to your script:

```bash
#!/bin/bash
#SHEPHERD --gpus 4 --min-vram 40

python train.py --checkpoint-dir ./checkpoints
```

Submit with:
```bash
shepherd train.sh
```

Shepherd wraps your script with monitoring:
- **Heartbeats** detect unresponsive jobs
- **GPU checks** catch CUDA errors early
- **Exit code analysis** distinguishes crashes from successful completion

A background daemon watches the job and handles recovery.

<!-- TODO: Add screenshot of failure recovery -->

## Automatic Blacklisting

When a node causes a failure, Shepherd temporarily blacklists it. The next submission avoids that node.

Blacklists have a TTL - they expire automatically. A node that fails once might have had a transient issue. A node that fails repeatedly stays blacklisted longer.

## Partition Failover

Shepherd auto-discovers partitions matching your requirements. Need 4 GPUs with 80GB VRAM? It finds all qualifying partitions and sorts by availability.

If your first-choice partition fails (full queue, node issues), it automatically tries alternatives.

<!-- TODO: Add screenshot of partition selection -->

## The TUI

```bash
shepherd
```

Shows all your jobs with status, assigned nodes, and live logs. Navigate with keyboard, restart or stop jobs, manage blacklists.

<!-- TODO: Add screenshot of log viewer -->

## Installation

```bash
git clone https://github.com/JiwanChung/shepherd.git
cd shepherd && uv tool install .
```

Zero external dependencies. Python 3.9+.

---

[GitHub](https://github.com/JiwanChung/shepherd)
