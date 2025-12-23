---
layout: post
title: "claude-tools: Managing Multiple Claude Code Sessions"
date: 2025-01-03
tags: [rust, cli, ai, productivity]
---

Claude Code works well autonomously, but it still needs human input - permission approvals, clarifying questions, or just the next instruction. With one session, this is manageable. With several running in parallel across tmux panes, it becomes a game of "which one needs me?"

**claude-tools** provides a dashboard that shows all your Claude Code sessions at once.

<!-- TODO: Add screenshot of monitor dashboard -->

## The Scenario

You're working on a project with multiple moving parts. One Claude session handles the backend, another the frontend, a third is running tests. They're all in separate tmux panes.

Every few minutes, you tab through the panes to check status:
- Is this one still working, or waiting for input?
- Did that one ask for permission to run something?
- Which session have I not checked in a while?

This context-switching adds up. The dashboard eliminates it.

## Monitor

```bash
claude-tools monitor
```

Each session shows:
- **Status**: Working, Waiting, or Permission Required
- **Tokens used** in the current session
- **Time** in the current state

When a session needs permission, press `y` to approve without leaving the dashboard.

<!-- TODO: Add screenshot showing permission prompt -->

## Beyond Monitoring

Once you're tracking sessions, other questions come up:

**How much am I spending?** The budget command tracks token usage:
```bash
claude-tools budget status
claude-tools budget set --daily 100000
```

**Can I restore a closed session?** The resume command lists recent sessions:
```bash
claude-tools resume list
claude-tools resume restore <id>
```

**How do I keep CLAUDE.md consistent across projects?** The sync command manages a master guidelines file:
```bash
claude-tools sync push   # Push to all projects
```

## How It Works

Everything runs locally. The monitor reads tmux pane content. Token tracking parses session logs from `~/.claude/`. No API calls, no external services.

## Installation

```bash
cargo install --git https://github.com/JiwanChung/claude-tools
```

Requires tmux. Works on macOS and Linux.

---

[GitHub](https://github.com/JiwanChung/claude-tools)
