# Mathrix - Application Specification

## 1. Overview
Mathrix is a client-side only web application designed to help children aged 11-14 practice math exercises. The app dynamically generates questions, checks answers, provides interactive hints, and offers detailed step-by-step solutions for unresolved exercises.

## 2. Tech Stack
- **Framework/Build Tool**: React with Vite
- **Language**: JavaScript (ES6+, specifically *No TypeScript*)
- **Styling/Assets**: Google Fonts, Heroicons
- **Storage**: `localStorage` (Client-side persistence only)

## 3. Layout & User Interface

**Design Guidelines:** The design must be bright, clean, and convenient for reading. Since the target audience is teenagers (ages 11-14), the visual style should be engaging but not childish, finding a balance between approachability and maturity.

The application layout is divided into three main responsive columns/areas:

### 3.1 Primary Sidebar (Topics)
- Displays available math topics.
- Vertically scrollable.

### 3.2 Secondary Sidebar (Exercise History)
- Opens when a topic is selected.
- Displays a chronological list of exercises for the chosen topic, starting with the first exercise.
- Appends new exercises to the list as the user progresses.
- Features status icons next to each exercise:
  - **Green √ (Check)**: Successfully solved.
  - **Red X**: Failed (after 3 incorrect attempts).
  - **No Icon**: Pending/Currently active.
- Vertically scrollable. Allows users to click past exercises to review them.

### 3.3 Main Exercise Area
Displays the active exercise. Structured top-to-bottom as follows:

1. **Top Action Bar** (Scoped to the main area, not full-page width):
   - **Check Answers**: Submits the user's input. 
     - *State*: Disabled by default. Enabled only when all answer inputs are filled and the current input differs from previous failed attempts.
   - **Give Hint**: Displays a contextual hint.
   - **How to solve?**: Reveals the detailed explanation/solution.
   - **Next**: Navigates to the next generated exercise.
     - *State*: Disabled by default. Enabled only when the exercise is explicitly marked as "solved" or "completed" (e.g., correct answer, 3 failed attempts, or user clicked "How to solve?").
2. **Hint Area**: Appears above the instructions when the "Give hint" button is clicked. Visually distinct design.
3. **Instructions**: Text description defining the task.
4. **Exercise Display**: The main visual focus. Needs prominent sizing and clear typography.
5. **Answer Inputs**: Dynamic input fields depending on the question type (e.g., inputs for `X = ?` and `Y = ?`).
6. **Reasoning Textbox**: A generic `<textarea>` where the user can physically type out their thought process or working steps.
7. **Explanation Area**: Hidden by default. Renders the full step-by-step solution. Only appears if the user clicks "How to solve?".

## 4. Interaction & Core Logic

### 4.1 Answer Validation Lifecycle
- Users have a maximum of **3 attempts** per exercise.
- If the user is incorrect, they are prompted to try again (up to the limit).
- The "Check Answers" button prevents spamming by staying disabled unless the user alters their input from a previously failed attempt.
- After 3 incorrect attempts, the exercise is marked as "Failed" (Red X), and the "Next" button is enabled to prevent blocking the user.

### 4.2 Application State & Persistence
- The app relies entirely on the browser's `localStorage`.
- **Session Resumption**: On page load, the application must read from `localStorage` and resume exactly where the user left off (same topic, same active exercise, preserving input fields and attempt counts if possible).
- All progress markers (completed exercises, history, unlocked topics) are continuously synced to `localStorage`.

## 5. Future Considerations (Out of Scope for Initial Version)
- Backend synchronization / User authentication.
- Complex analytics.
