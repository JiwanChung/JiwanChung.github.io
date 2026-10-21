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
- `featured_rank` — a number puts it in the homepage *Featured Research* cards,
  ordered by that number; omit it to leave the paper unfeatured.
  `featured_summary` is the one-line blurb shown on that card
- `short_name` — optional label shown before the title (e.g. `MathLens`), for
  papers referred to by that name elsewhere on the site
- `note` — optional italic line shown under the venue
- `keywords` — rendered as clickable chips that filter the publication list
- `bibtex` — optional, renders a copy button
- `paper_pdf`, `code`, `data`, `model`, `webpage`, `video` — each renders an icon
  link if present

Entries in `_data/experience.yaml` need `category: work` (shown under
*Research Experience*) or `category: education` (shown under *Education*); an
entry with any other category renders nowhere.

The website and the CV are **separate stores**. A paper added here does not
appear in the CV PDF, and vice versa.

## CV

`assets/papers/cv.pdf` — the PDF this site links from the header CV button and
the nav bar — is the generic two-page CV from `~/projects/cv/manual`, not built
in this repo. To update it, build that CV there (see its README) and copy
`Jiwan_Chung_CV.pdf` over `assets/papers/cv.pdf`.

`cv/` holds the older multi-page academic CV. It is no longer served, and its
`build.sh` has no `publish` step, so building it never touches the site.

## Layout

```
_data/       content (yaml)
_layouts/    page shells; default.html has the nav, head, footer
_includes/   gallery, analytics, and experience-entry partials
_posts/      blog posts
_poems/      poems collection
libs/custom/ my_css.css, my_js.js (filters, bibtex toast)
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
  - Icons: [Font Awesome](http://fontawesome.io/), [Academicons](https://jpswalsh.github.io/academicons/)
- JS
  - [jQuery (3.1.1)](https://jquery.com/)
  - [KaTeX](https://katex.org/) — math rendering

Based on [Martin Saveski](https://web.media.mit.edu/~msaveski/)'s
[template](https://github.com/msaveski/www_personal).
