# Transform Mathrix to a Generative Exercise System

## Purpose

This document instructs a software engineer how to transform Mathrix from a static JSON exercise library into a deterministic, multilingual, generative exercise platform while keeping the current app stable throughout the migration.

The target result is:

- exercises are generated from reusable exercise families instead of being authored one by one
- the same generated exercise can be rendered in multiple languages without duplicating the full exercise content per locale
- the current app behavior continues to work during migration with no forced big-bang rewrite
- all existing progress, topic selection, level handling, onboarding, mastery, and recommendations continue to work

This plan is written for the current codebase, where exercises are loaded from `public/exercises`, localized in `src/utils/localization.js`, and fetched by `src/utils/exerciseUtils.js`.

## Current State Summary

The current implementation is file-based:

- topic metadata lives in `public/exercises/topics.json`
- each exercise instance is a standalone JSON file under `public/exercises/<topicId>/<exerciseId>.json`
- `fetchTopics()` and `fetchExercise()` in `src/utils/exerciseUtils.js` use `fetch()` against static files
- `localizeTopics()` and `localizeExercise()` in `src/utils/localization.js` overlay language-specific content from `translations`
- the rest of the app assumes an exercise object with the current shape and does not care whether it came from static content or another source

This separation is good enough to migrate safely because the rendering layer is already partially decoupled from the storage layer.

## Root Problem

The current system scales poorly for three reasons:

1. Each exercise instance is stored as content instead of being derived from a reusable pattern.
2. Each language requires duplicating human-readable fields per exercise.
3. Increasing exercise count mostly increases maintenance cost, review cost, and translation cost, not pedagogical value.

## Target Architecture

Implement four layers.

### 1. Generator Registry

Each exercise family is a reusable generator module.

Examples:

- `solve-one-step-linear-equation`
- `find-missing-arithmetic-progression-term`
- `simplify-fraction`
- `convert-fraction-to-percentage`
- `compare-decimals`

Each family owns:

- difficulty profiles
- parameter generation rules
- validation constraints
- canonical answer generation
- hint strategy
- explanation step generation
- topic mapping and metadata

### 2. Locale-Neutral Exercise Model

The generator must produce a structured exercise object whose mathematical meaning is independent of language.

It must contain:

- stable metadata
- generated parameters
- answer specification
- structured question payload
- structured hint payloads
- structured explanation steps

It must not contain fully written English or Hebrew paragraphs as the primary source of truth.

### 3. Locale Renderer

The renderer converts structured exercise data into the existing UI-facing exercise shape.

This layer is responsible for:

- localized instructions
- localized question text
- localized input labels
- localized hints
- localized explanation steps
- RTL/LTR direction concerns where relevant

The math itself should remain locale-neutral unless the expression contains natural language.

### 4. Compatibility Adapter

The app should continue consuming the current exercise interface during migration. Add an adapter that converts generated exercises into the same shape currently returned by `fetchExercise()`.

This is the primary regression-control mechanism.

## Non-Negotiable Constraints

The migration must preserve these constraints:

- client-side only architecture
- no backend dependency
- compatibility with GitHub Pages deployment
- localStorage-based persistence and resume behavior
- zero compile warnings or errors
- mobile-first UX
- existing topics, levels, onboarding, mastery, and recommendation flows remain operational

## Migration Strategy

Do not replace the current system in one step. Use a phased migration behind a stable boundary.

### Phase 0. Freeze the Public Exercise Contract

Before building generators, define the current exercise object as a contract.

Create a reference schema for the current UI-facing exercise shape. The app currently expects fields equivalent to:

- `id`
- `topicId`
- `topicName`
- `difficulty`
- `instructions`
- `question.text`
- `question.mathExpression`
- `inputs[]`
- `hints[]`
- `explanation.steps[]`

Action items:

- document the current shape in code comments or a JS schema module
- create runtime validation for both static exercises and generated exercises
- create fixtures from a few existing JSON exercises to use as regression references

Success condition:

- any source, static or generated, can be judged against one shared contract

### Phase 1. Introduce a New Exercise Source Layer

Refactor `src/utils/exerciseUtils.js` so the rest of the app no longer knows whether an exercise came from a JSON file or a generator.

Add an internal source interface such as:

```js
// conceptual interface
getTopics(language)
getExercise({ topicId, exerciseId, language })
listExercisesForTopic(topicId)
```

Implement two sources:

- `staticExerciseSource`
- `generativeExerciseSource`

Then add a facade such as:

```js
getExerciseSource()
fetchTopics(language)
fetchExercise(topicId, exerciseId, language)
```

Rules:

- keep the exported signatures of `fetchTopics()` and `fetchExercise()` unchanged at first
- keep current callers untouched during this phase
- do not change persistence shape yet

Success condition:

- the app behaves identically after refactor while still using only static exercises

### Phase 2. Add the Generative Domain Model

Create a generator engine under `src/generators`.

Recommended structure:

```text
src/
  generators/
    engine/
      createExerciseInstance.js
      generatorRegistry.js
      seededRandom.js
      validateGeneratedExercise.js
    families/
      algebra/
      fractions/
      decimals/
      percentages/
      arithmetic-progression/
    renderers/
      toUiExercise.js
      locale/
        en.js
        he.js
```

Define a generated exercise instance format. Example shape:

```js
{
  meta: {
    topicId: 'algebra',
    familyId: 'solve-one-step-linear-equation',
    difficulty: 'level01',
    seed: 'alg-l1-000123',
    generatorVersion: 1,
  },
  prompt: {
    kind: 'solve_for_variable',
    variable: 'x',
    expression: {
      left: ['x', '+', 5],
      right: 12,
    },
  },
  answers: [
    {
      name: 'x',
      inputType: 'number',
      correctAnswer: '7',
    },
  ],
  hints: [
    { kind: 'concept_inverse_operation', operation: 'subtract', value: 5 },
    { kind: 'apply_inverse_to_both_sides', operation: 'subtract', value: 5 },
  ],
  explanation: {
    steps: [
      { kind: 'start_equation', expression: 'x + 5 = 12' },
      { kind: 'subtract_both_sides', value: 5 },
      { kind: 'simplify_result', result: 'x = 7' },
      { kind: 'check_solution', substitutedResult: '7 + 5 = 12' },
    ],
  },
}
```

Rules:

- all generator output must be deterministic from topic, family, difficulty, and seed
- all answer logic must be derived from the generated parameters, never handwritten separately
- explanation steps must be structured events, not only raw text

Success condition:

- a generated instance can fully describe the exercise without embedding per-language prose

### Phase 3. Build the Locale Renderer

Implement translation catalogs for generated exercise content.

The renderer should accept:

- generated exercise instance
- target language

And return the same UI exercise shape the app currently uses.

Example responsibilities:

- map `prompt.kind = solve_for_variable` to localized `instructions` and `question.text`
- map structured hints to localized strings
- map explanation step kinds to localized step strings
- supply localized input labels

Rules:

- keep language-specific strings outside generator family logic
- keep locale-independent math assembly outside translation text when possible
- support English and Hebrew from the first implementation
- design locale catalogs so a new language can be added without touching math generators

Success condition:

- the same generated instance renders correctly in English and Hebrew with no duplicated authored exercise content

### Phase 4. Add a Stable Exercise ID Strategy

The current app depends on string exercise IDs. Preserve that behavior.

Generated exercises need stable IDs built from:

- topic
- family
- difficulty
- seed
- optional generator version

Recommended pattern:

```text
<topicId>--<familyId>--<difficulty>--<seed>
```

Example:

```text
algebra--solve-one-step-linear-equation--level01--000123
```

Rules:

- IDs must be reproducible
- IDs must be URL-safe and storage-safe
- IDs must not change when language changes
- IDs must remain unique across all topics and families

Success condition:

- localStorage, history, mastery, and recommendations can continue referring to exercises by ID

### Phase 5. Introduce Topic Exercise Manifests Instead of Static Exercise Lists

Today, `topics.json` stores explicit exercise IDs for every topic.

Move toward a manifest-based model. A topic should define which families and difficulty bands are available, not enumerate every instance.

Example conceptual topic config:

```js
{
  id: 'algebra',
  name: 'Algebra',
  translations: {
    he: { name: 'אלגברה' },
  },
  families: [
    {
      familyId: 'solve-one-step-linear-equation',
      difficulties: ['level01', 'level02'],
      seedPoolSize: 200,
    },
  ],
}
```

Migration rule:

- keep `topics.json` readable by the current app until the source facade is ready
- then either extend `topics.json` with generator metadata or move to JS-based topic manifests loaded by the source layer

Do not break onboarding, level filters, or recommendations while making this change.

Success condition:

- topics describe exercise production capability instead of long static exercise inventories

### Phase 6. Generate Exercises on Demand

Once the source layer and renderer are ready, `fetchExercise()` should be able to:

- detect whether the requested exercise is static or generated
- return a localized UI exercise object either way

Generation flow:

1. parse exercise ID
2. identify topic, family, difficulty, and seed
3. generate locale-neutral exercise instance
4. validate it
5. render it to the current UI exercise shape
6. return it to the caller

Rules:

- generated content must be validated before rendering
- if generation fails, the source layer must fail safely and surface a controlled error
- during migration, prefer falling back to static content over showing a broken exercise

Success condition:

- current screens consume generated exercises without needing UI rewrites

### Phase 7. Preserve Current Selection and Progress Logic

The app stores:

- active topic
- active exercise ID
- topic history
- per-exercise state
- level selection
- onboarding state
- mastery state
- recommendations state

These are used in `src/context/AppContext.jsx`.

Migration rules:

- do not change the meaning of existing persisted keys in the first rollout
- generated exercise IDs must work with the current `exerciseStates` map
- topic history should continue storing exercise IDs as opaque strings
- answer validation should still work against the UI-facing `inputs[].correctAnswer` contract until a later refactor

Only after the generator path is stable should you consider a persistence version upgrade.

Success condition:

- a user can reload the page mid-migration without losing progress or seeing broken resume behavior

### Phase 8. Migrate One Topic Family First

Do not migrate all content at once.

Recommended first candidate:

- Algebra level 1 one-step equations

Why:

- small input model
- clear validation rules
- easy deterministic explanation generation
- already represented in current exercise files

Implementation steps:

1. create one algebra generator family
2. generate a controlled seed pool for level 1
3. expose those exercises through the source layer
4. keep all other topics static
5. compare generated output against several existing algebra exercises

Success condition:

- one topic path is fully generative while the rest of the app remains unchanged

### Phase 9. Replace Enumerated Exercise Pools with Seed Pools

Once a family is stable, stop storing explicit generated exercise IDs in static files.

Instead, the source layer should be able to supply a deterministic candidate pool for a topic and level from:

- family list
- difficulty list
- seed pool size
- optional weighting strategy

The app currently uses random selection inside a topic-level exercise list. Preserve the visible behavior while replacing the backing pool.

Rules:

- avoid repeating the same seed too frequently for a learner
- maintain enough variety to feel fresh
- preserve level filtering behavior

Success condition:

- the app still selects exercises like today, but from generated candidate sets instead of static arrays

### Phase 10. Gradually Retire Static Exercise Files

Only remove old static exercise JSON after the corresponding generator families are production-stable.

Retirement checklist per family:

- generator passes automated validations
- English and Hebrew render correctly
- no persistence issues found in manual testing
- onboarding and recommendations still function for that topic
- fallback behavior has been tested

Keep a rollback path until the family has been stable across multiple test cycles.

## Detailed Engineering Requirements

### A. Seeded Randomness

Use deterministic seeded randomness, not `Math.random()` directly inside generators.

Requirements:

- same seed always produces the same parameters
- generator output must be stable across reloads
- tests must be able to snapshot seed outputs

Use a small deterministic PRNG helper under `src/generators/engine/seededRandom.js`.

### B. Constraint Validation

Each family must reject poor exercise variants.

Examples:

- avoid zero denominators
- avoid negative values for beginner fractions if not intended
- avoid duplicate equivalent forms that reduce challenge
- avoid trivial identities or unsolvable equations
- avoid answers with too many decimals unless the level expects them

Every generator family needs:

- `generateCandidate()`
- `isValidCandidate()`
- bounded retry logic

If bounded retries fail, throw a controlled generation error.

### C. Structured Explanation Steps

Do not store explanation prose as the source of truth.

Store explanation steps as typed operations such as:

- `subtract_both_sides`
- `simplify_fraction`
- `find_common_denominator`
- `compute_common_difference`
- `substitute_and_check`

This is required for:

- multilingual rendering
- explanation consistency
- automated testing of pedagogical correctness

### D. Input and Answer Contract

The UI currently validates against `inputs[].correctAnswer`.

Preserve that initially. The generated-to-UI adapter should emit `inputs` in the current format.

Later, if needed, introduce richer answer evaluators behind the source layer, but do not change the UI contract during the first migration.

### E. Topic and Level Compatibility

The level system already matters across topic selection and recommendation logic.

Each generator family must explicitly declare which difficulties it supports.

Do not infer level support from seed output. Make it declarative.

### F. Localization Separation

Split localization into two domains:

- UI chrome and app copy
- exercise-generation copy

The current `src/utils/localization.js` handles a large UI message catalog plus exercise overlay behavior. Do not overload it further with generator logic.

Recommended direction:

- keep app UI messages where they are for now
- create a separate generated-exercise locale layer under `src/generators/renderers/locale`
- have `toUiExercise()` call into that locale layer

### G. Backward Compatibility

The migration must support both:

- legacy static exercise JSON
- new generated exercise IDs

This mixed mode is required until all priority topics are migrated.

## Required Code Changes by Area

### 1. `src/utils/exerciseUtils.js`

Refactor into a facade over multiple exercise sources.

Required outcomes:

- preserve current exports initially
- route requests through a new source abstraction
- add generated exercise resolution without changing component call sites

### 2. `src/utils/localization.js`

Do not keep adding per-exercise translation overlays there for generated content.

Required outcomes:

- keep legacy localization behavior for static exercises
- do not break `localizeTopics()` or `localizeExercise()` for existing files
- generated exercise rendering should occur before or alongside the current localization boundary, not by inflating this file further

### 3. `src/context/AppContext.jsx`

Keep reducer logic stable as long as possible.

Required outcomes:

- no breaking changes to state persistence in the first rollout
- generated exercise IDs work with current `topicHistory` and `exerciseStates`
- topic selection still resolves level-appropriate exercise pools

### 4. `public/exercises/topics.json`

Do not delete immediately.

Required outcomes:

- continue supporting current topics during mixed-mode rollout
- either extend the metadata gradually or let the new source layer bypass the need for explicit enumerated generated IDs

### 5. New `src/generators` tree

This is the main implementation area.

Required outcomes:

- registry of generator families
- deterministic generation engine
- validation layer
- locale renderers
- adapter back to current UI exercise shape

## Testing and Regression Prevention

The instruction "make sure everything will continue working without bugs, regressions or new unexpected issues" should be implemented as a disciplined rollout process, not treated as a promise without safeguards.

The engineer must add automated and manual checks before enabling any generated family in the default app flow.

### Automated Tests Required

1. Contract tests

- validate that every generated exercise rendered to UI shape matches the current exercise contract

2. Determinism tests

- same seed returns byte-equivalent generated structure

3. Answer correctness tests

- generated `correctAnswer` values match solver output

4. Locale rendering tests

- English and Hebrew renderers both produce complete strings for all prompt, hint, and explanation step kinds

5. Candidate quality tests

- generate at least hundreds of samples per family and assert no invalid forms are emitted

6. Compatibility tests

- current components can render generated exercises without code-path-specific failures

7. Persistence tests

- active generated exercise can be stored and restored through the existing app state model

### Manual Test Matrix Required

For each migrated family, verify:

- topic selection from sidebar
- level switching
- answer submission
- hint reveal
- explanation reveal
- next exercise flow
- resume after reload
- language switch between English and Hebrew
- onboarding diagnostic usage if that topic appears there
- recommendations and mastery interactions after solving or failing generated exercises
- mobile layout and RTL display

### Release Safety Controls

Use a feature flag or configuration gate for generative families.

Requirements:

- enable generator families selectively by topic and difficulty
- keep instant rollback available by disabling the family mapping
- keep static fallback available during rollout

## Suggested Implementation Order

1. Freeze and validate the current exercise contract.
2. Refactor `exerciseUtils` to a source facade with no behavior change.
3. Add generator engine, registry, seeded randomness, and validation utilities.
4. Implement generated-to-UI renderer for English and Hebrew.
5. Implement one algebra level 1 family.
6. Add tests and feature flagging.
7. Enable mixed mode for that one family only.
8. Validate persistence, recommendations, onboarding, and mastery behavior.
9. Expand to the next highest-volume families.
10. Retire static JSON only after repeated stable verification.

## Specific Do and Do Not Rules

### Do

- preserve the current UI exercise object during initial migration
- keep generator math logic separate from language rendering
- prefer deterministic seed-based generation over ad hoc runtime randomness
- validate every generated candidate before rendering it
- migrate one family at a time
- keep a static fallback path until confidence is high

### Do Not

- do not replace all static exercises in one PR
- do not embed English or Hebrew prose directly into generator logic as the primary source of truth
- do not change persisted app state shape early unless required
- do not make localization depend on exercise-specific handwritten translations for generated families
- do not rely on LLM output at runtime for the final exercise content shown to learners

## Recommended First Deliverable

The first engineering milestone should be:

- new `src/generators` architecture in place
- `exerciseUtils` routed through a source facade
- one fully working algebra level 1 generative family
- English and Hebrew rendering for that family
- feature flag to enable or disable that family
- automated tests covering determinism, contract, and rendering

If that milestone is stable, the architecture is proven.

## Acceptance Criteria for the Full Transformation

The migration is considered successful only when all of the following are true:

- the app can serve exercises from both static and generated sources during rollout
- generated exercises are deterministic and reproducible by ID
- the same generated exercise renders correctly in English and Hebrew
- adding a new language requires locale work, not rewriting exercise content
- adding a new exercise family does not require authoring hundreds of JSON files
- current user-facing flows continue to work without functional regressions
- old static content can be retired family by family with rollback available

## Final Architectural Decision

The correct long-term model for Mathrix is:

- reusable exercise families
- deterministic generation from seeds and difficulty profiles
- structured mathematical and pedagogical representations
- locale-specific rendering into the current UI contract
- mixed-mode backward compatibility until migration is complete

This approach reduces content duplication, improves multilingual scalability, and minimizes migration risk by preserving the current app contract while replacing the exercise production mechanism underneath it.