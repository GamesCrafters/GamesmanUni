# GamesmanUni UI Overhaul — Integration Design Doc
**Status:** In Progress | **Target:** Cal Day, Saturday April 19 2026
**Branch:** `ui-calday-update`
**Author:** Allena
**Implementer:** Claude Code

---

## 1. Context & Goal

Integrate Allena's UI overhaul (pure HTML/CSS/JS) into the live GamesmanUni Vue 3 repo as clean, minimal edits — not a fork or separate repo. The UI changes land in the **frontend presentation layer only**. All backend connections, game logic, API calls, Vuex store, and router stay completely untouched.

**Longevity principle:** Future students should be able to open any `.vue` file or `.scss` file and understand what changed and why. UI code should be readable, not clever.

---

## 2. Tech Stack (GamesmanUni Repo)

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API + Options API mix) |
| Language | TypeScript |
| Build tool | Vite 2 |
| Package manager | Yarn 3 |
| State management | Vuex 4 |
| Routing | Vue Router 4 |
| Styling | SASS (.scss) |
| i18n | vue-i18n 9 |
| Animation | GSAP |
| PWA | vite-plugin-pwa |

---

## 3. UI Overhaul — Reference Files

| File | Role |
|---|---|
| `gamesmanuni_base.html` | Home + Games browser + About — primary layout reference |
| `gamesmanuni_anniversary.html` | Anniversary hero variant (shirt carousel) — post-Cal Day |
| `ticTacToe.html` | Concept-only. **Do not implement.** Game page is out of scope. |
| `index.html` | Navigation index only. Not implemented in the repo. |

### Theme System — Critical Architecture

GamesmanUni already has a full theme system. All colors are expressed as CSS custom properties set by theme files in `src/styles/themes/`. The global `_index.scss` uses variables like `--primaryColor`, `--backgroundColor`, `--neutralColor`, `--secondaryColor` everywhere.

**The UI overhaul must use these existing variables, not hardcoded hex values.** This ensures all existing themes (Light, Dark, Cal, Classic, Blackboard, Greenboard, Rose, Sepia, Space, Terminal) continue to work on the new layout automatically.

The `_cal.scss` theme is the visual reference for the overhaul:
```scss
$backgroundColor: #003262;   // Cal navy — maps to nav bg, hero bg
$primaryColor:    #fdb515;   // Cal gold — maps to accent bar, buttons, highlights
$secondaryColor:  #ffffff;   // White — maps to text on dark bg
$neutralColor:    #46535e;   // Slate — maps to borders, muted elements
```

### Variable Mapping for New UI Elements

| New UI element | Use this existing variable |
|---|---|
| Nav background | `var(--backgroundColor)` |
| Nav accent bar gradient | `var(--primaryColor)` for gold, `var(--backgroundColor)` for navy ends |
| Hero background | `var(--backgroundColor)` |
| Hero title text | `var(--secondaryColor)` |
| Hero eyebrow / stats | `var(--primaryColor)` |
| CTA primary button | `var(--primaryColor)` bg, `var(--backgroundColor)` text |
| Page/body background | `var(--backgroundColor)` with slight opacity or tint |
| Card background | use a light neutral — check Light theme for approach |
| Card text (game name) | `var(--primaryColor)` |
| Nav link text | `var(--secondaryColor)` |
| Nav link hover | `var(--primaryColor)` |
| Footer | `var(--neutralColor)` bg |
| Sidebar chip active | `var(--primaryColor)` |

### Nav Accent Bar Special Case
The accent bar uses a gradient that blends navy and gold. Since these must both respond to theme changes, use the variable for the dominant color and let the gradient midpoint be `var(--primaryColor)`:
```css
background: linear-gradient(
  90deg,
  var(--backgroundColor) 0%,   var(--backgroundColor) 25%,
  var(--neutralColor)    30%,   var(--primaryColor)    38%,
  var(--primaryColor)    62%,   var(--neutralColor)    70%,
  var(--backgroundColor) 75%,   var(--backgroundColor) 100%
);
```
The glint shimmer (`rgba(255,255,255,0.9)`) stays white — that is fine for all themes.

### Fonts
The existing themes already define font families via `$regularFontFamily` and `$fixedWidthFontFamily`. The overhaul adds DM Sans as a new option for the `_light.scss` theme only (or as a new theme). Do not override the font globally across all themes.

Add to `index.html` `<head>` (for DM Sans availability):
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Apply DM Sans only within the scope of the new layout components via scoped styles, not as a global body override. This preserves theme font choices (e.g. Terminal uses a monospace font intentionally).

---

## 4. Confirmed Vue Component Map

Confirmed from running `find src -type f -name "*.vue" | sort` in the local clone.

### Files to edit

| UI Section | Vue file(s) to edit |
|---|---|
| Nav bar | `src/components/units/Header/AppHeader.vue` + `AppHeaderNavigations.vue` |
| Home / Hero | `src/components/views/TheHomePage.vue` + `src/components/units/AppWelcome.vue` |
| Games browser | `src/components/views/TheGamesPage.vue` + `src/components/units/AppGames.vue` |
| Puzzles browser | `src/components/views/ThePuzzlesPage.vue` (mirror same card style as games) |
| About page | `src/components/views/TheAboutPage.vue` + `src/components/units/AppAbout.vue` |
| Footer | `src/components/units/AppFooter.vue` |
| Global tokens + fonts | `index.html` + global `.scss` file (confirm path with `find src -name "*.scss" | sort`) |

### Files that are STRICTLY OUT OF SCOPE — do not touch

| File(s) | Reason |
|---|---|
| `src/components/units/AppGame.vue` | Game play page — UWAPI connected |
| `src/components/units/GameBody/*` | Game board rendering — UWAPI connected |
| `src/components/units/VVH/*` | Visual Value History — UWAPI connected |
| `src/components/units/GameMenu/*` | Game menu — UWAPI connected |
| `src/components/units/DemoMode/*` | Demo mode |
| `src/components/views/TheGamePage.vue` | Game page view |
| `src/store/` | Vuex state |
| `src/router/` | Route config |
| `src/locales/` | i18n strings |
| All `*.ts` files | Logic and API |
| `vite.config.ts`, `tsconfig.json`, `package.json` | Build config |

---

## 5. Critical UI Constraints

### 5.1 Game thumbnail images MUST be preserved
Every game card has a real PNG screenshot of its game board. This is a hard requirement from Professor Dan Garcia.

- The existing `<img>` tag or equivalent that renders the game thumbnail stays in the card template
- Do NOT replace game card images with emoji, icons, SVGs, or color placeholders
- Only restyle the card shell (border-radius, padding, font, background)
- The `:src` binding on the image is preserved exactly — do not alter it

### 5.2 Game card border colors are SEMANTIC — preserve and extend

The border color on each card communicates the GUI status of that game. This is meaningful information, not decoration. The existing color system must be preserved and carried into the new card styles:

| GUI Status | Border Color | Hex |
|---|---|---|
| Animated GUI | Purple | `#9b59b6` (match existing, confirm from source) |
| Artisan GUI | Gold | `#FDB515` |
| Still in Development (no GUI) | Brown | `#a0522d` (match existing, confirm from source) |

**Claude Code instruction:** Read the existing card template and CSS in `AppGames.vue` and `ThePuzzlesPage.vue` to find the exact hex values and class names used for these three border states. Carry those exact values forward into the new card CSS — do not guess or substitute new colors. The border color logic (which class gets applied based on game data) must also be preserved exactly.

These three border states should also become filter options in the new sidebar (see Step 7 and Section 5.4). The filter chip group for GUI type:
- "Animated GUI" chip — filters to purple-bordered cards
- "Artisan GUI" chip — filters to gold-bordered cards  
- "In Development" chip — filters to brown-bordered cards

### 5.2 Game play page is untouched
`ticTacToe.html` was a design concept only and is not being implemented. `TheGamePage.vue` and all `GameBody/` and `VVH/` subcomponents are left completely as-is.

### 5.3 Visual Value History is untouched
The VVH connects directly to the UWAPI. No layout, style, or behavior changes.

### 5.4 Filter sidebar is a new addition — implement carefully
The current site has no sidebar filter. Adding one must:
- Not break or replace the existing search input
- Not interfere with existing Vuex getters that power the games list
- Read `AppGames.vue`'s `<script>` block first to understand how the games list is fetched and filtered before writing any new filter logic

The sidebar has two chip groups:

**Group 1 — GUI Type** (sourced from the semantic border color system in 5.2):
- Animated GUI (purple)
- Artisan GUI (gold)
- In Development (brown)

**Group 2 — Game Style/Solve tags** (from `gamesmanuni_base.html` tag system):
- Style: Blocking, Rearranger, Dartboard, Chasing, Impartial, Partisan, Connection, Majority Control
- Solve: Remoteness, Win By, Mex, Draw Analysis, Unsolved
- Misc: Educational

> **Claude Code instruction:** GUI Type chips are higher priority because the data (GUI status / border color) is already in the game objects. Implement Group 1 first. For Group 2, check whether Style/Solve/Misc tag metadata exists on game store objects before implementing. If not available, skip Group 2 and note it in the progress log.

---

## 6. Implementation Order for Claude Code

Work in this exact order. Run `yarn dev` after each step and verify the app loads and routes correctly before moving on.

### Step 1 — Branch setup
```bash
git checkout -b ui-calday-update
```

### Step 2 — Understand the theme system
Read `src/styles/_index.scss` and `src/styles/themes/_cal.scss` and `_light.scss`. Understand which CSS variables (`--primaryColor`, `--backgroundColor`, `--neutralColor`, `--secondaryColor`) map to which visual roles. All new CSS must use these variables, not hardcoded hex values. See Section 3 variable mapping table.

### Step 3 — Add Google Fonts link to index.html
Add the DM Sans + JetBrains Mono `<link>` tag to `<head>`. Do NOT add a global `font-family` override on `body` — the theme system controls fonts. Apply DM Sans only in scoped component styles where needed.

### Step 4 — (Previously Step 3) Confirm SCSS structure
```bash
find src -name "*.scss" | sort
```
Confirmed: `src/styles/_index.scss` is the global entry, `src/styles/themes/` holds theme files. Do not add new `:root {}` tokens — use the existing variable system.

### Step 5 — Nav bar
Edit `AppHeader.vue` and `AppHeaderNavigations.vue`:
- Nav background: `var(--backgroundColor)`, height 56px, sticky top
- Add `.nav-accent` element: 3px absolute bar at nav bottom with gradient using `var(--primaryColor)` for the gold center and `var(--backgroundColor)` for the navy ends — see Section 7 for full CSS
- Logo text: 17px, `var(--primaryColor)`, font-weight 500
- Nav links: `var(--secondaryColor)`, hover to `var(--primaryColor)`
- Preserve all existing `<router-link>` bindings, `v-if` directives, and right-side controls (language selector, font size, sound toggle, theme dropdown) — restyle only, do not remove

### Step 6 — Home / Hero (base version)
Edit `TheHomePage.vue` and `AppWelcome.vue`:
- Port the dark navy hero (`#0f1e3a`) with left text column (eyebrow, title, stats, CTA buttons) and right inline SVG architecture diagram from `gamesmanuni_base.html`
- Stats (83+ games, 21+ puzzles, 500+ contributors) are hardcoded display strings
- CTA buttons route to `/games` and `/about` using `<router-link>` or `$router.push`
- Port the three info cards in the cream lower section below the hero
- Preserve any existing `<script>` data or computed properties

### Step 7 — Games browser restyling
Edit `AppGames.vue` (and `TheGamesPage.vue` if it wraps the layout):
- Page wrapper background: `var(--bg)`
- Add left filter sidebar with tag chip sections (Style, Solve type, Misc) — full HTML/CSS in `gamesmanuni_base.html`
- Restyle game cards: white background, 10px border-radius — **preserve the existing semantic border color system (purple/gold/brown) exactly as found in the source. Do not replace with a generic `var(--border)`. See Section 5.2.**
- Add navy border on hover only for cards that are not in the "still in development" state (use judgment — hover should not override a meaningful status color in a confusing way; default to keeping the status border and adding a box-shadow on hover instead)
- **Image binding rule: read the existing card template first. Wrap the existing `<img>` in new markup — do not replace it. See Section 8 for the pattern.**
- Restyle the search input (already functional — style only)
- Preserve all `v-for`, `:key`, `:src`, `@click`, and any Vuex-connected bindings

### Step 8 — Puzzles browser restyling
Edit `ThePuzzlesPage.vue`:
- Same card restyling as Step 7
- Same image preservation rule applies

### Step 9 — About page
Edit `AppAbout.vue` and `TheAboutPage.vue`:
- Port the about section from `gamesmanuni_base.html`: eyebrow label, heading, paragraphs, tech stack tag box
- Preserve any existing content or i18n bindings

### Step 10 — Footer
Edit `AppFooter.vue`:
- Restyle to match `gamesmanuni_base.html` footer: cream/tan background, minimal centered link row, 11px font
- Preserve all existing links and i18n bindings

### Step 11 — Final verification
```bash
yarn build
yarn preview
```
Check: all routes load, game thumbnails visible on cards, clicking a game navigates to game page correctly, VVH renders, no console errors.

---

## 7. Nav Accent Bar — CSS Reference

Copy this into `AppHeader.vue`'s `<style scoped>` block. Uses existing theme variables so it responds to theme changes automatically:

```css
.nav-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--backgroundColor) 0%,
    var(--backgroundColor) 25%,
    var(--neutralColor)    30%,
    var(--primaryColor)    38%,
    var(--primaryColor)    62%,
    var(--neutralColor)    70%,
    var(--backgroundColor) 75%,
    var(--backgroundColor) 100%
  );
  overflow: hidden;
}
.nav-accent::before,
.nav-accent::after {
  content: '';
  position: absolute;
  top: -1px;
  bottom: -1px;
  width: 80px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 15%,
    rgba(255, 255, 255, 0.9) 50%,
    rgba(255, 255, 255, 0.15) 85%,
    transparent 100%
  );
  opacity: 0;
}
.nav-accent::before {
  left: 50%;
  animation: glintLeft 55s linear infinite;
  animation-delay: 3s;
}
.nav-accent::after {
  left: 50%;
  animation: glintRight 55s linear infinite;
  animation-delay: 3s;
}
@keyframes glintLeft {
  0%, 95%  { left: 50%; opacity: 0; }
  95.3%    { left: 50%; opacity: 1; }
  97.5%    { left: -80px; opacity: 0.6; }
  98%      { left: -80px; opacity: 0; }
  100%     { opacity: 0; }
}
@keyframes glintRight {
  0%, 95%  { left: 50%; opacity: 0; }
  95.3%    { left: 50%; opacity: 1; }
  97.5%    { left: calc(100% + 20px); opacity: 0.6; }
  98%      { left: calc(100% + 20px); opacity: 0; }
  100%     { opacity: 0; }
}
```

---

## 8. Game Card — Restyling Pattern

**Rule: wrap, don't replace.** Read the existing card template first. Identify the `<img>` tag and its `:src` binding. Then wrap the existing markup in new styled containers — never remove or alter the image binding.

Example pattern (actual binding attributes will differ — read the real file):

```html
<!-- BEFORE (existing, simplified) -->
<div class="game-card" @click="goToGame(game)">
  <img :src="game.imageURL" :alt="game.name" />
  <div class="game-name">{{ game.name }}</div>
</div>

<!-- AFTER (restyle shell only — :src untouched) -->
<div class="game-card" @click="goToGame(game)">
  <div class="game-thumb">
    <img :src="game.imageURL" :alt="game.name" />  <!-- preserved exactly -->
  </div>
  <div class="game-card-body">
    <div class="game-card-name">{{ game.name }}</div>
  </div>
</div>
```

New card CSS to add — uses existing theme variables so all themes work automatically. Border color is NOT set here (preserved from existing GUI status semantic classes):

```css
.game-card {
  /* border-color: preserved from existing GUI status classes (purple/gold/brown) */
  border-width: 2px;
  border-style: solid;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.15s;
}
.game-card:hover {
  /* box-shadow on hover, not border-color — semantic border meaning is preserved */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
.game-thumb {
  height: 108px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--neutralColor);
  overflow: hidden;
}
.game-thumb img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.game-card-body {
  padding: 10px 12px;
}
.game-card-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--primaryColor);
}
```

---

## 9. Decisions Made

| Decision | Rationale |
|---|---|
| Branch: `ui-calday-update` | Clean PR, protects main, reviewable by team |
| Hero: base version (blueprint SVG) | Anniversary carousel blocked on shirt vectorization — post-Cal Day |
| Game play page: out of scope | UWAPI-connected, too much continuity risk |
| VVH: out of scope | Same reason |
| Game card images: preserved exactly | Hard requirement from Prof. Dan Garcia |
| Colors: use existing CSS variables only (`--primaryColor` etc.), no hardcoded hex | All 10 existing themes continue to work on the new layout automatically |
| Nav accent gradient: uses `var(--primaryColor)` + `var(--backgroundColor)` | Adapts to each theme's palette automatically |
| Card hover: box-shadow not border-color change | Preserves semantic meaning of GUI status border colors |
| Fonts: Google Fonts `<link>` in `index.html`, scoped in components only | Global override would break intentional theme font choices (e.g. Terminal monospace) |
| Filter sidebar: additive, GUI Type chips prioritized | GUI status data already drives border colors; Style/Solve tags TBD pending store data check |

---

## 10. Post-Cal Day Backlog

- [ ] Anniversary hero — pending shirt vectorization for all years
- [ ] Filter sidebar Style/Solve/Misc chips — pending confirmation that tag metadata exists in game store objects
- [ ] Glossary slide-in panel
- [ ] Mobile responsive pass

---

## 11. Progress Log

| Date | Status | Notes |
|---|---|---|
| Apr 14 2026 | Planning complete | Constraints confirmed, component map established, Claude Code spec written |

---

## 12. Open Questions for Claude Code to Resolve Before Starting

- [ ] Run `find src -name "*.scss" | sort` — what is the exact path of the global styles file?
- [ ] Read `AppGames.vue` script block — is filtering done in Vuex or local component state?
- [ ] Check `public/assets/` — is `old-gc-logo.png` (the GC circular logo) already present?
- [ ] Read `AppGames.vue` card template — what is the exact attribute name for the game image src?
- [ ] Read existing card CSS — what are the exact hex values and class names for the three GUI status border colors (purple/gold/brown)? Copy these exactly into the new card styles.
- [ ] Do game objects in the store have tag/category metadata (Style, Solve type, Misc) or is that not yet available?
