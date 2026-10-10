# Design

## Source of truth

- Status: Active
- Date: 2026-10-09
- Product surfaces: responsive Korean-first programming lessons, exercises, track navigation, and local progress profile.
- Evidence reviewed: `docs/rules/design.md`, `docs/rules/product.md`, `docs/rules/content.md`, `src/main.js`, `src/styles.css`, `src/content.js`, and the local Java track view at `http://localhost:4175/#/track/java`.
- Brand: `코드한걸음 (Code One Step)`, selected to match the public GitHub repository. The existing code mark remains the wordmark companion; no separate logo asset is needed for this release.

## Brand

- Personality: calm, capable, direct, welcoming to beginners, and trustworthy about technical currency.
- Trust signals: explain the learning goal, version context, official references, answer rationale, and where study records live.
- Avoid: decorative gradients, floating illustrations, excessive rounded cards, tiny all-caps labels, generic SaaS/dashboard motifs, and claims that imply unverified compatibility.

## Product goals

- Help people learn programming languages and frameworks through short explanations, examples, and varied practice.
- Make the next step and current progress clear without requiring an account or a paid service.
- Save learning progress on the current device and let learners continue after returning.
- Non-goals: server-side code execution, hosted database, account sync, payment, ads, and behavioral analytics in the current release.
- Success signals: a learner can find the next ordered lesson, complete a problem with useful feedback, return to their saved position, and inspect dated technical sources.

## Personas and jobs

- Primary: a Korean-speaking beginner learning independently on a phone or desktop; wants manageable steps, plain explanations, and a chance to retry.
- Secondary: a learner reviewing a specific language or framework concept; wants to see prerequisites, source versions, and focused practice.
- Job: “Show me what to learn next, let me try it, explain what happened, and keep my place on this device.”

## Information architecture

- Main navigation: 내 학습실, 배울 주제, 내 기록.
- Curriculum: language/framework → ordered stage → lesson → explanation/example → exercise/hint/solution.
- Profile: recent answers, completion and accuracy summaries, and explicit local backup/restore.
- Each track exposes its reviewed version context and official sources. Stages are ordered but remain open so a learner can revisit or skip ahead.

## Design principles

1. Put the lesson and code ahead of decoration.
2. Keep each page focused on one next action.
3. Show progression as numbered stages with clear prerequisites; do not lock learning behind a score.
4. Prefer a quiet editorial rhythm: strong headings, readable line length, restrained surfaces, and one consistent accent.
5. State technical scope and answer feedback plainly. Use color together with labels and symbols.

## Visual language

- Palette: warm off-white light canvas, ink-like text, slate borders, and restrained blue actions. Track hues are secondary identifiers only.
- Dark mode: deep charcoal canvas, raised charcoal surfaces, readable cool-white text, clear borders, and a low-glare blue action color. Follow the system appearance by default and allow an explicit persisted light/dark choice.
- Typography: system Korean sans-serif for prose; a legible monospace for code. Body copy is at least 14px; lesson prose uses comfortable line-height and a constrained measure.
- Spacing: use a consistent 4/8px rhythm and generous separation between lesson sections.
- Shape/elevation: mostly square-edged surfaces with modest 8–12px corners; use borders before shadows. Reserve filled accent panels for feedback and focus.
- Motion: short transitions only; disable nonessential movement under `prefers-reduced-motion`.
- Imagery/iconography: no decorative hero illustration required. Use simple text labels or existing track initials; icons must be understandable without color.

## Components

- Shared tokens in `src/styles.css` own colors, text contrast, borders, surfaces, focus, and spacing.
- Shared shell owns navigation, breadcrumb, local-save indicator, theme control, and responsive mobile navigation.
- Reuse track/stage rows, lesson source list, code block, answer controls, hint/solution disclosures, progress bars, and feedback status.
- Each exercise type keeps a visible type label and keyboard-operable answer control.

## Accessibility

- Target WCAG 2.2 AA for text and controls.
- All controls have accessible names, visible focus, logical keyboard order, and touch targets sized for mobile use.
- Feedback, selected lines, completion, and theme state are conveyed in text/semantics as well as color.
- Respect reduced motion. Keep code horizontally scrollable without causing page-level horizontal overflow.
- Dark and light text/surface pairs are checked separately; do not infer contrast from appearance alone.

## Responsive behavior

- Support 320px through wide desktop.
- At narrow widths, collapse the sidebar into the existing three-item bottom navigation, stack content columns, and keep code blocks locally scrollable.
- Theme control remains reachable in the top bar and does not overlap navigation or safe-area insets.
- Hover is supplemental; selected, focus, and pressed states work without hover.

## Interaction states

- Loading: concise preparation status.
- Empty: explain how to begin or add the first record.
- Error: state what failed and how to recover; do not show a success message after a failed save.
- Success/review: announce the result and a useful explanation in an accessible status region.
- Disabled: expose disabled semantics while code is running or file processing is active.
- Offline: core pages and records remain local; external source links require a connection.

## Content voice

- Use natural, respectful Korean and short sentences. Explain new technical terms on first use.
- Describe mistakes neutrally and say how to reason toward a correction.
- Label version-specific claims with their target release and review date. Identify draft specifications as drafts.
- Do not imply that framework snippets are runnable projects when imports/configuration are omitted.

## Implementation constraints

- Existing vanilla HTML/CSS/ES modules; no package dependency or remote runtime is needed.
- Preserve the no-account, no-server, no-database-service, no-paid-API, no-payment boundary.
- Local theme preference may use browser storage; study records remain in the existing browser-local storage layer with JSON backup/restore.
- Continue to run the repository test suite and static build after changes. Inspect both themes, a narrow viewport, keyboard flow, and console output.

## Open questions

- [ ] Confirm the final public brand name and logo direction — owner: user — impact: branding before public launch; the working name is safe for local implementation.
- [ ] Choose the initial public feedback repository and approve any public source/hosting connection — owner: user — impact: G8 external publication remains gated.
