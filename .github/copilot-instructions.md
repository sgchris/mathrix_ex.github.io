# GitHub Copilot Instructions for Mathrix

## Project Overview
Mathrix is a client-side only web application designed for children aged 11-14 to practice math exercises. It dynamically generates questions, checks answers, provides interactive hints, and offers detailed step-by-step solutions for unresolved exercises.

## Core Tech Stack & Constraints
- **Language**: JavaScript (ES6+) **ONLY**. Do **NOT** use TypeScript under any circumstances.
- **Framework & Build Tool**: React + Vite.
- **Styling & Assets**: Standard CSS, Google Fonts, and Heroicons. Mobile-first design is required.
- **Storage/State**: Client-side **only**. All data persistence must be handled strictly via `localStorage`.
- **Deployment**: The project uses GitHub Actions workflows for CI/CD and is deployed to GitHub Pages. All routing and assets must be compatible with GitHub Pages environment (client-side routing fallback, base paths).

## ⚠️ Critical Rule: Libraries & Tools Versions ⚠️
- **Always use the latest stable versions** for all libraries, frameworks, and tools (React, Vite, Heroicons, etc.).
- **Use Context7 MCP**: Before scaffolding, implementing new libraries, or providing library-specific code snippets, you **MUST** use the Context7 MCP (`mcp_context7_resolve-library-id` and `mcp_context7_get-library-docs`) to fetch the latest stable versions, up-to-date documentation, and current best practices. Do not rely on outdated training data for API definitions.

## Architectural Guidelines
1. **No Backend**: Do not write backend code, setup Node servers for API handling, or use real/mocked HTTP requests to external databases.
2. **State Resumption**: Always ensure that the user's progress (active exercise, attempt history, solved exercises) is immediately synced to `localStorage` and smoothly resumed on page reload.
3. **Component Structure**: Keep React components modular and functional. Use React Hooks for state and effect management.
4. **Zero Warnings/Errors**: The project must always build and compile cleanly without any errors or warnings. Ensure that all generated code is robust and follows strict compilation guidelines.
5. **Mobile-First & Responsiveness**: The app MUST be fully mobile-friendly and responsive. Always test structural, CSS and styling changes to confirm usability and layout clarity on small screens (e.g., phones, tablets) as well as desktops.

## Workflow & Agent Guidelines
1. **No Extra Markdown**: Do not create any additional `.md` files unless explicitly requested by the user.
2. **CLI Usage**: You are allowed and encouraged to use CLI commands to install/update tools or libraries, run builds, start the dev server, etc.
3. **Git Operations**: Git commands are restricted to read-only operations (e.g., `git status`, `git diff`, `git log`). Do not execute state-mutating Git commands.