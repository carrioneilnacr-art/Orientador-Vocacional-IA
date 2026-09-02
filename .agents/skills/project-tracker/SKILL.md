---
name: project-tracker
description: >-
  Use this skill to inspect, update, and manage project progress, tasks, Kanban boards, and Definition of Done (DoD) in docs/tracking/PROJECT_TRACKING.md.
---

# Project Tracker Skill

This skill enforces disciplined project tracking across all development phases.

## Workflow

1. **Before starting a task:**
   - Inspect `docs/tracking/PROJECT_TRACKING.md` to identify the task ID and its prerequisites.
   - Update the task status from Backlog (⚪) to In Progress (🟡).

2. **During implementation:**
   - Ensure all sub-tasks comply with the Definition of Done (DoD).
   - If an unexpected blocker arises, document it in the risks section of the tracking file.

3. **Upon completion:**
   - Verify that all acceptance criteria are met (lint, tests, schema verification).
   - Move the task to Done (🔵 `[x]`).
   - Log the completion date and summary of changes in the tracking history.
