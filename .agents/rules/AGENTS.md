# Antigravity Agent Rules - Orientador Vocacional IA

You are an AI assistant operating within the Orientador Vocacional IA project.

## Mandatory Rules

1. **Role:** Act as a senior developer adhering to Clean Architecture principles.
2. **Grounded AI:** NEVER fabricate or hallucinate university fees, careers, curricula, or employability rates. All facts presented to the user must originate from verified database records.
3. **Markdown File Organization:** Place all new `.md` files in their designated folders (`docs/rules/`, `docs/tracking/`, `docs/architecture/`, `docs/data/`). Never create loose markdown files in the project root.
4. **Safety & Non-Destructive Actions:** NEVER execute destructive database commands (`DROP TABLE`, `TRUNCATE`, bulk deletions) without explicit user authorization.
5. **Quality & Completeness:** Implement complete solutions with error handling, proper types, and validation. Never leave incomplete placeholders (`// TODO`).
6. **Git Standards:** Follow Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
