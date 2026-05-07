# Refine Hero Section

Three focused changes to `src/components/HeroSection.tsx`. No new dependencies, no backend work.

## 1. Fix orbit overlap and resize to "medium"

Current issue: 11 tiles at 64px on a 340–520px ring with radius 44% means each tile arc segment is ~28° while tiles span ~35–40°, so neighbours collide. The container is also oversized for desktop.

Fixes:
- Reduce container size: `w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px]` (was up to 520px).
- Shrink tiles: `h-12 w-12` (was `h-16 w-16`) and emoji/image inside scaled down accordingly.
- Pull items slightly inward: `radiusPct = 42` and tighten halo/ring insets so labels don't clip.
- Hide the small text label under each tile on the rotating ring (it was the main collision source). Show the label only for the **active** item and on hover via a tooltip-style pill that appears above the tile, counter-rotated. This removes 11 always-on label pills from the ring.
- Center "A" badge: `h-20 w-20 sm:h-24 sm:w-24` (was 24/28) so it stays proportional.

## 2. Replace emojis with real image tiles

Map each orbit item to an existing asset in `src/assets/`:

| Item | Image |
|---|---|
| Events | `flyer-social-fellowship.jpg` |
| Singles Spark | `singles-spark-hero.jpg` |
| Football League | `football-league-hero.jpg` |
| Retreats | `retreat-nature.jpg` |
| Camp Meeting | `flyer-spiritual-retreat.jpg` |
| Streams | `worship-concert.jpg` |
| Fundraisers | `flyer-fundraiser.jpg` |
| Nature Hikes | `hero-youth-hike.jpg` |
| Service Missions | `hero-service-mission.jpg` |
| Prayer & Worship | `flyer-music-worship.jpg` |
| Music Concerts | `singles-worship.jpg` |

Tile rendering:
- Replace the emoji `<span>` with `<img>` filling the rounded tile (`object-cover`, `rounded-2xl`, `loading="lazy"`, `draggable={false}`).
- Add a subtle dark gradient overlay inside each tile for legibility against varied photos.
- Active/pressed state: gold ring + warm glow stays the same; add a slight `brightness-110` on hover/active.
- Keep accessible names via `aria-label` on the `<Link>` (already present); images get empty `alt=""`.

## 3. Modernize the right-side headline block

Goals: tighter, more editorial, less "marketing block".

- Replace the all-caps eyebrow with a small horizontal rule + label combo: a 32px gold bar followed by `Christ-Centered Community` in tracked uppercase. Aligns right on desktop, left on mobile.
- Tighten headline: keep `Unite in Faith. / Grow Together.` but use `font-serif` (Noto Serif, per project memory) for `Grow Together.` to add editorial contrast against the sans-serif `Unite in Faith.`. Reduce max size to `lg:text-6xl` so it doesn't dwarf the smaller orbit.
- Rotating subtitle: switch from `h-14 overflow-hidden` to a min-height container with cleaner crossfade (no vertical translate stutter), slightly larger line-height, and a max width of 360px for tidy ragged-right.
- Buttons: keep current two-button layout, but:
  - Primary becomes solid gold with subtle shadow on hover only.
  - Secondary becomes a "ghost link" style with arrow icon (`Singles Spark →`) instead of an outlined button, which reads more modern.
- Add a small meta row beneath the buttons on desktop: three pill chips like `1,200+ members  ·  60+ events  ·  24 churches` (static text for now) to give the hero density without clutter. Mobile hides the chips.

## Technical notes

- All changes localized to `src/components/HeroSection.tsx`.
- Imports added: the 11 image assets from `@/assets/...`.
- No router, data, or auth changes. URL-sync active highlight logic stays intact.
- Drag/swipe behaviour, counter-rotation, halo, and dashed outer ring all preserved.
- Mobile "Swipe to rotate" hint stays.

## Out of scope

- No changes to other hero variants, navbar, or downstream sections.
- No new image uploads; we reuse existing assets.
