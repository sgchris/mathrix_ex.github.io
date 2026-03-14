# Adaptive Recommendation Engine for What Should I Do Next?

## Task

Design an adaptive recommendation experience that tells the learner what to do next after each exercise and when returning to the app, using mistakes, solved history, topic momentum, and recency.

This spec is written to fit the current Mathrix app architecture:

- Single-page React app with the main shell in `App.jsx` and two primary app views: `practice` and `masteryMap`
- Client-side persistence through `localStorage`, with optional Firebase sync layered on top
- A persisted onboarding gate and learner profile already exist from task 1
- A persisted mastery map already exists from task 2, including skill taxonomy, grade-band filters, recommended skill selection, and exact exercise launch back into practice
- Current core surfaces in practice mode: topic sidebar, level selector bar, exercise area, exercise history sidebar, and mobile drawer
- Current core surfaces in guidance mode: learner-path sidebar section, recommendation-ready empty state in the exercise area, and mastery-map entry points from sidebar, empty state, and completed exercises
- Current content inventory: fractions, decimals, percentages, algebra, arithmetic progression
- Current exercise progression model is now hybrid: onboarding can recommend a starting path, the mastery map can recommend a skill, and the default in-practice next step is still largely manual or random within the selected topic and level
- Existing English and Hebrew localization with LTR and RTL support

## Product Intent

The recommendation engine must remove the small but repeated decision burden that happens after every exercise.

It should answer three learner questions continuously:

1. What should I do next right now?
2. Why is Mathrix recommending this?
3. If this feels too easy or too hard, what is the nearby alternative?

The experience should feel smart, supportive, and calm. It should guide the learner into flow, not feel like a command center full of analytics.

## UX Principles

- Show one primary next step, not a grid of equal choices.
- Explain the recommendation in plain language.
- Adapt quickly after mistakes without making the learner feel punished.
- Preserve a sense of forward motion after success.
- Keep manual topic control available at all times.
- Make the recommendation visible in the moments where the learner naturally hesitates.
- Keep the first version interpretable. Students and parents should understand why a suggestion appeared.

## Core UX Outcome

The learner should feel that Mathrix is paying attention.

After each meaningful action, the app should generate a clear recommendation state instead of dropping the learner back into a generic topic browser.

The recommendation engine should shape four moments:

1. First landing state for existing learners
2. Post-exercise next step
3. After repeated struggle
4. After a strong streak within one topic

## Recommended Experience Shape

Do not create a separate recommendations screen as the primary pattern.

Instead, embed recommendations into the current app shell through a persistent recommendation layer that appears in context:

- In the empty state of the exercise area when no exercise is active
- At the top of the exercise area after an exercise is completed
- As a compact spotlight card near the top of the topic sidebar
- As a mobile-first card inside the drawer when the sidebar is hidden

Reasoning:

- The learner already makes decisions in the exercise area and topic sidebar.
- A separate screen adds navigation cost and fragments the experience.
- The mastery map already owns the dedicated progress screen, so recommendations should feel like part of the normal practice flow rather than a second analytics destination.

## Relationship to Task 2 Mastery Map

Task 2 changed the baseline for this feature.

The recommendation engine should now be designed as the action layer that sits on top of the mastery system, not beside it.

Already implemented and relevant:

- The app has a persisted `masteryMap` view in global state
- The topic sidebar already includes a `Mastery Map` entry point and a learner-path section
- The exercise area empty state already becomes path-led after onboarding completes
- Completed exercises already expose an `Open skill map` action tied to the current skill
- Mastery utilities already derive skill state, recommended skill, topic grouping, and exact launch targets from existing exercise history

Recommendation implications:

- Do not create a second progress model or a second concept of `what to practise next`
- The recommendation engine should consume onboarding and mastery signals, then turn them into a single immediate next action
- The mastery map remains the deep-dive surface for understanding long-term progress
- Recommendation cards should offer `See on map` or `Why this?` actions that can open the relevant mastery detail when helpful
- Empty-state, sidebar, and post-exercise recommendations should reinforce the learner's path and skill map, not compete with them

## Recommendation Moments

### Moment 1: Return to app with no immediate exercise selected

Evolve the current empty-state behavior into a recommendation-led home state.

Important nuance after tasks 1 and 2:

- If onboarding is incomplete and the non-blocking setup prompt is showing, keep that prompt as the first priority
- If onboarding is completed and a learner path exists, the recommendation home state should merge with the existing path-led home card instead of replacing it with a neutral generic recommendation
- If the learner arrives from the mastery map after viewing a skill, the home state can preserve that context and bias the next recommendation toward that skill or topic

Primary card content:

- Headline: a direct next action such as “Continue with decimals”
- One-line reason: “You were doing well here yesterday” or “This skill needs a quick review”
- Primary CTA: Start recommended exercise
- Secondary CTA: See two more options
- Tertiary text link: Choose topic manually or open the mastery map

Below the main card, show two secondary recommendation tiles:

- Keep momentum: continue a recently successful topic
- Review weak spot: revisit a topic with recent mistakes

This keeps the interface helpful without removing learner agency.

### Moment 2: Exercise completed correctly

After a correct answer, the learner should not only see success feedback and a generic next button.

Instead, show a short “Up next” panel above or integrated with the action area.

Primary recommendation patterns after success:

- Continue same topic, same level
- Continue same topic, slightly harder level if confidence is high
- Bridge to a related topic if repeated success suggests readiness

Example:

- “Nice work. Try one more percentages exercise at this level.”
- “You solved three fraction exercises in a row. Ready to try decimals next?”

Actions:

- Primary CTA: Start recommended next step
- Secondary CTA: Stay on current path
- Small link: Why this? or See on map

### Moment 3: Exercise failed or learner struggles repeatedly

When the learner uses multiple hints, repeats incorrect attempts, or fails an exercise, the recommendation engine should shift tone and intensity.

Do not present “next” as if nothing happened.

Recommended response card:

- Headline: “Let’s rebuild this step by step.”
- Reason: “This topic looks shaky right now, so Mathrix recommends an easier warm-up.”
- Primary CTA: Try an easier review exercise
- Secondary CTA: See a similar exercise
- Tertiary link: Keep current level anyway
- Supporting action: Open the weak skill in the mastery map

This is a rescue state, not a punishment state.

### Moment 4: Strong streak in one topic

When the learner solves multiple exercises correctly with low hint use and low retry count, Mathrix should offer progression.

Recommended progression card:

- Headline: “You are ready to stretch a bit.”
- Reason: “You solved 3 algebra exercises cleanly.”
- Primary CTA: Move to the next level
- Secondary CTA: Try a linked topic
- Tertiary link: Keep practising this level
- Supporting action: See how this skill connects inside the mastery map

This makes success feel directional rather than repetitive.

## Recommendation Types

The engine should generate a small set of recommendation types instead of an unrestricted ranking universe.

This keeps copy, UI, and behavior understandable.

### 1. Continue Recommendation

Use when the learner has positive momentum in the same topic and level.

Output:

- Same topic
- Same level
- New unsolved exercise

### 2. Level-Up Recommendation

Use when the learner has a strong recent streak and the topic has a higher available level.

Output:

- Same topic
- Next available level
- First or next unsolved exercise in that level

### 3. Recovery Recommendation

Use when the learner struggles repeatedly.

Output:

- Same topic or prerequisite topic
- Easier available level when possible
- Exercise framed as review or warm-up

### 4. Bridge Recommendation

Use when performance indicates the learner is ready to move into an adjacent topic.

Example bridges for current content:

- Fractions to decimals
- Decimals to percentages
- Percentages to algebra
- Algebra to arithmetic progression

### 5. Review Recommendation

Use when a previously solved topic has gone cold or recent mistakes suggest relearning.

Output:

- Topic practiced before
- A moderate level based on past success, not always the easiest level
- Label such as “Quick review” rather than “repeat”

## V1 Information Architecture

The first version should add one recommendation object to global app state and expose it across the existing UI.

Recommended top-level behavior:

- The topic sidebar gains a compact “Recommended next” module that sits with the existing mastery and learner-path affordances
- The empty state in the exercise area becomes recommendation-led, but still preserves onboarding prompt and learner-path use cases
- The action flow after solve or fail becomes recommendation-led
- The mastery map stays the explanatory and exploratory surface, with lightweight deep links from recommendation cards into the relevant skill or grade-band context
- The history sidebar remains historical, not predictive

Do not overload every surface at once.

The learner should see the recommendation prominently in one place, with supporting visibility elsewhere.

## Main UI Surfaces

### A. Recommendation Spotlight in Topic Sidebar

Place this below the existing `Mastery Map` button and above the learner-path block or topic list.

Reasoning:

- The `Mastery Map` button is now a stable top-level navigation affordance and should keep that privilege
- The recommendation spotlight should feel more actionable than the learner-path summary, but less structural than primary navigation

Content:

- Small eyebrow label: “Recommended next”
- Primary title: recommended topic or action
- Support text: one sentence of reasoning
- CTA button: start
- Tiny text link: refresh suggestions, see other options, or open on map

Visual behavior:

- More prominent than a topic button, less dominant than a modal
- Uses a soft highlighted container with a clear border or tonal background
- Supports long translated strings without breaking the layout

Interaction behavior:

- Clicking start should select the topic, set the level, and launch the recommended exercise directly
- Clicking the reasoning link opens a compact explanation popover on desktop and bottom sheet on mobile
- When the recommendation maps cleanly to an existing skill, the explanation affordance can deep-link into the mastery-map detail state instead of duplicating that explanation UI

### B. Recommendation Home State in Exercise Area

When no exercise is active, evolve the current exercise-area home state into a guided practice card stack.

This means:

- Preserve the existing onboarding setup prompt when it is relevant
- Preserve the existing learner-path framing when onboarding is completed
- Replace the current path-only start card with a recommendation-led card stack that still shows path chips and path-aware language when available

Recommended layout:

- Large primary card for the best next action
- Two smaller secondary cards below for alternatives
- Small note that the learner can still browse topics manually or open the mastery map

Primary card fields:

- Recommendation label: Continue, Review, Level Up, or Try Next Topic
- Recommendation title
- One-sentence reason
- Estimated effort tag such as “2 to 3 min”
- Confidence or fit label such as “Best next step”
- Primary CTA
- Secondary utility link: `See on map` when a skill-level explanation exists

Secondary cards should be visually lighter and not compete with the main recommendation.

### C. Post-Exercise Recommendation Strip

After completion, inject a recommendation strip into the top of the content area above the normal exercise instructions or in place of the generic next action.

Correct state strip:

- Success message remains visible
- Recommendation appears as the very next action
- Primary CTA reflects the recommendation type

Struggle state strip:

- Supportive tone replaces celebratory tone
- Review recommendation becomes primary
- Full-solution visibility stays available nearby

Important:

- The existing Next button should no longer randomly choose the next exercise when a recommendation exists.
- The primary “next” action should execute the recommendation.
- The current completed-exercise `Open skill map` affordance should remain available nearby, because it is now an established part of the task-2 flow.

### D. Mobile Drawer Recommendation Entry

When the sidebar is hidden on small screens, place the recommendation spotlight at the top of the mobile drawer.

This ensures the learner can still find guided next steps without needing desktop layout assumptions.

## Recommendation Explanation Pattern

Every primary recommendation should be explainable with one short sentence and one expandable detail view.

Short sentence examples:

- “You answered two decimals exercises correctly without hints.”
- “Percentages has been difficult lately, so Mathrix recommends a quick review.”
- “You have not practised fractions in a while.”

Expanded detail view content:

- Why this was selected
- What skill it helps with
- What alternative is available if it feels wrong

If the recommendation is clearly tied to one skill, the expanded detail can reuse the mastery map's skill-detail mental model instead of inventing a second explanation vocabulary.

Do not expose raw scores, formulas, or too much internal logic to the learner.

## Decision Rules for the Learner Experience

The algorithm can evolve later, but the UX needs stable behavioral rules from day one.

### Recommend “Continue” when:

- The learner solved the last exercise
- Hint usage was low or moderate
- There are unsolved exercises remaining in the same topic and level
- No stronger rescue or progression rule overrides it

### Recommend “Level Up” when:

- The learner solved at least 3 recent exercises in the same topic
- The average attempts per solved exercise is low
- Hint usage is low
- A higher level exists in that topic

### Recommend “Recovery” when:

- The learner failed an exercise
- Or used multiple hints and multiple incorrect attempts repeatedly
- Or has a recent negative streak in the same topic

### Recommend “Bridge Topic” when:

- The learner shows strong momentum in a topic
- A related topic exists and has available content
- The bridge supports a meaningful next concept, not a random switch

### Recommend “Review” when:

- A topic was previously solved but has not been touched recently
- Or new mistakes suggest the prerequisite topic should be refreshed

## Proposed Recommendation Hierarchy

When several options are possible, use this UX priority order:

1. Recovery recommendation
2. Level-up recommendation
3. Continue recommendation
4. Bridge recommendation
5. Review recommendation

Reasoning:

- Struggle needs the fastest response.
- Clear readiness to advance is more motivating than endless same-level repetition.
- Continue should be the default stable behavior.
- Bridge and review are useful, but should feel intentional rather than jumpy.

## Data Signals to Use in V1

The app already stores enough behavior to generate useful recommendations without a backend.

Use these signals first:

- Exercise status: solved, failed, explanation_shown, pending
- Attempts per exercise
- Failed answer history
- Hint usage count
- Active topic
- Selected level
- Topic history per learner
- Last modified time already stored in app state
- Onboarding learner profile: `recommendedGradeBand`, `recommendedTopics`, `recommendedLevelsByTopic`, `strengths`, `growthAreas`, `confidenceScore`
- Existing mastery derivation: current skill id, skill state, recommended skill, topic recommendations, and exact launch targets

Add these lightweight derived signals:

- Recent solved streak by topic
- Recent struggle streak by topic
- Recent solved streak by skill
- Recent struggle streak by skill
- Last practiced timestamp by topic
- Last practiced timestamp by skill
- Average hint count by topic over a recent window
- Average attempts by topic over a recent window
- Last recommendation accepted or dismissed

Do not require raw dwell-time tracking in V1. That adds noise and complexity.

Do not create a second independent mastery score inside the recommendation engine. Reuse the existing mastery derivation and only add recommendation-specific ranking logic above it.

## Recommended State Shape

Extend the main app state with a recommendation section.

Topic and skill summaries should remain primarily derived data, sourced from existing `exerciseStates`, onboarding state, topic history, and mastery utilities.

```js
{
  appView: 'practice' | 'masteryMap',
  onboarding: {
    learnerProfile: {
      recommendedGradeBand: 'grade6',
      recommendedTopics: ['fractions', 'decimals'],
      recommendedLevelsByTopic: {
        fractions: 'level03'
      }
    }
  },
  mastery: {
    selectedSkillId: null,
    lastViewMode: 'map',
    filters: {
      gradeBand: 'all',
      topicId: 'all',
      state: 'all',
      sort: 'recommended'
    },
    expandedTopicIds: []
  },
  recommendations: {
    primary: {
      type: 'continue' | 'level_up' | 'recovery' | 'bridge' | 'review' | null,
      topicId: null,
      exerciseId: null,
      levelId: null,
      skillId: null,
      reasonKey: null,
      reasonParams: {},
      generatedAt: 0,
      basedOnExerciseId: null,
      basedOnSkillId: null,
      confidence: 'high' | 'medium' | 'low' | null
    },
    alternatives: [],
    lastAction: {
      acceptedAt: 0,
      dismissedAt: 0,
      type: null,
      recommendationId: null
    },
    dismissedRecommendationIds: [],
    lastComputedFrom: {
      activeTopic: null,
      activeExerciseId: null,
      selectedLevel: null,
      learnerProfileVersion: 0,
      exerciseStatesVersion: 0
    }
  }
}
```

## Persistence Rules

- Recompute recommendations whenever an exercise result, hint count, explanation state, selected level, onboarding path, or mastery-relevant exercise summary changes.
- Persist recommendation state to localStorage with the rest of the app state.
- Sync it through the existing Firebase progress model when cloud sync is enabled.
- On reload, show the latest recommendation immediately, then optionally recompute for freshness.
- Do not lose user exercise history when recommendations are introduced.

## Empty-State Copy Guidance

The empty state becomes a coaching surface.

Preferred tone:

- Direct
- Encouraging
- Lightweight

Good examples:

- “Ready for your next step?”
- “Mathrix recommends decimals next.”
- “A quick percentages review would help before moving on.”

Avoid:

- “Based on your weak performance...”
- “You should...”
- “Recommended by algorithm...”

## Post-Exercise Copy Guidance

### After success

- “Nice work. Keep the streak going.”
- “You look ready for a slightly harder one.”
- “This is a good moment to try algebra next.”

### After struggle

- “Let’s make the next one more manageable.”
- “A short review here should help.”
- “Try a similar exercise before moving on.”

### After inactivity in a topic

- “You have not practised fractions recently.”
- “A quick refresh could keep this skill strong.”

## Manual Control and Trust

The engine must guide, not trap.

Always keep visible escape hatches:

- Browse topics manually
- Keep current level
- Choose a different level
- Dismiss this suggestion

If the learner dismisses the same recommendation type repeatedly, reduce its prominence temporarily.

Recommended behavior:

- One dismissal hides that exact recommendation for the current session state
- Repeated dismissals of bridge suggestions make continue recommendations more likely

## Visual Design Direction

The recommendation system should feel more intentional than the current generic placeholder, but it should remain compatible with the existing Mathrix shell.

### Visual traits

- Distinct recommendation cards with clear hierarchy
- A small set of semantic accents for recommendation types
- Strong title plus concise support text
- Clear CTA styling with enough touch target size for younger users

Suggested semantic styling:

- Continue: calm blue or teal
- Level up: warm gold or orange accent
- Recovery: soft coral or amber, never harsh red
- Review: leafy green or neutral mint
- Bridge: vivid but controlled cyan or indigo accent

These accents should support recognition, but text labels must remain primary.

## Motion

- Recommendation cards may fade or slide in after answer submission
- Post-exercise recommendation strip can expand into place after feedback resolves
- Sidebar recommendation can pulse subtly on first appearance only

Respect reduced-motion settings.

Avoid constant animation loops.

## Mobile-First Behavior

### Mobile

- Recommendation cards stack vertically
- Primary CTA stays visible without requiring wide horizontal layouts
- Reason explanations open in a bottom sheet
- Secondary options appear below the main card, not in a side panel

### Desktop

- Sidebar spotlight remains compact
- Empty-state recommendation card can be wider with secondary cards in a row below
- Expanded explanation can use a popover or side panel

## Localization and RTL Requirements

This feature must be fully translatable and robust in both LTR and RTL contexts.

Requirements:

- Recommendation labels must be short and independently translatable
- Reasons should be tokenized, not built from fragile concatenation
- Card layouts must tolerate longer Hebrew strings
- Arrow icons, progress direction, and drawer alignment must mirror correctly in RTL
- Recommendation type color cannot be the only meaning carrier

## Accessibility Requirements

- Every recommendation CTA must be keyboard reachable
- Recommendation cards must expose clear heading and action structure to screen readers
- Dismiss and alternate options must be reachable without pointer-only behavior
- Reasoning popovers or sheets must manage focus correctly
- Semantic colors need sufficient contrast and text labels
- Status changes after answer submission should be announced politely through accessible live regions

## Edge Cases

### No valid recommendation exists

If no unsolved exercise is available for the strongest recommendation path:

- Fall back to the next recommendation type
- If nothing suitable exists, present manual topic suggestions rather than an empty card

### Topic has only one usable level remaining

Do not show a level-up recommendation if there is no higher level with content.

### Learner keeps switching topics manually

Do not fight the learner.

If manual switching is frequent, reduce the recommendation tone from “Do this next” to “Suggested next”.

### Learner returns after a long gap

The primary recommendation should usually be a review step, not an aggressive level-up.

## Recommended Components

Create or adapt these UI components:

- RecommendationSpotlight
- RecommendationCard
- RecommendationReasonSheet
- RecommendationStrip
- RecommendationAlternatives
- RecommendationBadge

Enhance these existing areas:

- TopicSidebar
- ExerciseArea
- ActionBar or the current post-answer action region
- MobileDrawer
- AppContext reducer and derived selectors
- Mastery map deep-link handling and exact exercise launch helpers

## Suggested Engineering Integration

The recommendation engine should be implemented as a clear derivation layer rather than scattered UI logic.

Recommended structure:

- Keep raw learner behavior in appState
- Keep mastery and onboarding as the source of long-term learning context
- Add derived recommendation helpers in a utility such as a recommendation engine module
- Reuse existing mastery helpers where possible instead of rebuilding skill inference in the recommendation module
- Generate recommendation objects centrally after state changes
- Let UI components render based on the generated recommendation object

This will make future backlog items easier, especially:

- Mixed Review Mode with spaced repetition
- Goal System with weekly targets

## Success Criteria for UX Review

The feature is working well when:

- A learner can continue practising without deciding manually after every exercise
- The recommendation reason is understandable in one glance
- The learner can still override the recommendation at any time
- Struggle triggers supportive recovery suggestions quickly
- Strong performance triggers progression suggestions that feel earned
- The empty state becomes a useful re-entry point instead of a dead end

## Example User Flows

### Flow 1: Momentum after success

1. Learner solves two fraction exercises with no hints.
2. Mathrix shows a post-exercise strip: “Keep the streak going with one more fractions exercise.”
3. After a third clean solve, the next recommendation upgrades to: “You are ready for decimals next.”
4. The learner accepts and is taken directly into the recommended decimals exercise.

### Flow 2: Rescue after struggle

1. Learner fails a percentages exercise after multiple attempts.
2. Instead of a generic next action, Mathrix shows: “A quick percentages warm-up will help first.”
3. The primary CTA starts an easier review exercise in percentages.
4. After one success, the recommendation can return to the original level path.

### Flow 3: Returning learner

1. Learner opens the app the next day with no active exercise.
2. The exercise area shows a recommendation home state.
3. Primary card says: “Continue algebra at Level 3.”
4. Secondary card offers: “Review fractions for 2 min.”
5. Learner picks the primary option and resumes immediately.

## Final Recommendation

Treat this feature as a guidance layer inside the current shell, not a new navigation system.

The best first version is one that is obvious, explainable, and helpful in the three places where the learner actually pauses:

- when returning to the app
- when finishing an exercise
- when getting stuck

If those moments become clearer and faster, Mathrix will feel much more personalized even before the later mastery-map and spaced-review systems arrive.