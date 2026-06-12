# Original User Request

## 2026-06-12T18:56:36Z

# Teamwork Project Prompt — Draft

Use Playwright and a team of specialized subagents to crawl and test the target website automatically. Map out UI/UX improvements and errors using the `ui-ux-pro-max` skill, and create a comprehensive plan of changes without executing them.

Working directory: ~/teamwork_projects/ui_ux_audit
Integrity mode: benchmark

## Requirements

### R1. Automated Site Crawling
Crawl the entire target website (`https://cherrystone.vc`) automatically using Playwright to discover and test all accessible pages.

### R2. UI/UX Evaluation
Apply the `ui-ux-pro-max` skill guidelines to evaluate the discovered pages. Focus on accessibility, touch & interaction, performance, style consistency, layout & responsive design, and typography & color.

### R3. Map Out Changes
Create a comprehensive markdown plan (e.g., `audit_plan.md`) mapping out all discovered issues and proposed changes. You must **NOT** execute any actual code changes to the site or codebase.

## Acceptance Criteria

### Verification
- [ ] A file named `audit_plan.md` is generated in the working directory.
- [ ] The plan includes evaluations of at least 3 distinct UI/UX categories from the `ui-ux-pro-max` skill (e.g., Accessibility, Layout, Typography).
- [ ] No code files in the target codebase have been modified.

## 2026-06-12T19:21:57Z

Add high-quality motion design to the Angel Fund website, specifically adding animations to the number sliders and improving the feel of interactive elements. The project is an Angel Fund site, so the motion should convey high-end production polish and professionalism (Jakub Krehel principles primary) with restraint (Emil Kowalski principles secondary).

Working directory: c:\Users\Ethan\OneDrive - Vanderbilt\Desktop\Cherrystone\Cherrystone New Site\wordpress\Just the blocks plugin
Integrity mode: development

## Requirements

### R1. Number Slider Animations
Implement viewport-triggered animations for the number sliders. When the sliders enter the viewport, they should animate smoothly (e.g., counting up or sliding into place) using Vanilla JavaScript (IntersectionObserver) and CSS. 

### R2. Interactive Element Polish
Apply subtle, production-grade hover states and enter animations to other key interactive elements on the site (like buttons or feature cards).

### R3. Motion Design Constraints
Use Vanilla CSS & JavaScript. All motion must follow professional polish guidelines: use custom easings or springs (never bare `ease`), keep durations between 200ms-500ms, and only animate composited properties (`transform`, `opacity`, `filter`).

### R4. Accessibility
All implemented motion must strictly respect accessibility settings by disabling or reducing motion when `prefers-reduced-motion` is active.

## Acceptance Criteria

### Verification
- [ ] The number sliders animate when scrolled into view without causing layout shifts.
- [ ] Hover and enter animations only animate `transform`, `opacity`, or `filter` properties.
- [ ] A `@media (prefers-reduced-motion: reduce)` block is present and properly disables or tones down the added animations.
- [ ] No external animation libraries (like GSAP or Framer Motion) are added to the project; all work is done in Vanilla CSS and JS.

