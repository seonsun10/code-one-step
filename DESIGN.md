# Design

## Source of truth

- Status: Active; home skill-picker, palette, and activity-grid contrast follow-ups are implemented locally. Broader learning-flow redesign remains planned.
- Date: 2026-10-30
- Product surfaces: Korean-first learning home, skill and technology discovery, 12 local learning tracks, staged lessons and practice, AI-assisted development exercises, coding workspace, browser-local records and backup.
- Evidence reviewed: README, docs/rules/design.md, docs/rules/product.md, docs/rules/content.md, docs/plan/progress.md, docs/plan/ai-learning-curriculum.md, docs/plan/curriculum-depth-upgrade.md, docs/plan/content-quality-audit.md, src/main.js, src/styles.css, src/content.js, src/progress.js, local track SVGs, user screenshots, and live in-app browser views. The home was checked at 320, 390, 480, 493, 768, and 1280px; problem, coding, track directory, lesson, and profile surfaces were checked at desktop width, and the AI exercise was checked on a narrow screen. Local changes remain unpublished.
- User review found that the home skill picker’s central circle looked arbitrary and that edge labels could be clipped. Replace the forest/sage-heavy palette with warm paper, ink navy, and rust in light mode and navy charcoal with apricot accents in dark mode. The orbit now has a small map-shaped rectangular trigger, track icons in rounded-square controls, inward-facing labels, and a brief springy icon enlargement that respects reduced-motion settings. Keep the complete course list and touch/keyboard routes available. At desktop and tablet widths all 12 labels stay inside the orbit; at 493px and 320px the list stays inside the viewport without page-level horizontal overflow. Contrast checks cover the updated light and dark tokens. The activity grid uses square cells with equal row and column gaps and a separate forest-green intensity scale; empty days stay neutral while recorded days become progressively more visible in both themes.
- The home, track selector, activity grid, example labels, shared separators, and control corners were adjusted; a squeezed tablet layout was found and corrected. User review then found that the home example showed unfinished coding prompt text rather than a worked example, and that the activity grid left most of its section unused. The example now follows the next unfinished lesson in the active track (or reviews that track’s highest completed lesson), shows the course level, and uses syntax-highlighted, numbered code or structured concept notes. Mobile menu, keyboard date movement, Escape close and focus return, route-to-top behavior, and collapsed source disclosure were verified. Other learning surfaces still need the planned content-flow improvements; no novice user study was conducted.

## Brand

- Personality: a clear-eyed, curious Korean technical field guide. It should feel authored by people who build and maintain software, with precise explanations and small visual discoveries.
- Trust signals: visible learning objectives, complete examples, explainable answers, test evidence, dated version context where it matters, and clear local-storage boundaries.
- Avoid: generic SaaS dashboards, the usual purple-blue AI gradient, glass surfaces, repeated rounded cards, floating decoration without a job, fake data visualizations, emoji as primary navigation, tiny English labels, and hover-only controls.

## Product goals

- Grow the learner from understanding basic programming concepts to solving practical tasks and reviewing AI-generated work.
- Teach how software and AI systems behave so learners can reason about, maintain, test, and improve them.
- Make the next useful action clear, preserve local progress, and support deliberate practice with varied examples and feedback.
- Build toward advanced engineering skills such as design trade-offs, refactoring, debugging, test strategy, security, performance, memory, and traffic handling.
- Non-goals: claiming a website alone makes every learner equivalent to an experienced senior developer; sending learner content to an AI service; requiring accounts, cloud storage, paid APIs, or tracking.
- Success signals: a learner can explain a concept in their own words, predict behavior, solve a changed scenario, identify a defect in generated code, justify the finding with evidence, and verify a correction with tests.

## Personas and jobs

- New learner: needs a welcoming first step, plain language, a small daily goal, and examples that make abstract rules visible.
- AI-assisted learner or working developer: needs to judge when generated code is wrong, incomplete, unsafe, or unnecessarily complex, then test and repair it.
- Returning learner: needs to resume the right problem quickly and see meaningful progress without an account.
- Job: “Help me understand what the program or AI is doing, practice the reasoning, and know how to check my own work.”

## Information architecture

- Home: today's learning action, continue learning, a short example to inspect, local activity history, and a way to explore skills.
- Explore: technology and skill groups with both a visual quick selector and a complete, plainly labeled list.
- Track: a staged route with prerequisites, outcomes, and progress.
- Lesson: concept model, worked example, prediction or tracing, practice, hints, explanation, and a transfer task.
- Practice workspace: coding tasks, bug diagnosis, refactoring, tests, and AI-generated-code review.
- AI learning: existing AI and LLM theory connected to prompt design, evaluation, safe use, code review, and repair activities.
- Records: completed and attempted work, a local activity calendar that states its actual coverage, and export/import controls.
- Navigation destinations remain directly discoverable; visual shortcuts supplement the route structure.

## Design principles

- Show the learner's next action before statistics or catalog totals.
- Teach a mental model, demonstrate it, ask the learner to predict, then vary the problem and explain the evidence.
- Make correctness observable: edge cases, tests, behavior traces, and review criteria appear in the learning task.
- Use progress to support recall and persistence, not to rank learners.
- Use one strong action per screen and remove repeated or internal-process copy.
- Use motion only to reveal the result of a real interaction. A skill orbit is navigation, not decoration; it must not cover reading content and must have an equally complete keyboard, click, and touch path.
- Keep lesson content in editorial sections, lists, diagrams, and clear rules. Use enclosed surfaces only for controls, editors, code, or feedback that need them.

## Visual language

- Proposed motif: an engineer's field journal, combining a technical route map with concise margin notes. Use section numbering, hand-drawn-feeling but precise diagrams, route lines, and deliberate asymmetry to make the site recognizable without decorating every area.
- Light palette: warm paper (`#f2efe8`), ink navy (`#263142`), rust actions (`#a7462d`), and restrained semantic colors for success, review, and errors. Dark palette: navy charcoal (`#171d27`), warm text, and apricot actions (`#eca16f`). Keep surfaces quiet and use one strong accent instead of making every element green.
- Keep colors as tokens and preserve WCAG AA contrast. Do not use gradients to manufacture personality.
- Use the existing system Korean sans-serif stack for reading. Use tabular or monospace numerals for week numbers, code, and dates only. Avoid remote font requests.
- Give technology SVGs their official recognizable color and shape. Draw original local SVG diagrams for learning concepts instead of stock AI imagery.
- Use a deliberate type scale, generous line spacing, short reading widths, and visible section boundaries. Avoid dense tiny metadata.
- Motion is brief and purposeful. Respect reduced motion.

## Components

- Today strip: current concept, estimated time, and one primary start/resume action.
- Learning record grid: date-based activity derived from retained local records, with text alternatives, an exact selected-day summary, no claim of history outside the retained date range, and a forest-green intensity ramp with a visible neutral empty state.
- Skill orbit: a compact map-shaped rectangular trigger opens course icons around it on desktop pointer hover, keyboard focus, or activation. Rounded-square icons enlarge with a short spring motion, and each course name stays inside the orbit boundary. Every item also appears in a normal list; on touch screens activation opens a vertical list.
- Skill route map: ordered stages and prerequisite relationships shown as a readable path, not a network puzzle.
- Learning sequence: concept explanation, worked example, code or decision trace, practice modes, feedback, and optional source disclosure.
- AI review task: generated answer, review checklist, supplied tests, defect evidence, repair, and reflection.
- Reusable controls: buttons, inputs, code blocks, result feedback, progress marks, pagination, disclosures, and local record messages.

## Accessibility

- Target WCAG 2.2 AA for text and controls.
- Every action works by keyboard and touch with visible focus. Hover only enhances discovery; it never contains the only route to an action.
- Use semantic headings and landmarks. Announce answer, save, and run states with text and accessible status regions.
- Provide text descriptions for heatmap intensity and a selected date; color alone never communicates completion or correctness.
- Keep touch targets at least 44px where practical. Respect reduced motion and avoid flashing or motion that blocks reading.
- Keep code locally scrollable without page-level horizontal overflow. Verify both light and dark themes for contrast.

## Responsive behavior

- Support 320px through wide desktop.
- Desktop may use a narrow navigation rail and a spacious editorial work area. Tablet collapses secondary navigation without hiding the current task. Mobile uses a labeled, touch-sized navigation and one-column reading flow.
- The orbit selector becomes an expandable vertical list on touch layouts. Do not depend on hover detection. At tablet widths, keep the orbit and labels inside the available column; at mobile widths, use the full-width list control.
- Heatmap and long routes may scroll within their own bounded areas only when that behavior is apparent and keyboard-accessible.
- Check 320, 390, 768, and 1280px widths, both themes, and safe-area insets before marking the redesign complete.

## Interaction states

- Loading: short preparation text and a stable content position.
- Empty: one clear first step; an empty progress grid explains that activity appears after solving a problem.
- Error: explain what failed and how to recover; preserve unsaved work where possible.
- Success and review: state the result, show why, and offer a useful next action.
- Disabled: explain why a control is unavailable.
- Offline: core learning and local records remain usable; external references are labeled as links that may need a connection.
- Menus and disclosures expose their open state to keyboard and assistive technology.

## Content voice

- Use natural Korean and explain new terms when they first become necessary.
- Use a welcoming, consistent polite voice for first-time learners. Prefer familiar verbs and short action labels; avoid translated product jargon and commands that sound like a reprimand.
- Prefer concrete examples from software people maintain: form validation, data imports, API requests, logs, tests, retries, permissions, performance, and failures.
- Avoid vague praise, unexplained jargon, and answers that reveal a result without the reasoning.
- Ask learners to show evidence: a test, an output trace, a requirement, or a specific code line.
- Distinguish a teaching example from production-ready code. State assumptions and limits plainly.

## Implementation constraints

- Current application uses vanilla HTML, CSS, and ES modules. Reuse this architecture and local SVG assets unless a concrete requirement proves it insufficient.
- Keep learning records in the current browser-local storage and preserve JSON backup/import behavior. Heatmap data comes from those records; no analytics service is added.
- The activity grid uses each problem's latest recorded answer date, then falls back to the existing bounded answer history. It shows the latest 12-week calendar window and shortens the displayed range when retained records no longer cover that window; it does not claim to be a lifetime or daily-attempt history.
- Do not add login, a cloud database, a paid AI API, or remote code execution as part of the redesign.
- Keep existing route identifiers and saved answer compatibility unless a migration is explicitly designed.
- Verify targeted behavior per phase, perform one integration build after the planned work, and do not repeat full regression without new failure evidence.

## Remaining checks

- [ ] Finish the wider visual pass across lesson, coding, profile, and foundations screens while keeping the same typography, colors, borders, and reading width.
- [ ] Confirm desktop pointer-hover behavior and compare skill discovery against the complete list. Keyboard and touch expansion are implemented; the full route list remains available.
- [ ] Check 390px, 768px, reduced-motion behavior, and final release validation before marking the redesign complete.
