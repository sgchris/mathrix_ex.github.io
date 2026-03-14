# Mathrix Product Backlog

This backlog is ordered from highest product impact to lower-priority polish. It assumes the current baseline already includes topic browsing, level selection, exercise history, hints, step-by-step explanations, scratch-pad reasoning, local persistence, Hebrew localization, and optional Google sign-in with cloud sync.

## P0

### [x] 1. Diagnostic Onboarding and Personalized Grade Path
Description: Add a first-run diagnostic that places each learner on an appropriate starting path by grade band and skill confidence. This is a must because the app currently expects the learner to choose a topic and difficulty manually, which creates friction and makes the experience feel less guided for younger students.

User story: As a new student, I want Mathrix to quickly figure out what level fits me so I can start with exercises that feel challenging but not discouraging.

Example 1: A 12-year-old answers 6 mixed starter questions and is placed into a "Grade 6 Foundations" path focused on fractions, decimals, and percentages.
Example 2: A returning learner who performs strongly in algebra is moved toward pre-algebra and arithmetic progression instead of repeating easy content.

Priority: P0

Developer notes:
- Added a persisted onboarding gate above the existing shell, including welcome, grade-band selection, 6-question diagnostic, placement result, manual starting-point adjustment, and kickoff into the recommended first exercise.
- Existing learners with prior history are not hard-blocked; they see a setup card in the main area and can keep using manual topic selection.
- The learner profile now persists through the main app state, localStorage, and the existing Firebase sync flow.

What changed:
- Introduced onboarding state, diagnostic scoring, learner-profile persistence, and personalized topic/level recommendations.
- Added a full-surface onboarding UI with English/Hebrew localization and RTL-safe layouts.
- Updated the topic sidebar and empty state to surface the learner path after onboarding completes.

Manual test instructions:
- Open the app with a clean local state and confirm the onboarding flow appears before the normal shell.
- Complete the flow in English, accept the recommendation, and verify the first recommended exercise opens with the suggested topic and difficulty.
- Refresh mid-diagnostic and confirm the exact onboarding step and question resume correctly.
- Switch to Hebrew during onboarding and verify translated copy, mirrored layout, and correct path completion behavior.
- Load the app with existing saved exercise history but without onboarding data and confirm the app stays usable while showing the personalized-path setup card.

### [x] 2. Mastery Map by Skill, Topic, and Grade
Description: Build a visual mastery map that shows progress at the skill level, not just exercise history. This is a must because students need to see what they have mastered, what is weak, and what comes next if Mathrix is going to become a habit-forming study tool rather than a random exercise player.

User story: As a student, I want to open one screen and see which math skills are green, yellow, or red so I know what to practice next.

Example 1: "Equivalent Fractions" shows 85% mastery, while "Percent Increase and Decrease" shows 40% and is flagged for review.
Example 2: A learner finishes three algebra exercises correctly and sees the algebra node advance from "Practicing" to "Almost Mastered."

Priority: P0

Developer notes:
- Added a dedicated `masteryMap` app mode with a persisted mastery screen, grade-band sections, topic clusters, skill nodes, list view, and a responsive detail panel/bottom sheet.
- Introduced a lightweight skill taxonomy and derived mastery scoring layer from existing `exerciseStates`, including persisted filters, selected skill, view mode, and expanded topics.
- Linked the new map from onboarding kickoff, the topic sidebar, the path-aware empty state, and completed exercises without resetting the learner's active practice context.

What changed:
- Added mastery utilities for skill manifests, exercise-to-skill mapping, mastery-state scoring, and direct launch recommendations back into practice.
- Extended app state with persisted mastery UI preferences and exact exercise launch support for skill-level practice actions.
- Added English and Hebrew mastery copy plus responsive UI styling, and split large vendor bundles in Vite so the production build stays warning-free.

Manual test instructions:
- Open the app as a learner with existing practice data, open `Mastery Map`, and verify the summary, grade bands, topic clusters, and skill states render without losing the active exercise.
- Switch between map and list view, apply grade/topic/state filters, refresh the page, and confirm the selected view and filters are restored.
- From the onboarding kickoff and the personalized empty state, open the mastery map and verify the recommended grade band and path topics are highlighted.
- Finish an exercise, use the new map link, and confirm the corresponding skill detail opens and `Practice now` launches a matching exercise in that skill.
- Repeat the flow in Hebrew and verify translated labels, mirrored layout, and bottom-sheet behavior on mobile width.

### [ ] 3. Adaptive Recommendation Engine for "What Should I Do Next?"
Description: Replace the mostly manual next-step flow with a recommendation engine that proposes the next best exercise, topic, or review set based on mistakes, solved history, and recency. This is a must because students often do not know what to practice after finishing one exercise, and that uncertainty reduces session length and return rate.

User story: As a learner, I want Mathrix to recommend the next exercise automatically so I can stay in flow without planning my own study path.

Example 1: After two failed percentages exercises, Mathrix suggests an easier percentages review before returning to the original difficulty.
Example 2: After several correct fraction exercises, Mathrix suggests decimals because it is the next relevant skill in the learner's path.

Priority: P0

### [ ] 4. Daily Practice Loop with Streaks, Streak Freeze, and Smart Reminders
Description: Introduce a daily practice system with short missions, streak tracking, a limited streak-freeze mechanic, and optional reminder prompts stored locally. This is a must because repeat usage in this age group is driven by simple ritual and visible continuity, not only by content depth.

User story: As a student, I want a quick daily goal and a visible streak so I feel motivated to return every day and keep momentum.

Example 1: "Today's mission: solve 4 exercises and use at most 1 hint."
Example 2: A learner misses one day but keeps a 9-day streak by using one saved streak freeze earned through prior practice.

Priority: P0

### [ ] 5. Mixed Review Mode with Spaced Repetition
Description: Add a review mode that mixes older solved skills with weak or recently failed skills using spaced repetition logic. This is a must because durable math learning depends on revisiting concepts over time, and the current experience is centered on single-topic progression.

User story: As a learner, I want Mathrix to bring back the right old questions at the right time so I do not forget what I learned last week.

Example 1: A student who solved fractions three days ago gets one quick fraction refresher inside today's mixed set.
Example 2: A learner who repeatedly misses decimal comparison sees that skill return sooner and more often than already stable skills.

Priority: P0

### [ ] 6. Error-Aware Feedback and Targeted Hinting
Description: Upgrade answer checking so the app identifies common mistake patterns and responds with targeted feedback and hints instead of only generic incorrect states. This is a must because young learners improve faster when feedback names the misconception, not just the result.

User story: As a student, I want Mathrix to tell me what kind of mistake I made so I can fix my thinking instead of guessing again.

Example 1: For percentages, the app detects that the learner calculated the percentage amount but forgot to add it back to the original value.
Example 2: For fractions, the hint says "You added the numerators but left the denominators unchanged. Do the denominators match first?"

Priority: P0

### [ ] 7. Goal System with Short Sessions and Weekly Targets
Description: Let students choose lightweight goals such as "10 minutes a day," "finish 3 skills this week," or "master percentages before Friday," then track visible progress toward them. This is a must because goals convert casual exploration into intentional practice and give return visits a purpose.

User story: As a learner, I want to set a clear practice goal so I know what success looks like this week.

Example 1: A student selects a weekly goal to complete 12 exercises across fractions and decimals.
Example 2: Before an exam, a learner sets a 5-day goal focused only on algebra review and sees progress fill up each day.

Priority: P0

### [ ] 8. Curriculum Expansion to Full Grade 6-12 Pathways
Description: Expand the content library from the current 5 topics and 185 exercises into a structured Grade 6-12 roadmap with major strands such as geometry, ratios, linear functions, equations, probability, statistics, and early trigonometry. This is a must because the product ambition is much broader than the current coverage, and the app cannot become a long-term habit without enough curriculum depth.

User story: As a student, I want Mathrix to grow with me across school years so I can keep using one familiar app instead of switching tools every few months.

Example 1: A Grade 7 learner practices ratios and proportion, then later unlocks linear equations in the same guided path.
Example 2: A high-school learner returns to use Mathrix for algebra review and introductory trigonometry before tests.

Priority: P0

### [ ] 9. Story-Like Progression and Celebratory Milestones
Description: Add milestone moments, chapter completion screens, unlockable paths, and age-appropriate celebrations that make progress feel like forward motion through a journey. This is a must because the current utility-first flow is functional, but it does not yet create enough emotional payoff for younger users to share it or talk about it.

User story: As a student, I want finishing a skill pack or grade chapter to feel rewarding so I feel proud and motivated to continue.

Example 1: Completing the "Fractions Foundations" chapter unlocks a short celebration, a mastery badge, and the next chapter preview.
Example 2: A learner completes 20 correct answers in a week and sees a "Level Up" screen with newly unlocked review missions.

Priority: P0

### [ ] 10. Shareable Challenge Links and Friend Competitions
Description: Create lightweight social mechanics where a learner can send a challenge set to a friend and compare completion status or score without turning the app into a public leaderboard product. This is a must because virality for this audience comes from simple friend-to-friend sharing and school-group competition.

User story: As a student, I want to challenge a friend to the same math set so practicing feels social and more fun.

Example 1: A learner shares a "Can you beat my 5-question percentages challenge?" link in a class group chat.
Example 2: Two friends complete the same mixed review set and compare accuracy and time afterward.

Priority: P0

## P1

### [ ] 11. Parent and Teacher Progress Snapshot
Description: Add an optional read-only summary view that makes it easy for a parent or teacher to see consistency, strengths, weak skills, and recent activity. This matters because young learners often rely on an adult to reinforce practice habits, but it is not as urgent as the student core loop.

User story: As a parent or teacher, I want a quick progress snapshot so I can support the learner without digging through exercise history manually.

Example 1: A parent sees that the learner practiced 4 of the last 7 days and struggles most with decimals.
Example 2: A teacher receives a link or export showing mastery status across selected topics.

Priority: P1

### [ ] 12. Exam Prep Mode with Timed Sets and Revision Packs
Description: Offer a focused exam-prep mode with timed sets, topic packs, and post-session review by mistake category. This matters because test preparation is a strong return driver, especially for older students, but it depends on the mastery and recommendation foundations above.

User story: As a student preparing for a quiz, I want a timed practice set that feels like a real checkup so I can build confidence before the test.

Example 1: A learner starts a 12-minute percentages-and-fractions revision pack.
Example 2: After the session, Mathrix groups mistakes into categories like "setup errors" and "calculation slips."

Priority: P1

### [ ] 13. Achievement Cabinet and Collectible Rewards
Description: Add a persistent cabinet for earned badges, streak rewards, chapter trophies, and special event collectibles. This matters because recognition supports retention and sharing, but it should follow meaningful mastery systems rather than exist as shallow decoration.

User story: As a learner, I want to collect visible rewards for real progress so my effort feels recognized over time.

Example 1: A student earns the "Fraction Fixer" badge after mastering three fraction subskills.
Example 2: Finishing five daily missions in a row unlocks a limited seasonal trophy.

Priority: P1

### [ ] 14. Accessibility and Learning Support Modes
Description: Expand accessibility with dyslexia-friendly typography options, reduced-motion mode, stronger color-contrast controls, keyboard-first workflows, and optional read-aloud support for instructions. This matters because the app serves school-age learners with different needs, but it can follow once the central practice loop is stronger.

User story: As a learner with different accessibility needs, I want the interface and content presentation to adapt so I can focus on the math instead of fighting the UI.

Example 1: A student enables read-aloud for instructions and explanations in English.
Example 2: Another learner switches to a high-contrast, reduced-motion study mode during long sessions.

Priority: P1

### [ ] 15. Localized Curriculum Tracks Beyond English and Hebrew
Description: Expand localization from interface-level translation toward full curriculum tracks aligned to regional school expectations and examples. This matters for growth, but it should follow once the product has a stronger progression system and clearer mastery model.

User story: As a learner in another region, I want examples and progression that match what I study at school so Mathrix feels relevant to my classes.

Example 1: A regional track emphasizes ratio word problems earlier because that topic appears sooner in that school system.
Example 2: Units, naming, and contextual examples adapt to the learner's locale instead of being generic.

Priority: P1

## P2

### [ ] 16. Seasonal Events and Limited-Time Practice Campaigns
Description: Run themed practice events such as "Back to School Week" or "Exam Sprint" with temporary missions and rewards. This is useful for reactivation and marketing moments, but it depends on the goal, streak, and reward systems being in place first.

User story: As a student, I want limited-time events that make the app feel fresh so I have new reasons to come back.

Example 1: A one-week "Percent Power-Up" event offers a special badge for solving 15 percentage questions.
Example 2: An exam-season campaign bundles quick daily revision missions for two weeks.

Priority: P2

### [ ] 17. Personalization Layer for Avatar, Theme, and Study Space
Description: Add lightweight personalization such as avatar selection, theme unlocks, and a customizable study hub. This can deepen attachment for younger users, but it should stay clearly secondary to learning outcomes and follow once the retention loops are proven.

User story: As a learner, I want to personalize my Mathrix space so the app feels like mine and more enjoyable to revisit.

Example 1: A student unlocks a new avatar frame after completing a chapter.
Example 2: A learner chooses between several study themes tied to milestones rather than random cosmetics.

Priority: P2