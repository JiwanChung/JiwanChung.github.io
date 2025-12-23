---
layout: post
title: "vat: A Semantic File Viewer"
date: 2025-01-06
tags: [rust, cli, tui]
---

`cat` shows bytes. For a JSON config file, that means a wall of unformatted text. For a CSV, columns don't align. For a SQLite database, it's binary garbage.

**vat** renders files based on their structure. JSON becomes a collapsible tree. CSV becomes a table. SQLite shows the schema and lets you browse tables.

<!-- TODO: Add screenshot of JSON tree view -->

## The Scenario

You need to inspect a JSON file. `cat config.json` scrolls past. You could pipe to `jq`, but you need to remember the query syntax to drill down. You could open it in an editor, but that's heavyweight for a quick look.

Or: you have a CSV export and want to see what's in it. `cat data.csv` shows rows, but columns don't line up and headers scroll away.

Or: you have a SQLite database from some app and want to peek at its structure without firing up a database client.

vat handles all of these with one command.

## How It Works

```bash
vat config.json      # Collapsible tree
vat data.csv         # Aligned table
vat app.db           # Schema browser
```

<!-- TODO: Add screenshot of CSV table -->

The format is detected automatically. Navigation uses vim keys: `j/k` to move, `Enter` to expand/collapse, `/` to search.

## Supported Formats

- **Structured**: JSON, YAML, TOML, XML, HTML
- **Tabular**: CSV, TSV, Parquet, JSON Lines
- **Databases**: SQLite (browse schema and data)
- **Archives**: ZIP, TAR (list contents without extracting)
- **Config files**: INI, .env, Dockerfile, Makefile
- **Lock files**: Cargo.lock, package-lock.json, pnpm-lock.yaml
- **Code**: Syntax highlighting for common languages
- **Binary**: Hex viewer
- **Images**: ASCII art preview

## Pipe-Friendly

When stdout isn't a terminal, vat outputs plain text:

```bash
vat data.json | grep "error"   # Works
vat file.csv | head -20        # Works
```

The `-p` flag forces plain output even in a terminal.

<!-- TODO: Add screenshot of SQLite browser -->

## Installation

```bash
cargo install --git https://github.com/JiwanChung/vat
```

---

[GitHub](https://github.com/JiwanChung/vat)
