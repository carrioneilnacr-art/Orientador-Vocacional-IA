---
name: git-workflow
description: >-
  Use this skill to perform standardized git operations, create Conventional Commits, manage branches, and push code changes to GitHub.
---

# Git Workflow Skill

Standardizes version control operations and ensures atomic, descriptive commits linked to the GitHub repository.

## Commit Message Format

Use Conventional Commits standard:
`<type>(<scope>): <short imperative description>`

### Allowed Types
- `feat`: A new user-facing or architectural feature.
- `fix`: A bug fix or schema correction.
- `docs`: Documentation, markdown updates, or tracking logs.
- `test`: Adding or refactoring tests.
- `refactor`: Code changes that neither fix a bug nor add a feature.
- `chore`: Tooling, dependency, or build configuration updates.

### Examples
- `feat(db): add questionnaire and vocational rules tables`
- `docs(rules): define project governance and tracking dashboard`
- `fix(ai): handle missing tuition fee category gracefully`

## Push Protocol
1. Check working directory status (`git status`).
2. Stage relevant files specifically (`git add <files>`).
3. Commit with semantic message (`git commit -m "..."`).
4. Push to origin (`git push origin <branch>`).
