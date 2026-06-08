## Goals

1. Fix the orbit so items travel on a true circle and the center "A" badge doesn't overlap them.
2. Remove all decorative SVGs across the site so it doesn't look AI-generated.
3. Remove the large hero/banner space (PageHero) on every page except the home page — pages should start right where the filter/segmented bar ("All / Upcoming / Past", "All Categories", search) sits.

---

## 1. Orbit fix (`src/components/HeroSection.tsx`)

Root cause of the "not circular" look: the orbit container has `aspect-square` but the parent grid cell stretches, and the rotating ring uses percentage positioning inside a non-square box at some breakpoints, plus the center A badge (h-20 w-20) sits inside the same radius arc as the tiles (radius 44% of ~360px ≈ 79px from center, while A badge half-width is ~40px → tiles land ~40px away from A, too close → overlap on small sizes).

Fixes:
- Force the orbit wrapper to a fixed square via inline width+height (not just aspect-square inside a grid) and `mx-auto`.
- Increase ring radius from `44` → `46` so items sit further from center.
- Shrink center A badge to `h-14 w-14 sm:h-16 sm:w-16` and reduce text to `text-2xl sm:text-3xl`.
- Shrink orbit item tiles slightly (`h-11 w-11`) so hover scale doesn't cross into the center.
- Keep counter-rotation so images stay upright; the ring rotation already drives circular motion — confirm no transform on the parent is squashing it.

## 2. Remove decorative SVGs

Scope: remove only **decorative inline SVGs** (background lines, dashed rings, ornamental shapes, hand-drawn arrows). **Keep functional icons from `lucide-react`** (Lucide ships as SVG but is the project's icon system per memory — removing them would break every button/nav). The rule "no SVGs" will be interpreted as "no AI-looking decorative SVG illustrations / background line art".

Action:
- Grep the codebase for raw `<svg>` JSX and `dangerouslySetInnerHTML` SVG blobs.
- Remove decorative ones in components like `HeroSection`, `StatsSection`, `FeatureCards`, `WhySDAUnite`, `CategorySection`, `Footer`, `PageHero`, page hero/CTA sections.
- Leave Lucide `<Icon />` usage intact.

I will list each file I touch in the implementation summary.

## 3. Remove PageHero space on all non-home pages

The attached screenshot shows the Events page hero ("Discover Adventist Events / Experience Every Moment" + image band) — that's the `PageHero` component. The user wants pages to start at the filter/segmented bar instead.

Approach:
- Do **not** delete `PageHero.tsx` (other code may import it; leaving the component avoids breakage and preserves the option to reuse later).
- In every page that currently renders `<PageHero ... />` *except* the home page (`Index.tsx` uses `HeroSection`, not `PageHero`), remove the `<PageHero>` usage.
- Pages to edit (based on file tree — will confirm via grep): `Events.tsx`, `Retreats.tsx`, `Streams.tsx`, `SinglesSpark.tsx`, `FootballLeague.tsx`, `CampMeeting.tsx`, `Insider.tsx`, `Xperience.tsx`, `About.tsx`, `Contact.tsx`, `CodeOfConduct.tsx`, `ServiceMission.tsx`, `MyTickets.tsx`, `Dashboard.tsx`, `Profile.tsx`, and any others importing `PageHero`.
- For each, replace the `<PageHero>` block with nothing (so the page content / filter bar becomes the first thing under the global Navbar). Keep top padding only enough to clear the fixed Navbar (e.g. `pt-20`) — no large hero band, no background image, no eyebrow/headline/subtitle.

I will NOT touch:
- `src/pages/Index.tsx` (home) — keeps `HeroSection` with the orbit.
- `src/components/HeroSection.tsx` — only the orbit fix from section 1.

## Technical details

```text
PageHero used → first child becomes filter bar
┌───────────────────────────┐
│  Navbar (sticky)          │
├───────────────────────────┤
│  [All] [Upcoming] [Past]  │ ← page now starts here
│  [All Categories ▾] [🔍]  │
├───────────────────────────┤
│  event grid…              │
```

Orbit math after fix (440px container, radius 46%):
- Tile center distance from origin = 0.46 × 220 = 101px
- A badge radius = 32px → clearance = 69px ✓ (was ~40px, overlapping with tile half-width 24 + hover scale)

## Out of scope

- Lucide icons (kept, per project memory).
- Logo/brand SVGs in `public/` if any (not decorative).
- `PageHero.tsx` component file (left in place, just unused).
