# emeka-website-v2

Personal site for Emeka Momodu. Dark terminal theme, single page, typed intro
animation.

No build step, no dependencies, no framework. Three files:

```
index.html   all content and structure
styles.css   theme, layout, responsive rules
main.js      typing intro, scroll reveals, nav highlighting, copy button
```

## Run locally

Open `index.html` in a browser, or serve it:

```sh
python3 -m http.server 8000    # then visit http://localhost:8000
```

## Deploy

Any static host. The whole site is the three files above.

- **Netlify / Vercel** — drag the folder onto the dashboard, or connect the repo.
- **GitHub Pages** — push to `main`, then Settings → Pages → deploy from `main`, root.
- **Cloudflare Pages** — connect the repo, leave the build command blank, output dir `/`.

Point `emekamomodu.com` at whichever you choose.

## Editing content

All copy lives in `index.html`. Sections are marked with banner comments
(`══ PROJECTS ══` and so on).

- **Projects** — each is one `<li class="card">`. Copy a block to add another;
  keep the `card__idx` numbers in order.
- **Skills** — one `<div class="skillset">` per group, tags are `<li>` items.
- **About** — lives only in the typed hero intro (`#intro`), not as a separate
  section. Edit the `cat about.txt` output block.
- **Experience** — there's a ready-made section commented out above Skills. Your
  old site didn't list employers or dates, so nothing was filled in. Add real
  entries, delete the comment markers, and add
  `<li><a href="#experience">experience</a></li>` to the nav.
- **Colors** — the palette is CSS custom properties at the top of `styles.css`.

The typed intro replays whatever is already in the `#intro` markup, so editing
that HTML is enough — no matching strings in `main.js` to keep in sync.

## Notes

- Works with JavaScript disabled: content is in the HTML, JS only animates it.
- Honours `prefers-reduced-motion` — the typing and reveals are skipped, and the
  cursor stops blinking.
- Keyboard accessible, with a skip link and visible focus rings.
- Has a print stylesheet, so ⌘P produces a passable one-pager.
