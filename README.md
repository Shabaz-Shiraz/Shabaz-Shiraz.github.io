# Shabaz Shiraz | Android Developer

Personal portfolio of Shabaz Shiraz, an Android developer in Kochi, India.

**Live site:** https://shabaz-shiraz.github.io

A single-page static site in plain HTML, CSS and JavaScript, with no build step
or libraries. It is served by GitHub Pages from the root of the `main` branch.

## Contents

```
index.html              all page content: hero, stats, about, experience,
                        projects, skills, certifications and contact
404.html                page shown for unknown addresses
assets/css/style.css    design tokens (light and dark themes), layout, animations
assets/js/main.js       scroll progress, reveals, count-up, typing card,
                        timeline, card spotlight, mobile menu, theme toggle
assets/img/             portrait and favicon
assets/resume/          resume PDF linked from the Download resume buttons
robots.txt, sitemap.xml search engine hints
.nojekyll               serve files as they are, without Jekyll
```

## Updating the site

- **Text:** edit `index.html`. Each section is marked with a comment.
- **Resume:** replace `assets/resume/Shabaz_Shiraz_Android_Developer.pdf`,
  keeping the same file name.
- **Photo:** replace `assets/img/portrait.webp` and `assets/img/portrait.png`.
- **Play Store links:** the client projects link to a Google Play search for
  now. Search for `PLAY STORE` in `index.html` and paste each exact app URL.

Every push to `main` goes live within a minute or two.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder
and visit http://localhost:8000.

## Motion

Hero entrance, drifting glows, rotating orbits, floating chips, a typing code
card, a scrolling tech strip, scroll reveals, count-up stats, a timeline that
fills as you scroll, a cursor spotlight on project cards, a scroll progress bar
and a theme cross-fade. All of it is turned off for visitors who prefer reduced
motion.
