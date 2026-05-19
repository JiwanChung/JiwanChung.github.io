# CV — build & edit protocol

LaTeX CV in this directory. `main.tex` is the entry point; section bodies are
`\input`'d from sibling `.tex` files, and the publication lists are pulled from
`ref_conf.bib` and `ref_preprint.bib` via biblatex (biber backend, nature style,
custom drivers).

## Build

- `./build.sh` — incremental (`latexmk -pdf`)
- `./build.sh clean` — remove aux/pdf
- `./build.sh full` — clean then build; use when changing `\nocite{}`, sorting,
  or the custom drivers, since stale `.bbl` can mask the change
- `./build.sh publish` — full build, then copy `main.pdf` to
  `../assets/papers/cv.pdf` (the path the website serves). Use this when
  shipping a new CV; otherwise the served PDF drifts from the source.

Output is `main.pdf`. Build runs biber, so the `.bcf` → biber → `.bbl` cycle has
to complete; one `latexmk` invocation handles that.

## Adding a publication — the protocol that bites

Adding an entry to a `.bib` file is **not enough on its own**. Three places
typically need to move together:

1. **Add the entry** to the right `.bib`:
   - Peer-reviewed conference → `ref_conf.bib` (use `@inproceedings`, set
     `booktitle`)
   - Preprint → `ref_preprint.bib` (use `@article`, set `journal`)
2. **Add the cite key to `\nocite{...}` in `main.tex`.** biblatex only prints
   cited entries; without this, the entry silently disappears from the PDF.
   Find the `\nocite` in the matching section (Conference Papers around
   `main.tex:245,252`; Preprints around `main.tex:265,272`). Each section is
   split into two `refsection` blocks — pick the one for the layout slot you
   want.
3. **If the venue string is new**, add a case to the matching venue macro so it
   renders as a styled badge instead of the raw journal/booktitle string:
   - Preprints (arXiv IDs etc.) → `\cvvenuejournal` (`main.tex:139`). Add one
     `\iffieldequalstr{journaltitle}{<exact string>}{...}{%` line **and add one
     more `}` to the trailing brace run** that closes the cascade.
   - Conferences → `\cvvenuebooktitle` (`main.tex:124`). Same pattern, matching
     on `booktitle`. The match string must equal the bib `booktitle` **exactly**
     — including any `": ACL"` / `": ICLR"` suffix.

If you skip (3), the entry still appears, but with the raw `arXiv preprint
arXiv:XXXX.YYYYY` (or full conference proceedings name) instead of the badge.

**Watch out for year-ordinal venues.** Some conferences embed a year-specific
ordinal in their official proceedings title — e.g., `"The 39th Annual AAAI
Conference on Artificial Intelligence: AAAI"` vs `"The 40th ..."`, or `"The
Thirteenth International Conference on Learning Representations"` vs the
inevitable `"Fourteenth"`. The cascade uses exact-match, so adding *next year's*
AAAI/ICLR/ICML paper means **adding a new line to `\cvvenuebooktitle`**, not
reusing the existing one. After the rebuild, grep the PDF text (or check the
visual list) for the full proceedings title — if it shows up, you have an
unmapped variant.

## Bold-author convention (the Jiwan hack)

`\DeclareNameFormat{author}` at `main.tex:72` bolds any author whose family name
is `Chung` and given name is `Jiwan`. There's also a second case for
`Chung$\dagger$` + `Jiwan` so equal-contribution daggers come through bold too.

In bib files:
- Normal authorship → `author={Chung, Jiwan and ...}`
- Equal-contribution → `author={Chung$\dagger$, Jiwan and ...}` (the `$\dagger$`
  must be in the family-name field, not appended to the given name)

The `\dagger` legend is printed once in the Conference Papers section header
(`main.tex:240`).

## Section structure

- **Research Profile / Education / Research Experience / Awards / Service** —
  plain `\input{<file>.tex}`. Edit those files directly.
- **Selected Research** (`main.tex:205-229`) — **hand-curated longtable, not
  pulled from bib.** Four entries written inline with year, title, venue, and a
  one-paragraph contribution summary. Update by editing the longtable rows.
- **Conference Papers** and **Preprints** — bibliography-driven via biblatex.
  Each section is split into two `refsection` blocks; this is a layout choice
  (the split lets you control which entries land where in the visual list /
  across pages). Each block has its own `\nocite{}` list and is sorted by the
  custom `cvyear` template (descending year, then title).

### Unused subfiles

`advising.tex`, `exp_other.tex`, `media.tex`, `teaching.tex`, `tools.tex` exist
in this directory but are not currently `\input`'d from `main.tex`. They're
either deprecated or staged for future use — don't assume edits there will show
up in the PDF.

## Custom drivers

`\DeclareBibliographyDriver{inproceedings}` (`main.tex:163`) and
`{article}` (`main.tex:170`) define the per-entry layout: bold title, authors,
styled venue, bold year. If you want to change how a publication entry looks,
this is the place — not the bibliography style or per-entry fields.

## Things not to do

- Don't add fallback rendering in the venue macros (e.g., a regex that strips
  `"arXiv preprint arXiv:..."` automatically). The explicit per-ID cascade is
  intentional — it makes the rendered output auditable and forces a conscious
  decision on each new venue. A regex fallback would silently relabel anything
  arXiv-shaped, including future things that shouldn't be relabeled.
- Don't `\nocite` a key that isn't in either `.bib` file — biber will emit a
  warning and the entry just won't appear, but the warning is easy to miss
  inside `latexmk` output.
- Don't edit `main.bbl` / `main.aux` / `main.bcf` / `main.fdb_latexmk` / `.log`
  by hand — they're build artifacts and overwritten on every run. They're
  tracked in git, but treat them as generated.
