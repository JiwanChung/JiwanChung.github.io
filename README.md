# Jiwan Chung's Website

Source for [jiwanchung.github.io](https://jiwanchung.github.io). Jekyll site,
served by GitHub Pages straight off the `main` branch — push and it rebuilds.

Content lives in `_data/*.yaml`; the pages are templates that loop over it.
For most updates you never touch HTML.

## Updating content

| Change | Edit |
| --- | --- |
| Name, email, social links | `_data/main_info.yaml` |
| Publications | `_data/publications.yaml` |
| Positions, education | `_data/experience.yaml` |
| Albums (Personal Life page) | `_data/albums.yml` |
| Bio, section copy | `index.html` |
| Blog posts | `_posts/` |
| Poems | `_poems/` |

Test locally with `jekyll serve` (no Gemfile — uses the system install).

### Adding a publication

Add an entry to `_data/publications.yaml`. Fields:

- `title`, `authors` (wrap your own name in `<b>…</b>`), `venue`, `year`
- `type` — `conference` or `preprint`; drives the color dot and the type filter
- `selected` — `y` puts it in the *First Author* tab, `n` leaves it in *Archive*
- `keywords` — feeds the d3 keyword map
- `bibtex` — optional, renders a copy button
- `paper_pdf`, `code`, `data`, `model`, `webpage`, `video` — each renders an icon
  link if present

Two couplings to know about:

- **Featured cards** on the homepage are matched by *exact title string* in the
  hardcoded list at `index.html:35`. Retitle a paper and it silently drops off
  the homepage.
- **The keyword map** (`libs/custom/my_js.js`) shows the top 30 keywords and
  bins them into six colored categories by substring match (`my_js.js:110-130`).
  A keyword matching no category still renders, just uncategorized.

The website and the CV are **separate stores**. A paper added here does not
appear in the CV PDF, and vice versa.

## CV

`cv/` holds a LaTeX CV that builds into `assets/papers/cv.pdf` — the PDF this
site links from the Vitæ section. It's excluded from the Jekyll build, so the
`.tex` sources never ship.

Build and ship a new CV with `cv/build.sh publish`. That's the only variant that
copies the PDF into `assets/`; a plain `build.sh` leaves the served PDF stale.

Adding a publication to the CV takes three coordinated edits, and skipping any
of them fails quietly. See `cv/CLAUDE.md` before touching it.

## Layout

```
_data/       content (yaml)
_layouts/    page shells; default.html has the nav, head, footer
_includes/   gallery + analytics partials
_posts/      blog posts
_poems/      poems collection
libs/custom/ my_css.css, my_js.js (keyword map, filters, bibtex toast)
libs/external/ vendored deps
cv/          LaTeX CV -> assets/papers/cv.pdf
```

`_data/projects.yaml`, `_data/template_users.yaml`, and `_data/films.yml` render
nowhere — the first two are upstream-template leftovers, and no template consumes
`site.data.films`. `__deploy.sh` is likewise vestigial: it copies `_site` into the
parent directory, which is not how this site deploys. `backup/` holds the previous
version of the site and is excluded from the build in `_config.yml`.

## External libraries

- Framework: [Jekyll](http://jekyllrb.com/)
- CSS
  - [Skeleton](http://getskeleton.com)
  - Tabs: [Skeleton Tabs](https://github.com/nathancahill/skeleton-tabs)
  - Experience: [Timeline](https://codepen.io/NilsWe/pen/FemfK)
  - Icons: [Font Awesome](http://fontawesome.io/), [Academicons](https://jpswalsh.github.io/academicons/)
- JS
  - [jQuery (3.1.1)](https://jquery.com/)
  - [D3 (v7)](https://d3js.org/) — research keyword map
  - [KaTeX](https://katex.org/) — math rendering

Based on [Martin Saveski](https://web.media.mit.edu/~msaveski/)'s
[template](https://github.com/msaveski/www_personal).
