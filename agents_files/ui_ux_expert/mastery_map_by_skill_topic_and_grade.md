# Mastery Map by Skill, Topic, and Grade

## Task

Design a visual mastery map that shows progress at the skill level across topic and grade groupings, so learners can understand what they have mastered, what needs review, and what to practice next.

This spec is written to fit the current Mathrix app architecture:

- Single-page React app with the existing shell in `App.jsx`
- Client-side state and persistence via `localStorage`, with optional Firebase sync layered on top
- Current topic inventory: fractions, decimals, percentages, algebra, arithmetic progression
- Existing level model based on ids such as `level01`, `level02`, `level03`, `level05`, `level07`
- Existing English and Hebrew localization, including LTR and RTL support

## Product Intent

The mastery map must make progress legible.

Today the app can show what exercises were attempted, but not what that means. The mastery map should answer four learner questions in under 10 seconds:

1. What am I good at?
2. What is still shaky?
3. What should I do next?
4. How am I moving across grades, not just across random exercises?

The result should feel like a personal math journey board, not an admin dashboard.

## UX Principles

- Make progress visible at a glance before showing detail.
- Keep the first screen motivational, not analytical.
- Use color and shape together so the experience is accessible beyond color alone.
- Let younger learners read the map without needing to understand percentages first.
- Always connect weak areas to a concrete next action.
- Support partial data gracefully. A new learner should still see a meaningful map.
- Design for expansion beyond the current five topics without rethinking the interface.

## Recommended Experience Shape

Use a dedicated full-screen `Mastery Map` surface inside the existing app shell.

Do not implement this as a tiny sidebar widget or modal.

Reasoning:

- The feature needs hierarchy: grade, topic, and skill.
- Learners need room to scan, compare, and drill down.
- Mobile requires a focused single-purpose screen rather than squeezing dense progress UI next to exercise content.

Implementation direction:

- Add a top-level app mode called `masteryMap` alongside the current exercise flow.
- Entry points should exist in both desktop and mobile UI.
- The standard topic practice experience remains unchanged beneath this new screen.
- The mastery map should open without resetting the learner's active topic or current exercise.

## Core Mental Model

The map should use three levels of structure.

### Level 1: Grade Band

Use grade bands as broad chapters, not strict school-grade claims.

Recommended current bands:

- `Grade 6 Foundations`
- `Grade 7 Bridge`
- `Pre-Algebra`

These labels are understandable to learners and broad enough for the current content set.

### Level 2: Topic

Each band contains topic clusters.

Current topics:

- Fractions
- Decimals
- Percentages
- Algebra
- Arithmetic Progression

Not every topic has to appear equally in every band. Topics can recur across bands as separate mastery steps.

### Level 3: Skill Node

Each topic cluster is made of named skill nodes.

Example node names:

- Equivalent Fractions
- Comparing Decimals
- Percent of a Quantity
- Percent Increase and Decrease
- One-Step Algebra
- Find the Next Term

This is the level where the learner should feel progress.

## Information Architecture

The screen should have 4 layers of information.

1. Summary band at the top
2. Scrollable mastery map in the center
3. Skill detail drawer or panel
4. Clear action footer for next practice

The learner should understand the summary without opening detail, but detail should be one tap away.

## Screen Layout

## Desktop Layout

Use a two-column composition.

- Left and center: the mastery map canvas
- Right: sticky detail panel for the selected skill or topic

Top summary row:

- Mastery headline
- Current streak or recent momentum chip when available later
- Overall mastery ring or segmented progress bar
- `Recommended next` CTA

Below summary:

- Horizontal grade-band sections stacked vertically
- Inside each grade band, topic lanes with connected skill nodes

Right panel:

- Selected skill title
- Mastery state
- Short explanation of why it is in that state
- Recent performance preview
- `Practice now` primary CTA
- `Review easier skills` secondary CTA when appropriate

## Mobile Layout

Use a vertical progression view.

- Sticky compact header with title and mastery summary
- Grade-band accordion sections
- Inside each section, topic cards with horizontally scrollable skill chips or a wrapped mini-map
- Tapping a skill opens a bottom sheet, not a side panel

The mobile goal is scan first, inspect second. Avoid forcing users to pinch-zoom a complex graph.

## Visual Language

The UI should feel like a hybrid of a game world map and a study roadmap.

Recommended visual direction:

- Soft paper-like background with faint grid or notebook geometry
- Grade bands as wide chapter strips with subtle tonal differences
- Topic lanes identified by icon and color family
- Skill nodes as rounded tiles or circular markers connected by thin path lines
- Node fill and border communicate state
- Small spark or pulse animation only when a node has just improved

Avoid generic analytics visuals such as dense tables, hard-edged KPI cards, or raw percentage dashboards.

## Mastery States

Each skill node should map to one of 5 learner-facing states.

1. `Not started`
2. `Practicing`
3. `Almost mastered`
4. `Mastered`
5. `Needs review`

These states are better for learners than exposing only a score.

Recommended visual treatment:

- `Not started`: light neutral fill, dashed outline, hollow center
- `Practicing`: amber fill with partial progress arc
- `Almost mastered`: blue-green fill with strong border
- `Mastered`: green fill with checkmark or star accent
- `Needs review`: warm red or coral outline with review badge

Also show a numeric mastery percentage in detail view only, not as the main label on every node.

## Color and Accessibility Rules

The map must not rely on red versus green alone.

Every state should have:

- A unique icon or pattern
- A text label in the detail panel or tooltip
- WCAG-conscious contrast for labels and borders

Recommended semantics:

- Green = secure
- Amber = in progress
- Coral = slipping or needs review
- Neutral gray = unopened

For reduced-motion mode, remove node pulsing and line-draw animations.

## Summary Header

The top summary area should be emotionally useful, not merely statistical.

Recommended content:

- Title: `Your Mastery Map`
- Subtitle: supportive sentence such as `You are strongest in fractions and building confidence in percentages.`
- Overall progress indicator across unlocked skills
- Review alert chip when any skills are flagged `Needs review`
- Primary CTA: `Practice recommended skill`
- Secondary CTA: `See all topics`

The summary sentence should be generated from current data and localized naturally.

## Map Structure

Use a chapter-based flow rather than a free-floating graph.

Recommended structure:

- Each grade band is a horizontal strip or vertical chapter
- Within the band, topic clusters appear in a pedagogical order
- Within each topic, skills are ordered from foundational to advanced
- A faint connector shows what comes next

This creates a sense of progression without pretending the curriculum is a single strict line.

## Topic Cluster Design

Each topic cluster should show:

- Topic name
- Topic icon
- Topic mastery summary such as `3 of 5 skills stable`
- Mini legend of node states inside the cluster

When collapsed, the topic cluster shows only its summary strip.

When expanded, it reveals the skill nodes.

Desktop behavior:

- Allow multiple topic clusters expanded at once.

Mobile behavior:

- Expand one topic cluster at a time by default to reduce scroll fatigue.

## Skill Node Content

Each visible node should include only the minimum high-signal content.

On-map node content:

- Skill label
- State marker
- Optional tiny percentage or progress arc

On select or hover:

- Current mastery state
- Recent trend: improving, stable, slipping
- Last practiced timing such as `2 days ago`
- Suggested next action

Do not show raw attempt counts on the node itself. That is too technical for the primary interface.

## Skill Detail Panel or Bottom Sheet

This is where the learner understands why a skill is green, yellow, or red.

Recommended sections:

### 1. Skill Header

- Skill name
- Topic name
- Grade band label
- Mastery badge

### 2. Confidence Explanation

Use one sentence of plain-language interpretation.

Examples:

- `You usually solve this skill correctly without hints.`
- `You can do this, but mistakes are still common when the numbers get harder.`
- `This skill needs a refresh because recent answers were incorrect.`

### 3. Progress Strip

Show a compact breakdown of:

- Accuracy trend
- Hint reliance
- Recency

### 4. Next Action Block

- `Practice now` primary CTA
- Optional `Review previous skill first` action
- Optional `See worked examples` action if that feature grows later

### 5. Recent Activity Preview

Show up to 3 recent exercise outcomes as simple labeled chips, not a large log.

## What Counts as a Skill

Because the current content is organized by topic and level rather than explicit skill metadata, the mastery map should introduce a logical skill taxonomy layer.

Use this model:

- Topic = content family
- Skill = pedagogical subtopic inside a topic
- Grade band = expected placement range for that subtopic

Initial engineering recommendation:

- Create a lightweight skill manifest that maps exercise ids to `skillId`, `topicId`, and `gradeBandId`
- Allow one skill to include multiple exercise ids across levels
- Let the manifest expand over time as more topics are added

This is the right abstraction for the backlog item. It avoids tying mastery directly to raw exercise ids.

## Suggested Initial Skill Taxonomy

For the current 5-topic catalog, the first release should stay compact.

Recommended starting size:

- 4 to 6 skills per topic
- Roughly 22 to 28 visible skill nodes total

Illustrative taxonomy:

- Fractions: equivalent fractions, compare fractions, add and subtract fractions, multiply fractions, divide fractions
- Decimals: place value, compare decimals, add and subtract decimals, multiply decimals, divide decimals
- Percentages: percent as part of 100, find percent of a quantity, find original value, percent increase and decrease, compare percentage scenarios
- Algebra: simplify expressions, solve one-step equations, solve two-step equations, substitution basics, pattern-based algebra
- Arithmetic progression: identify pattern rule, find next term, find missing term, nth-term intuition, word problems with sequences

The exact manifest can evolve, but the UI should assume named skills from day one.

## Grade Band Mapping

The map should show that skills live inside a band, but not lock them forever to only one band.

Recommended behavior:

- Grade bands act as visual chapters
- A topic can appear in more than one band when the skills genuinely span difficulty ranges
- Foundational skills appear earlier even if the topic name is repeated later

Example:

- `Fractions` appears mainly in `Grade 6 Foundations`
- `Percentages` spans `Grade 6 Foundations` and `Grade 7 Bridge`
- `Algebra` and `Arithmetic Progression` dominate `Pre-Algebra`

This keeps the learner-facing story coherent while matching real content complexity.

## Mastery Calculation Model

The learner should see understandable labels, but the system still needs a robust score underneath.

Recommended hidden score inputs:

- Correctness rate across recent attempts in that skill
- Whether exercises were solved with or without hints
- Number of attempts needed before success
- Recency decay so older success matters slightly less than fresh success
- Small minimum sample threshold before declaring `Mastered`

Suggested interpretation model:

- 0% to 19%: not started or insufficient data
- 20% to 49%: practicing
- 50% to 74%: almost mastered
- 75% to 100% with adequate sample: mastered
- Any previously strong skill with recent decline: needs review

Do not expose this formula in the main UI. Surface only the learner-friendly explanation.

## Empty and Early-State Behavior

The mastery map must still feel useful when the learner has little data.

### Brand-New Learner

Show:

- One highlighted recommended starting cluster
- Most skills in `Not started`
- Supportive empty-state copy: `As you solve exercises, your map will light up here.`

### Learner with Scattered History

Show:

- Partial nodes filled in only where data exists
- A banner explaining that the map becomes more accurate over time

### High-Progress Learner

Show:

- Strong visual celebration for mastered clusters
- A visible `review` lane so the map does not look complete and dead

## Recommended Interactions

The mastery map should be active, not static.

Primary interactions:

- Tap or click a skill node to open details
- Tap a topic header to expand or collapse its skill list
- Filter by grade band, topic, or state
- Tap `Practice now` to launch the next exercise tied to that skill
- Tap `Needs review` filter to focus only on weak areas

Secondary interactions:

- Toggle between `Map view` and `List view`
- Long-press on mobile for a quick tooltip preview

`List view` is important for accessibility and for learners who find maps visually busy.

## Filter and Sorting Controls

Place controls near the top of the map, but keep them lightweight.

Recommended filters:

- Grade band
- Topic
- Mastery state

Recommended sort modes for list view:

- Recommended first
- Weakest first
- Recently practiced
- Near mastery

Avoid overloading the first release with too many analytics toggles.

## Recommendation Integration

The mastery map should not only show status. It must suggest action.

Every state should map to a next-step rule.

- `Not started`: suggest the easiest entry exercise in that skill
- `Practicing`: suggest another exercise at the current working level
- `Almost mastered`: suggest one confirming challenge
- `Mastered`: suggest the next connected skill or review later
- `Needs review`: suggest a refresh exercise immediately

This makes the screen behaviorally useful, not just informative.

## Entry Points

The feature should be discoverable from the current shell.

Recommended entry points:

- New button in the main navigation or top bar: `Mastery Map`
- Topic sidebar quick link under the topic list
- Post-exercise completion card: `See this skill on your map`

On mobile, add it as a clear item in the existing drawer.

## Post-Exercise Update Behavior

The map should feel alive after practice.

Recommended update sequence after an exercise is completed:

1. Update the corresponding skill score immediately
2. If the skill changes state, show a small celebration chip such as `Algebra moved to Almost Mastered`
3. Allow the learner to jump directly to the map from the completion area

Do not overdo celebration. A small state-change moment is enough.

## Localization and RTL Requirements

The map must be fully compatible with English and Hebrew.

Requirements:

- Grade bands, topic labels, skill labels, and state labels must all come from localized strings
- Connector flow should mirror correctly in RTL layouts
- Side panel placement should flip in RTL if needed, or remain consistent if that produces a more stable layout
- Percentages and numeric badges must handle locale formatting cleanly

For RTL specifically:

- A horizontal band can flow right-to-left visually
- Arrows and directional affordances must also flip
- Avoid illustrations that imply only left-to-right progression

## Mobile-Specific Guidance

The mobile mastery map must remain easy to parse on a small screen.

Recommended mobile constraints:

- Never display more than 5 to 7 nodes in one visible cluster before collapse
- Use bottom sheets for skill detail
- Keep the summary header compact after scrolling
- Ensure primary CTAs remain thumb-reachable

If the visual map becomes too dense, degrade to the list view automatically on smaller devices.

## Accessibility Guidance

The mastery map must support learners with different visual and cognitive needs.

Requirements:

- Keyboard navigation across filters, topics, and nodes
- Visible focus rings on every interactive node
- Reduced-motion support
- Descriptive labels for icons and non-text state indicators
- A list view that contains the same information as the map view
- No reliance on hover-only discovery for key information

## Persistence and State Resumption

The mastery map must restore instantly from local data.

Persist:

- Last opened map view mode
- Selected filter state
- Last selected skill id
- Expanded topic clusters if practical

Do not persist temporary animation states.

The learner should be able to leave the map, solve an exercise, and come back to a coherent updated state.

## Suggested Component Structure

Recommended component breakdown:

- `MasteryMapScreen`
- `MasteryMapHeader`
- `GradeBandSection`
- `TopicCluster`
- `SkillNode`
- `SkillDetailPanel`
- `MasteryFilters`
- `MasteryListView`

This matches the current React architecture and keeps the feature modular.

## Data Model Recommendations

Recommended additions to app state:

- `mastery.skillScores`
- `mastery.selectedSkillId`
- `mastery.filters`
- `mastery.lastViewMode`

Recommended derived metadata:

- `skillManifest`
- `gradeBandManifest`
- `topicToSkillIds`
- `skillToExerciseIds`

The score calculation itself can be pure and derived from existing `exerciseStates` plus the new manifest.

## Success Criteria

The design is successful if a learner can do the following without explanation:

1. Open the map and name one strong area and one weak area
2. Understand what to practice next
3. Feel that progress is organized by meaningful skills rather than random attempts
4. Use the feature comfortably on mobile

## Implementation Priorities

Release this in 2 phases.

### Phase 1

- Mastery screen entry point
- Grade, topic, and skill structure
- Basic node states
- Detail panel
- `Practice now` action
- Local persistence and localization support

### Phase 2

- Trend indicators
- Animated state changes
- List view and advanced filtering
- Review-focused summary callouts
- Stronger cross-linking from exercise completion flows

## Final UX Recommendation

Do not design this feature like a teacher report.

Design it like a learner's progress world:

- chapter-based
- skill-visible
- emotionally clear
- lightweight on mobile
- actionable from every weak point

If implemented well, this becomes the screen that gives structure to everything else in Mathrix. It turns exercise history into a learning journey.