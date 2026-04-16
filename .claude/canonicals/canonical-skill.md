<!--
Status: Authoritative
Last updated: 2026-04-15
Owner: JLW (Principal Engineer review required for changes)
Scope: All 8 apps in the vlp-platform monorepo
Parent: canonical-app-blueprint.md
-->

# canonical-skill.md

Template for SKILL.md files that define reusable execution skills.

---

## Required Sections (in order)

### 1. Header
- Skill name
- Version
- Owner
- One-line purpose

### 2. Purpose
What this skill does in one sentence. Skills are atomic, reusable operations that the Execution Engineer can execute exactly.

### 3. Inputs
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| {field} | string/number/boolean/array | yes/no | {rules} |

### 4. Preconditions
What must be true before execution:
- Required files exist
- Required data is available
- Previous skills have completed
- Working directory is correct (`apps/{abbrev}/` or `apps/worker/`)

### 5. Execution Logic
Ordered, explicit, step-by-step. No interpretation or judgment calls.
1. Read {file}
2. Transform {data} according to {rules}
3. Write {output} to {path}
4. Validate {conditions}

### 6. Output
Exact output shape, fields, structure, constraints:
- File path(s) written
- Data format (JSON, CSV, MD)
- Required fields in output

### 7. Side Effects
What is written/updated, where, when, in what format:
- R2 keys modified
- D1 tables updated
- Files created/modified in repo

### 8. Failure Handling
For each possible failure:
- Skip and log, OR
- Halt execution, OR
- Retry with backoff

### 9. Constraints
Skill-specific rules:
- Do not modify files outside the target app directory
- Do not call endpoints not listed in canonical-api.md
- Validate output against contract schema if applicable

### 10. Example
One full input/output golden case demonstrating correct execution.

### 11. Non-Goals
What the skill explicitly does NOT do.
