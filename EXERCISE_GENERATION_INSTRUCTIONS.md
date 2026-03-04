# AI Instructions: Generating Mathrix Exercise JSON Files

This guide explains how to generate new math exercise JSON files for the Mathrix project and properly link them into the application's structure.

## 1. Directory Structure
All exercises are stored in `public/exercises/`. Inside this directory, there are folders for each topic:
- `algebra/`
- `fractions/`
- `percentages/`

When generating a new exercise, save it inside the corresponding topic folder.

## 2. File Naming Convention
Exercise files must be named using the following format:
`[topicId]-[difficulty]-[sequence_number].json`

**Examples:**
- `algebra-easy-006.json`
- `fractions-hard-001.json`

## 3. Updating the Index (`topics.json`)
After creating an exercise JSON file, you **must** update the index file located at `public/exercises/topics.json`. Find the corresponding topic object by its `id` and append the new file's name (without the `.json` extension) to its `exercises` array.

```json
{
  "id": "algebra",
  "name": "Algebra",
  "exercises": [
    "algebra-easy-001",
    "algebra-easy-002",
    "...",
    "algebra-easy-006" // <- Add new exercise ID here
  ]
}
```

## 4. Exercise JSON Schema
Every exercise file must strictly follow this JSON structure:

```json
{
  "id": "algebra-easy-001",           // Must match the file name (without .json)
  "topicId": "algebra",               // Matches the folder name and topic ID
  "topicName": "Algebra",             // Display name of the topic
  "difficulty": "easy",               // e.g., "easy", "medium", "hard"
  "instructions": "Solve for x.",     // High-level instruction to the user
  "question": {
    "text": "What is the value of x?",
    "mathExpression": [
      "$$ x + 5 = 12 $$"              // Use LaTeX notation wrapped in $$ for expressions
    ]
  },
  "inputs": [                         // Define the input fields the user needs to answer
    {
      "name": "x",                    // Unique name for this input
      "label": "x =",                 // Label shown next to the input
      "inputType": "number",          // e.g., "number", "text"
      "correctAnswer": "7"            // The correct answer as a string
    }
  ],
  "hints": [                          // Provide 2-3 progressive hints
    "Think about what number, when added to 5, gives you 12.",
    "You can isolate x by subtracting 5 from both sides of the equation."
  ],
  "explanation": {                    // Provide a step-by-step solution
    "steps": [
      "1. We start with the equation $$ x + 5 = 12 $$.",
      "2. To find x, we need to get it alone on one side. Subtract 5 from both sides: $$ x + 5 - 5 = 12 - 5 $$.",
      "3. Simplify: $$ x = 7 $$.",
      "4. Check: substitute back — $$ 7 + 5 = 12 $$ ✓"
    ]
  }
}
```

## 5. Best Practices & Rules
- **Math Formatting**: Always use KaTeX/LaTeX standard wrap with `$$` for block math or math lines (e.g., `$$ \frac{1}{2} $$`). Do not leave math as plain text.
- **Multiple Inputs**: For things like fractions, provide multiple elements in the `inputs` array (e.g., one for `numerator` and one for `denominator`).
- **Steps**: In the `explanation.steps` array, make each step clear and easy to read. Number the steps naturally (1., 2., 3., etc.).
- **Consistency**: Maintain consistency with existing ID sequencing (e.g., pad sequences with zeroes like `001`, `002`).