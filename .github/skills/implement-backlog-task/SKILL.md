---
name: implement-backlog-task
description: Standard workflow for taking a task from the backlog, reading the UI/UX instructions created by the UI/UX expert, implementing it, and updating the backlog documentation.
---

# Backlog Task Implementation Workflow

When asked to implement a task from the backlog, follow these exact steps:

## 1. Task Comprehension
- Locate the target task in the backlog file (review the title, description, user story, and examples).
- Review the associated UI/UX instructions created by the UI/UX expert agent.
- Stop and verify your understanding. Ask clarifying questions if anything is ambiguous.

## 2. Implementation
- Plan the implementation.
- Execute the task, ensuring the code follows the current agent's coding standards.
- Refer to the UI/UX instructions as needed to ensure the implementation aligns with the design specifications.

## 3. Backlog Management (Post-Implementation)
Once the implementation is complete and compiling successfully:
- Mark the task as completed in the backlog file.
- If necessary, add a "Developer notes" section at the end of the specific task with additional context.
- Add a summary section under the task containing:
  - A very high-level description of what was changed.
  - Step-by-step instructions on how to test the implementation manually.