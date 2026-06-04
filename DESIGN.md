# Design

## Visual Theme
The site utilizes a premium **Warm Frosted Glassmorphism** visual theme. Interactive elements float on top of a three-dimensional WebGL backdrop, utilizing physical translucency, borders, and shadows to create depth and structure.

## Colors
Color values are mapped as custom properties from `theme.json` preset values:

| Token | Class / Variable | Hex Value | Role |
| --- | --- | --- | --- |
| Charcoal 900 | `var(--navy-900)` | `#111111` | Deep dark backgrounds, text on dark sections |
| Charcoal 800 | `var(--navy-800)` | `#1a1a1a` | Dark surface elements |
| Warm Gray 100 | `var(--navy-100)` | `#e8e6df` | Light borders, subtle grids |
| Warm Gray 50 | `var(--navy-50)` | `#f4f3ef` | Soft background panels, hover backgrounds |
| Ink | `var(--ink)` | `#111111` | Default high-contrast body text |
| Ink Muted | `var(--ink-muted)` | `#56524d` | Secondary/muted body text |
| Paper | `var(--paper)` | `#fbfaf7` | Page background color (light warm off-white) |
| Paper Warm | `var(--paper-warm)` | `#f2eee6` | Warm secondary section backgrounds |
| Ocean Blue | `var(--accent)` | `#0E4164` | Primary brand accent color, buttons, icons |
| Accent Ink | `var(--accent-ink)` | `#0b3655` | Hover states for primary accents |
| Accent Soft | `var(--accent-soft)` | `#e0eaf2` | Soft light-blue background tints |
| Accent Gold | `var(--accent-gold)` | `#9a7a3d` | Secondary gold branding accents |
| Cool Gray | `var(--sea)` | `#5f6f73` | Secondary sea-gray accent |
| Cherrystone Red | `n/a` | `#b5121b` | Strategic branding red (used in WebGL lights) |

## Typography

- **Serif Font (Display & Headings)**: EB Garamond (`var(--font-serif)`)
  - Family: `'EB Garamond', Georgia, serif`
  - Style: Elegant, classical, high-end editorial
  - Weight: 500 for headings, letter-spacing: -0.02em to -0.035em.
- **Sans Font (Body & UI)**: Inter Tight (`var(--font-sans)`)
  - Family: `'Inter Tight', 'Inter', sans-serif`
  - Style: Clean, modern, highly legible
  - Weight: 400 (regular), 500 (medium), 600 (semibold/bold)
- **Mono Font (Metadata & Labels)**: JetBrains Mono (`var(--font-mono)`)
  - Family: `'JetBrains Mono', monospace`
  - Style: Technical, precise, label-oriented
  - Weight: 400, letter-spacing: 0.04em to 0.08em

## Layout & Grids

- **Max Content Width**: `1320px` (`--cs-maxw`)
- **Default Gutter**: `32px` (`--cs-gutter`)
- **Spacing Scale**:
  - `16px` (`var(--wp--preset--spacing--20)`)
  - `24px` (`var(--wp--preset--spacing--30)`)
  - `32px` (`var(--wp--preset--spacing--40)`)
  - `48px` (`var(--wp--preset--spacing--50)`)
  - `72px` (`var(--wp--preset--spacing--60)`)
  - `120px` (`var(--wp--preset--spacing--70)`)

## Glassmorphism Specification

### Light Glass (Warm Frosted Panels)
- Background: `linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.58))`
- Border: `1px solid rgba(255, 255, 255, 0.45)`
- Backdrop Filter: `blur(12px)`
- Shadow: `0 12px 32px rgba(17, 17, 17, 0.04)`

### Dark Glass (Inverse Panels)
- Background: `rgba(17, 17, 17, 0.85)`
- Border: `1px solid rgba(255, 255, 255, 0.12)`
- Backdrop Filter: `blur(14px)`
- Shadow: `0 20px 50px rgba(17, 17, 17, 0.18)`

## Background System
The background consists of a full-screen WebGL canvas (`#unified-root-canvas-container`) rendering:
1. **Interactive Glass Stones**: Procedural 3D cherrystones floating and rotating slowly in three-dimensional space.
2. **Refractive Materials**: Translucent physical glass material (`MeshPhysicalMaterial`) refracting the background color.
3. **Dynamic Colored Lights**: Slow-moving colored point lights (Cherrystone Red, Ocean Blue, and Warm Gold) shining from behind and illuminating the glass stones.
4. **Scroll Parallax**: Camera shifts perspective based on scroll position, providing depth behind the page text.
