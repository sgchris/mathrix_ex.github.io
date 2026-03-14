# Diagnostic Onboarding and Personalized Grade Path

## Task

Design a first-run onboarding flow that quickly places a learner into an appropriate starting path by grade band and skill confidence, without forcing them to manually understand the topic list or difficulty system first.

This spec is written to fit the current Mathrix app architecture:

- Single-page React app with the existing shell in `App.jsx`
- Client-side only persistence via localStorage, with optional Firebase cloud sync layered on top
- Existing topic inventory: fractions, decimals, percentages, algebra, arithmetic progression
- Existing difficulty system based on level ids such as `level01`, `level02`, `level03`, `level05`, `level07`
- Existing English and Hebrew localization, including LTR and RTL support

## Product Intent

The onboarding must make Mathrix feel guided from the first minute.

It should answer three learner questions immediately:

1. Where do I begin?
2. Will this be too easy or too hard?
3. What should I do next after the checkup?

The experience should feel lightweight, reassuring, and slightly game-like, not like a school exam.

## UX Principles

- Keep the first-run path under 3 minutes.
- Ask for the minimum amount of information before showing value.
- Frame the diagnostic as a “quick checkup” rather than a test.
- Show visible progress throughout the flow.
- Never trap confident learners; always allow a manual start path.
- Preserve dignity for weaker learners by using supportive copy and avoiding failure language.
- Make the resulting path concrete: show the next topics, starting level, and first action.

## Recommended Experience Shape

Use a full-surface onboarding layer inside the existing app shell rather than a modal.

Reasoning:

- A modal is too cramped for a 6-question guided flow on mobile.
- A separate route is unnecessary in the current app architecture.
- A full-surface layer can reuse the existing app root and persistence model while temporarily hiding the topic-first interface.

Implementation direction:

- Add an `OnboardingGate` at the top of the main experience.
- If onboarding is incomplete, render the onboarding experience instead of the standard topic sidebar plus exercise area flow.
- Once completed or skipped, reveal the normal app shell with the personalized path already applied.

## User Segments Supported

### New learner

Needs guidance and reassurance. This is the main target.

### Returning learner without onboarding data

Needs a quick path into the new system without losing prior progress.

### Confident learner who wants manual control

Needs a visible “choose manually” escape hatch.

### Learner resuming an interrupted diagnostic

Needs state restoration at the exact step and question index.

## Flow Overview

The onboarding should have 5 steps.

1. Welcome and language-safe setup
2. Grade band self-selection
3. 6-question diagnostic checkup
4. Placement result and confidence explanation
5. Personalized path kickoff

Total expected taps from app open to first recommended exercise: 10 to 16.

## Step 1: Welcome Screen

### Goal

Reduce anxiety, explain the value, and establish this as a short guided start.

### Layout

- Centered hero card on mobile and desktop
- Friendly title, short subcopy, progress indicator showing “Step 1 of 5”
- Primary CTA: `Start my quick checkup`
- Secondary CTA: `I want to choose manually`
- Inline language selector in the top corner of the onboarding card

### Content

Primary message:

- English: “Let’s find your best starting point.”
- Hebrew equivalent should preserve supportive tone, not formal exam language.

Supporting copy:

- “Answer 6 quick questions and Mathrix will build a practice path that fits you.”

### UX Notes

- The manual path must not look like an error or exit. It should remain a secondary action.
- Do not ask for age first. That adds friction before value is clear.

## Step 2: Grade Band Self-Selection

### Goal

Get a coarse placement anchor before diagnostic scoring.

### Control Design

Use large selectable cards, not a dropdown.

Recommended grade-band options for the current content scope:

- `Grade 6 Foundations`
- `Grade 7 Bridge`
- `Pre-Algebra / Early Grade 8`
- `I’m not sure`

### Card Content

Each card includes:

- Grade band label
- One-line skill preview
- Simple icon or visual marker

Example skill previews:

- Grade 6 Foundations: “Fractions, decimals, percentages”
- Grade 7 Bridge: “Multi-step fractions, percentages, early algebra”
- Pre-Algebra / Early Grade 8: “Variables, patterns, arithmetic progression”

### UX Notes

- This is a confidence hint, not a hard constraint.
- `I’m not sure` should be visually equal to the grade options.
- On mobile, cards stack vertically. On desktop, show a 2x2 grid.

## Step 3: Diagnostic Checkup

### Goal

Measure readiness across current Mathrix topics with a small, mixed set.

### Diagnostic Structure

Use 6 questions total.

Recommended composition:

- 2 foundation questions from fractions and decimals
- 2 transfer questions from percentages and proportional reasoning style tasks
- 2 symbolic/pattern questions from algebra and arithmetic progression

### Why 6 Questions

- Short enough for first-run completion
- Broad enough to separate foundation learners from stronger learners
- Matches the backlog intent exactly

### Question Presentation

Show one question per screen.

Screen regions:

- Top: progress tracker with six dots plus `Question 2 of 6`
- Middle: question card using the existing exercise display style
- Bottom: answer area and primary CTA
- Footer row: `Skip this question` and `Exit diagnostic`

### Interaction Rules

- Do not show the existing sidebars during the diagnostic.
- Do not show the normal `Check Answers`, `Hint`, `How to solve?`, and `Next` action bar.
- Replace them with a single primary action: `Continue`
- After submission, auto-advance after a short confirmation state of 400 to 700 ms.

### Feedback Model

Keep question-by-question feedback lightweight.

Use only:

- Correct confirmation
- Soft incorrect confirmation
- Optional micro-tip for confidence, not a full explanation

Avoid showing full worked solutions inside the diagnostic. That turns a checkup into a lesson and slows onboarding.

### Skip Handling

- Allow skipping individual questions.
- Treat skipped questions as low confidence, not as hard failure.
- If more than 3 questions are skipped, placement confidence should be marked as low.

### Difficulty Adaptation During Diagnostic

Use a fixed question set order per grade band seed, with one lightweight adaptive branch after question 3.

Recommended behavior:

- If the learner gets at least 2 of the first 3 mostly correct, question 4 to 6 can tilt one level harder.
- If the learner gets 0 or 1 of the first 3 correct, question 4 to 6 should stay foundation-weighted.

This keeps implementation simple while still feeling intelligent.

## Step 4: Placement Result

### Goal

Turn a score into a clear, encouraging next path.

### Result Card Structure

Top area:

- Celebration accent, not a confetti explosion
- Title: `You’re ready for Grade 6 Foundations` or equivalent

Middle area:

- Confidence bar with labels such as `Strong match`, `Good starting point`, or `We’ll keep adjusting`
- 2 to 3 chips showing strongest detected areas
- 1 to 2 chips showing areas to build next

Bottom area:

- Primary CTA: `Start this path`
- Secondary CTA: `Adjust my starting point`
- Tertiary text link: `See how this was chosen`

### Copy Guidance

Never say:

- “You are below grade level”
- “Weak”
- “Failed”

Prefer:

- “Best starting point right now”
- “Skills to build next”
- “Mathrix will keep adjusting as you practice”

### Placement Outputs

The result must produce these concrete values:

- `recommendedGradeBand`
- `recommendedTopics` ordered list
- `recommendedStartingLevel` per topic
- `confidenceScore`
- `diagnosticCompletedAt`

## Step 5: Personalized Path Kickoff

### Goal

Bridge placement into the normal Mathrix practice interface.

### Kickoff Screen

Show a short path summary before entering the main app.

Include:

- Path title
- First 3 recommended topics in order
- Starting difficulty badge for the first topic
- Estimated first session goal such as `Start with 3 quick exercises`

Primary CTA:

- `Start first exercise`

Secondary CTA:

- `Open my path overview`

### Post-Onboarding Main App Changes

After kickoff, the standard shell appears with these changes:

- Recommended topic auto-selected
- Recommended difficulty level pre-selected
- Topic sidebar visually marks path topics with a subtle badge or rail marker
- Empty state is replaced by a path-aware home state for future returns

## Personalized Path Model

The current content library does not yet support full Grade 6 to 12 coverage, so the first version should use path labels that feel grade-based but remain grounded in available topics.

### Recommended V1 Paths

#### Grade 6 Foundations

- Primary topics: fractions, decimals, percentages
- Default start level: `level01`
- Goal: build confidence with concrete arithmetic representations

#### Grade 7 Bridge

- Primary topics: fractions, percentages, algebra
- Default start level: `level02` or `level03` depending on confidence
- Goal: transition from arithmetic fluency into symbolic thinking

#### Pre-Algebra Track

- Primary topics: algebra, arithmetic progression, percentages
- Default start level: `level03` or `level05`
- Goal: start with symbolic relationships and pattern generalization

### Path Rules

- A path must include 3 ordered topics.
- The first topic must be immediately launchable with existing content.
- Later recommendations can rebalance as performance data grows.
- Path labels are learner-facing. Internal scoring can stay topic-plus-level based.

## Placement Logic Recommendation

Keep the first version interpretable.

### Inputs

- Selected grade band
- Correctness per diagnostic question
- Time to answer per question, bucketed rather than stored raw for UI use
- Skips
- Topic tag for each diagnostic question
- Difficulty tag for each diagnostic question

### Output Logic

Use a weighted score by topic family and overall readiness.

Recommended rules:

- Strong performance in fractions, decimals, and percentages with weak symbolic skills maps to `Grade 7 Bridge` only if accuracy remains above a threshold such as 70%.
- Strong symbolic and pattern performance can place the learner into `Pre-Algebra Track` even if one arithmetic question is missed.
- Multiple misses on foundation questions should keep placement at `Grade 6 Foundations`.
- If the learner selected a higher band but diagnostic confidence is much lower, keep the supportive result copy and explain that the app starts with foundations to build speed.

### Confidence States

- High confidence: 5 to 6 answered, clear score separation
- Medium confidence: 4 answered, some mixed signals
- Low confidence: many skips or contradictory signals

When confidence is low, add a sentence that the app will recalibrate after the next few exercises.

## Recommended UI Components

Create these new components.

- `OnboardingGate`
- `OnboardingWelcome`
- `GradeBandStep`
- `DiagnosticRunner`
- `DiagnosticQuestionCard`
- `PlacementResultCard`
- `PathKickoffCard`
- `PathBadge`

Add these enhancements to existing areas.

- `TopicSidebar`: show recommended path markers and optional `Your path` section at the top
- `ExerciseArea`: support a returning path-aware empty state when no exercise is active
- `AppContext`: persist onboarding and learner profile state

## State and Persistence Design

Persist onboarding inside the main app state so it also syncs through the existing Firebase mechanism.

### Recommended State Shape

```js
{
  onboarding: {
    status: 'not_started' | 'in_progress' | 'completed' | 'skipped',
    currentStep: 'welcome' | 'grade-band' | 'diagnostic' | 'result' | 'kickoff',
    selectedGradeBand: 'grade6' | 'grade7' | 'prealgebra' | 'unsure' | null,
    diagnostic: {
      questionIds: [],
      currentIndex: 0,
      answers: [],
      startedAt: 0,
      completedAt: 0,
      confidence: 'high' | 'medium' | 'low' | null
    },
    learnerProfile: {
      recommendedGradeBand: null,
      recommendedTopics: [],
      recommendedLevelsByTopic: {},
      strengths: [],
      growthAreas: []
    }
  }
}
```

### Persistence Rules

- Save after every step transition.
- Save after every diagnostic answer.
- Restore exactly where the learner left off on reload.
- If a learner previously used the app without onboarding, do not destroy their exercise history.
- If onboarding is completed, use the result to seed the default topic and level, not to overwrite prior solved records.

## Returning User Behavior

### Returning user with completed onboarding

Show a path-aware home state instead of rerunning onboarding.

Recommended content:

- `Continue Grade 6 Foundations`
- `Next recommended topic: Decimals`
- `You solved 3 exercises in this path`

### Returning user with partial onboarding

Resume where they left off with a compact banner:

- `Resume your 2-minute checkup`

### Existing user before this feature launch

If the learner already has meaningful history, do not hard-force onboarding on first load after release.

Recommended behavior:

- Show a dismissible path setup card in the main area.
- Primary CTA: `Build my personalized path`
- Secondary CTA: `Keep choosing topics myself`

This avoids punishing existing users.

## Manual Override Experience

The learner must be able to adjust the recommended start point.

### Adjustment UI

On the result screen, `Adjust my starting point` opens a bottom sheet on mobile and side panel on desktop.

Controls:

- Grade band selector
- First topic selector
- Starting difficulty selector

### Rules

- The system recommendation stays visible as a reference.
- Manual changes update the learner profile with an `isManuallyAdjusted` flag.
- The app should still continue learning from actual performance afterward.

## Visual Design Direction

Keep the tone brighter and more guided than the current utilitarian shell.

### Visual Traits

- Soft structured background shapes behind the onboarding card
- Large progress indicator
- Big tap targets with clear state change
- Strong hierarchy between primary and secondary actions
- Gentle success moments after diagnostic completion

### Motion

- Step transition slide or fade between onboarding steps
- Short correct-answer confirmation pulse
- Progress bar fill animation on result screen

Do not use heavy celebration effects for every step. Save higher-energy celebration for the final placement reveal.

## Mobile-First Behavior

### Mobile

- Single-column layout
- Sticky bottom CTA region during the diagnostic
- Maximum one major decision per screen
- Progress and exit affordances always visible

### Desktop

- Centered content column with optional supportive side illustration or path preview rail
- Maintain the same vertical reading order as mobile
- Do not spread decision content too widely; keep the core card readable and focused

## Accessibility Requirements

- All steps must be fully keyboard accessible.
- Card selections must expose proper selected state via ARIA.
- Progress indicators need text equivalents, not color only.
- Result chips for strengths and growth areas must meet contrast requirements.
- Motion should respect reduced-motion preferences.
- Diagnostic feedback must never rely on green or red alone.

## Localization and RTL Requirements

The onboarding must be fully translatable and direction-aware.

### Requirements

- No hard-coded English in component layout decisions.
- Titles and supporting copy should be separate translation keys.
- Progress labels such as `Step 2 of 5` and `Question 4 of 6` must be parameterized.
- Cards, chips, badges, and confidence labels must mirror cleanly in RTL.
- Avoid iconography that implies left-to-right progression unless it can flip in RTL.

## Diagnostic Content Metadata Recommendation

To keep the UI logic clean, define a small diagnostic question registry separate from the main topic browsing flow.

Each diagnostic question should have:

- `id`
- `topicId`
- `levelId`
- `gradeBandWeight`
- `skillTag`
- `exerciseId` or embedded lightweight prompt reference

This lets product tune the diagnostic without changing the UI layer.

## Empty and Edge States

### Network or file load failure during diagnostic

- Show a friendly retry state.
- Offer `Try again` and `Choose topics manually`.

### Incomplete diagnostic data

- Still produce a path if at least 3 questions were answered.
- Mark confidence as low and explain that the path will adjust quickly.

### No matching exercise at recommended level

- Fall back to the nearest available level in the target topic.
- This should happen silently unless the user opens the adjustment panel.

## Analytics Events Recommendation

If analytics are added later, these are the key events.

- `onboarding_started`
- `grade_band_selected`
- `diagnostic_question_answered`
- `diagnostic_question_skipped`
- `diagnostic_completed`
- `placement_viewed`
- `placement_accepted`
- `placement_adjusted`
- `path_started`
- `onboarding_skipped`

## Implementation Phasing

### Phase 1

- Welcome step
- Grade-band step
- Fixed 6-question diagnostic
- Result card
- Persisted learner profile
- Auto-select recommended topic and level

### Phase 2

- Lightweight adaptive branching after question 3
- Manual adjustment panel
- Path markers inside topic sidebar
- Returning path-aware home state

### Phase 3

- Smarter recalibration after first 5 to 10 post-onboarding exercises
- Tighter integration with future mastery map and recommendation engine

## Acceptance Criteria

- A brand-new learner can complete onboarding and land in a first recommended exercise without needing to understand the existing topic list.
- The full flow is usable in English and Hebrew, including RTL.
- On refresh, the learner resumes the exact onboarding step or diagnostic question.
- Completing onboarding stores a reusable learner profile in app state and localStorage.
- The personalized result sets a recommended topic order and starting level using existing Mathrix topics.
- Existing users with saved exercise history are not forced into a disruptive first-run wall.
- Manual topic-first usage remains available.

## Engineering Notes

- Place the onboarding gate above the current topic-first experience rather than trying to retrofit this into the existing `ExerciseArea` empty state alone.
- Reuse the existing exercise rendering and answer input primitives for diagnostic questions where practical, but use a dedicated onboarding wrapper so the action model stays simpler.
- Keep path recommendation data explainable and editable. Product will need to tune this as the curriculum expands beyond the current five topics.

## Final Recommendation

Build the first release around a calm, full-surface checkup that produces a visible three-topic starting path and immediately launches the learner into the first recommended exercise.

That gives Mathrix a guided entry point now, without waiting for the later mastery-map and recommendation-engine work, and it stays fully compatible with the current app architecture and content library.