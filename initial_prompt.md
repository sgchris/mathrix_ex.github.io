# Mathrix

An app the generates math exercices for various levels and school grades. Main goal is to provide the ability to practice various kinds of exercices, by generating the question itself, checking the answers, giving hints, and finally explaining the solution if the exercise wasn't solved, or an explanation was required explicitly.

## Brief

An online web app, client side only at this stage, mainly targeted to provide practicing math exercises for children of age 11-14. 

### Left sidebars

The left side panel of the app will have the topics that the user can choose from. When choosing a topic, another, additional left sidebar will be opened with list of exercises starting with a single exercise. More exercises will appear as the current exercise is solved. 

That second sidebar with exercises meant to keep the history of the solved exercises and have the ability to go back and review them again. Near every exercise there will appear a green √ or a red X icon indicating the success in solving the exercise, or nothing if the exercise wasn't yet solved. When choosing an exercise, the main area of the web app will display the exercise itself.

Both left panels are vertically scrollable.

### Main area

The following sections and items will appear from the top down.

- A top bar with the buttons "Check answers", "Give hint", "How to solve?", "Next". The top bar is above the main app area only, not above all the web page. 
  * When clicked, it tells whether the provided answers are correct or not. Check answers button is initially disabled, and is getting enabled only when all the answer inputs are filled with possible answers. When the answers aren't correct, it gives another attempt, totally 3 attempts. The button is enabled only when the provided answers differ from the preious attempts.
  * Give hint shows a hint at the top of the page, above exercise instructions, and has a slightly different design.
  * "Next" button is initially disabled, and is enabled only when the exercise is marked as solved. The exercise is marked as solved after 3 failing attempts, or when the user clicks "How to solve" button.
- A description or an instruction of the exercise
- The exercise itself. Make that section the most noticable
- A place to provide the answer. One or more text inputs, depending on the exercise. For example, 2 inputs to provide with X equals and what Y equals.
- An input (text area) with description of how the user solved the exercise
- An area that will be used to explain how the exercise has to be solved. That area is empty, and appears only when the user asks how to solve (a button on the top bar).


## Tech stack

- Javascript (No Typescript)
- React
- Vite
- Google fonts
- Heroicons
- localStorage only

### Clarifications

- Client side only app. Everything is stored on localStorage.
- Use the latest stable versions of the libraries and the tools for this project. Use Context7 MCP to fetch the latest stable versions
- When the page loads, the user has to continue from where he left the page last time.