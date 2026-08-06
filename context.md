# Project Context

## What this is

Sungyoung Moon's personal resume/profile website — a **custom static site** built from scratch
with plain HTML/CSS/JS (no framework, no build step). It replaced the Hugo Academic CV template
this repo originally contained; that template is still recoverable from git history (the
"Initial commit").

- **Owner:** Sungyoung Moon (sungyoungmn@gmail.com, github.com/sungyoungmoon)
- **Live at:** https://sungyoungmoon.com (custom domain) and https://sungyoungmoon.github.io
- **Remote:** https://github.com/sungyoungmoon/sungyoungmoon.github.io.git (local `main` tracks `origin/main`)
- **Predecessor site:** the same sungyoungmoon.com domain used to serve a **Hugo Academic site
  from the separate `sungyoung` repo, built and hosted on Netlify**. Several GIFs and the AGS
  logo were taken from it, and its layout inspired the current sidebar structure. That repo is
  untouched and still holds the old site if it's ever needed.

## Hosting & deploy

- **GitHub Pages, branch-based:** source is `main` / `/` (`build_type: legacy`). There is **no
  Actions workflow** and none is needed — every push to `main` republishes the repo root.
- `.nojekyll` at the root stops Pages from running the files through Jekyll.
- `CNAME` at the root holds `sungyoungmoon.com`, which is what attaches the custom domain.
  Deleting it detaches the domain — don't.
- **DNS:** registered at Namecheap, using Namecheap BasicDNS (moved off Netlify DNS on
  2026-08-06). Apex has four A records to GitHub's `185.199.108–111.153`; `www` is a CNAME to
  `sungyoungmoon.github.io.`
- **Pushing workflow files is blocked.** The `gh` token has `gist, read:org, repo` but not
  `workflow`, so any push that creates or updates a file under `.github/workflows/` is rejected
  by the remote (deletions are fine). Run `gh auth refresh -h github.com -s workflow` if that
  ever becomes necessary.

## Working rules (standing, from the user)

1. **Never `git commit` or `git push` unless the user explicitly asks in that conversation.**
2. **Never reword the user's copy.** They supply their own text; vague requests like "make it
   crisp" / "make it better" mean **visual/layout changes only**, not editing their words.
3. **Bump the cache-busting version on every CSS/JS/image change** — `style.css?v=N`,
   `site.js?v=N`, `images/x.png?v=N`. The user hit a stale-cache "IT LOOKS LIKE OLD UI" once;
   always bump, then verify with a hard reload or headless screenshot.

## Architecture — one scrolling page

Design went: long single page → 3 separate pages → **merged back into ONE scrolling page**
(user: "if you drag down i want to show experience and project like sungyoungmoon.com").

```
<header>  sticky frosted nav — brand · Home/Experience/Projects anchors ·
          Resume (opens the PDF in a new tab) · ◐ theme toggle
<main>
  .layout.container            ← CSS grid: 300px sidebar + content
    <aside.sidebar>            ← sticky on desktop, stacks centered on mobile
      profile photo (150px circle), name, role, location, hairline rule,
      3 circular social icon buttons (email / GitHub / LinkedIn), "View Resume ›"
      NOTE: no card background/border/shadow — user: "NO BOX FOR THAT"
    <section.content>
      About  — 3 paragraphs, <strong> on key phrases only
      .two-col — Education | Skills side by side (stacks below 900px)
  .container.content-full      ← full-width, outside the sidebar grid
      Experience — .xp-list, 7 .xp-item cards on a vertical timeline rail
      Projects   — 4 featured .project-card in a grid
      Independent Projects — 3 GIF cards
<footer>  Email · GitHub · LinkedIn · Resume + © 2026
```

Preview locally with `python3 -m http.server 3000` in the repo root, then
http://localhost:3000/index.html.

## Files

```
index.html                       The entire site (single page, anchor sections)
style.css                        All styling — Apple-inspired, light + dark themes
site.js                          Theme toggle · nav scrollspy · IntersectionObserver reveals
context.md                       This file
.github/workflows/deploy.yml     GitHub Pages deploy of repo root on push to main
files/Sungyoung_Moon_Resume.pdf  Resume PDF — 2 pages, from ~/Desktop/"Resume - Sungyoung_Moon.pdf".
                                 Linked from three places, all at ?v=3: the nav "Resume", the
                                 sidebar "View Resume ›" (both open in a new tab), and the footer
                                 "Resume" (has `download`, so it saves instead of opening).
images/
  profile.jpg      User's GitHub avatar (hiking photo)
  skhynix.png      SK hynix logo
  skax.png         SK AX USA logo (skaxusa.com)
  sgs.png          SGS logo (food-safety.com), cropped
  ags.svg          Alpha Gamma Sigma logo (taken from sungyoungmoon.com)
  rokarmy.png      Republic of Korea Army emblem
  kmong.png        Kmong logo
  jsoe.png         UC San Diego Jacobs School tile — hand-composed (blue, LinkedIn-style)
  smc.png          Santa Monica College tile — hand-composed (school blue)
  reportai.png     Report AI app icon (user-provided)
  marketai.png     Market Intelligence AI app icon (user-provided)
  meetingai.png    Meeting AI app icon (user-provided)
  happyplant.gif   Happy Planting demo (from sungyoungmoon.com)
  teaching.gif     K-12 teaching project (from sungyoungmoon.com)
  successorator.gif Custom-built 14-frame demo GIF (no original existed)
```

## Design system

- **Typography:** system stack (`-apple-system, BlinkMacSystemFont, 'SF Pro Text', …`).
  Global `p, li { text-wrap: pretty }` and `h1,h2,h3 { text-wrap: balance }` to kill orphans.
  `&nbsp;` is used inside multi-word units (e.g. `Software&nbsp;Engineer`, `Gemini&nbsp;API`)
  to force wraps at sensible points — the user has flagged bad line breaks more than once.
- **Color:** accent `#0071e3` light / `#2997ff` dark; `#f5f5f7` alt background;
  `--text-secondary` is `#55555a` light / `#c7c7cc` dark. Those secondary values were
  **deliberately darkened/brightened** from the original Apple greys — user: "too light so
  i can't see well." Don't lighten them again.
- **Shape:** 18–22px card radius, 980px pill radius, frosted nav
  (`backdrop-filter: saturate(180%) blur(20px)`).
- **Theming:** three token sets — `:root`, `@media (prefers-color-scheme: dark)`, and manual
  `:root[data-theme='light'|'dark']` overrides that beat the system preference. The ◐ toggle
  persists to `localStorage` under key `theme`.
- **Motion:** IntersectionObserver scroll reveal with 90ms stagger between siblings, guarded by
  `prefers-reduced-motion`. Inspired by apple.com/macbook-pro, which the user cited twice.
  **`sweepReveals()` in site.js is a required fail-safe, not an optimization.** `.reveal` sets
  `opacity: 0`, so any element the observer never reports stays invisible *forever*. Opening the
  page at a hash (`/#experience`) did exactly that — verified: `.about-body` computed opacity was
  `0` on a hash load vs `1` on a plain load, i.e. a blank page. The sweep runs at startup, on
  `load`, and on `hashchange`, showing anything already at or above the fold. Don't remove it.
  (Note: headless-Chrome screenshots are unreliable for fragment URLs — the sticky nav renders
  at the wrong offset — so verify this with DOM instrumentation, not screenshots.)
- **Mobile (`max-width: 760px`):** the nav becomes a **single row with an iOS-style segmented
  control** — `.nav-links` gets a `--seg-bg` track at 980px radius and the `.active` link becomes
  a raised `--card` chip with `--seg-chip-shadow`. `.brand` is `display: none` here on purpose:
  the profile block repeats the name ~20px below it, and that duplication is what made the old
  two-row bar look cluttered. Also: `scroll-padding-top: 4.5rem` (matches the 3.15rem nav),
  timeline rail hidden, `.xp-item` goes column-direction, `.project-grid` collapses to one
  column. A separate `max-width: 900px` rule stacks `.two-col` with a `1.25rem` gap (fixes a
  card-overlap bug). Type in the segmented control is sized to fit four items at 390px — adding
  a fifth would overflow.

## Site content (all real — never use placeholder text)

**Header:** Sungyoung Moon · Software Engineer · San Jose, California
Page `<title>` and meta description use the fuller **"Software Engineer, AI Applications"**;
the sidebar shows just "Software Engineer" (user removed the specialty label from there).

**Experience (7 entries, reverse-chronological):**
1. **Software Engineer, AI Applications** — SK hynix America, San Jose · May 2026–Present
   *(featured card: blue-tinted gradient + accent border)*. Gist + 3 capability notes
   (Ollama/vLLM, RAG, LoRA) + 5 bullets (Report AI, Market Intelligence AI, Meeting AI,
   model-performance work, AI Hub).
2. **MES Software Engineer** — SK AX USA, Glendale KY · Jul 2025–Apr 2026
3. **OTA Engineer, Part-Time** — SGS North America, San Diego · Jun 2024–Jun 2025
4. **Web Developer** — Alpha Gamma Sigma, Santa Monica College · Sep 2019–Jun 2021
5. **Administrative Support Specialist, Sergeant** — Republic of Korea Army · Dec 2014–Sep 2016
6. **Technical Consultant, Self-employed** — Kmong Inc. · Jan 2013–Dec 2014
7. **Founder** — Gaming / Anime Community Website · Oct 2010–Dec 2014 (100k+ users, 40M+ visits).
   Uses a 🎮 emoji tile — a custom SVG logo was tried and **rejected**; don't reintroduce it.

**Projects — "Internal AI applications built at SK hynix America."** 4 cards, each with an icon
tile, tech tag, one-sentence tagline, and a collapsed `<details>` "Highlights" list:
Report AI · Market Intelligence AI · Meeting AI · AI Hub.

**Independent Projects:** Happy Planting Device (C++/Arduino) · Successorator planner app
(Java/Android — links to the `to-do-list` repo, since no `successorator` repo exists) ·
Teaching Computer Science to K-12 Students (links to the UCSD project site).

**Education:** UC San Diego, B.S. Computer Science, 2025 (Jacobs School) · Santa Monica College,
2021, Overall GPA 4.0. Year only — user: "JUST SAY 2025 NOT MARCH". No coursework/activities
disclosures; those live in the resume PDF.

**Skills** — three labelled lines, verbatim from the user:
- AI & LLM: Qwen, Llama, EXAONE, Gemini API, Ollama, vLLM, RAG architectures, Familiarity with LoRA
- Languages & Frameworks: Python, C#, SQL, FastAPI, .NET, WinForms, Java, C++, HTML, CSS
- Databases & Testing: Oracle Database, EMQuest, 5G FR1/FR2 OTA Testing, Regulatory Testing

## Things the user explicitly rejected (don't re-add)

- A box/card around the profile sidebar
- Project demo GIFs, hover-lift effects, and metric badges on the featured project cards
  (built once, then "go back")
- A custom SVG logo for the Gaming/Anime entry
- The "Now" card, the "More" coursework disclosures, and the Activities list
- "Download Resume" as button copy (now "View Resume ›")
- A click-to-copy email pill in the sidebar
- The `AI APPLICATIONS` label under the sidebar role

## Known loose ends

- The Successorator card points at the `to-do-list` GitHub repo — rename or repoint if a
  dedicated repo ever exists.
- `images/successorator.gif` is synthetic (hand-built frames), not a real screen recording.
