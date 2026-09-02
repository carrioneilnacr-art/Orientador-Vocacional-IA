---
name: db-governor
description: >-
  Use this skill to govern database migrations, inspect Supabase PostgreSQL schemas, validate constraints and relations, and prevent destructive changes.
---

# Database Governor Skill

Enforces relational integrity, migration safety, and proper indexing for PostgreSQL on Supabase.

## Safety Checkpoints

1. **Destructive Operations Guard:**
   - NEVER run `DROP TABLE`, `DROP COLUMN`, or `TRUNCATE` unless explicitly authorized.
   - Prefer non-breaking additions (new nullable columns, additive migrations).

2. **Indexing & Query Performance:**
   - Ensure every foreign key column has an explicit index.
   - Use GIN indices for JSONB or full-text search (`tsvector`) columns.

3. **Data Grounding & Sources:**
   - Every educational fact table (`tuition_fees`, `scholarships`, `curricula`, `employment_indicators`) must link to `sources(id)`.

4. **Verification Step:**
   - After applying any migration via Supabase MCP `execute_sql`, run verification queries to confirm table creation, schema constraints, and foreign key relations.
