<!--
Status: Authoritative
Last updated: 2026-04-18
Owner: JLW (Principal Engineer review required for changes)
Scope: All Principal → Execution Engineer prompts in the vlp-platform monorepo
Parent: canonical-app-blueprint.md
-->

# canonical-rc-prompt.md

Template for prompts that Principal Engineer authors for Execution Engineer
(Claude Code / "RC") to execute in the monorepo. Every Phase 4+ sweep prompt
follows this structure.

This canonical defines the shape of a single RC prompt. Multi-commit
sub-phases are authored as either one prompt with an explicit commit
sequence (§6) or multiple prompts chained by a sweep plan.

---

## Required Sections (in order)

### 1. Header

First line is the task title, formatted:

`# Prompt for RC — {sweep name}: {sub-phase or commit scope}`

Followed by a four-line metadata block:

- **Type:** one of `Read-only audit` / `Code change, single commit` /
  `Code change, N sequential commits` / `Canonical-only update` /
  `Worker change` / `Investigation`
- **Repo:** `c:\Users\eimaj\vlp-platform` (or whichever machine path RC is on)
- **Branch:** typically `main`
- **Scope:** 1–3 line summary of exactly which files/dirs are in play. If
  the answer is "many," name the directories, not every file.

### 2. Pre-flight self-check

Exact bash block RC must run and paste output of, verbatim, before touching
anything:

```bash
pwd
git status --short
git log --oneline -3
```

Plus the expected state (clean tree, HEAD = {hash} or descendant). If dirty
or behind, RC stops and reports.

For multi-commit prompts, pre-flight runs once at the top. Between commits,
RC runs a shorter check (`git status --short` only) before starting the next
commit.

### 3. Required reading (if applicable)

Files RC must read in full before touching code. Listed in order, with one
line each on why. Omit this section if the prompt is self-contained and
doesn't depend on canonical or reference-file context.

### 4. Task

One paragraph. What this prompt accomplishes and why. Written for a reader
who knows the project but hasn't been in the chat — explicit enough that RC
can execute without re-deriving context from prior turns.

### 5. Steps

Numbered, imperative, atomic. Each step is a single discrete action:
"read file X," "edit file Y to do Z," "run build," "commit," "push."

Steps may contain bash blocks, diff snippets, or code templates. No step is
"figure out what to do next" — if a decision needs to be made mid-prompt,
the prompt includes the decision criteria explicitly (see §10 Rules).

For multi-file edits, each file gets its own numbered step. For multi-commit
prompts, steps are grouped by commit with a clear "Commit N of M" boundary.

### 6. Commit plan (if multi-commit)

Explicit breakdown of how the scope splits into sequential commits. For each
commit:

- Commit number and scope
- Which steps from §5 apply
- Commit message template
- What must be green between this commit and the next

Single-commit prompts omit this section and include the commit message
template at the end of §5.

### 7. Verify

The exact verification command(s) that must pass before commit. Typically:

```bash
npx turbo build --filter={app}
```

Plus any app-specific typecheck, lint, or manual trace steps. If a manual
trace is required, the prompt lists the exact state cases to walk through.

### 8. Report back with

Numbered list of exactly what RC must include in the post-execution report.
This is the receipt — it answers "did you do what I asked, and how do I
know." Typical items:

1. Pre-flight output
2. Key diff snippets (before/after on non-trivial edits)
3. Build output tail
4. `git show --stat HEAD` after commit
5. Push confirmation (the `{old}..{new}  main -> main` line)
6. Any surprises, unanswered questions, or state cases caught during
   manual trace

### 9. Rules

Bulleted list of hard constraints on scope. These are the fence posts —
things RC must not do, even if the work seems obvious. Typical entries:

- Do not touch {out-of-scope file/dir}
- Do not modify Worker / canonicals / @vlp/member-ui without escalation
- Do not invent patterns — if a reference file doesn't have the feature,
  stop and report
- If {specific surprise condition}, stop and report before writing code

The canonical invariant: "don't invent" and "stop and report" clauses are
always present for any sweep prompt that ports from a reference
implementation.

### 10. Decision criteria for mid-prompt choices (if applicable)

When a prompt allows RC a choice (which icon, which pattern to match,
which fallback to use), the criteria are written explicitly:

- First try: {preferred source}
- If that doesn't work: {fallback}
- If that doesn't work: stop and report

Never leave a choice ambiguous. Never use "use your judgment" — judgment is
Principal's job, execution is RC's.

---

## Rules for Principal when authoring

1. The prompt is self-contained. RC should not have to re-read chat history
   to execute. If context from prior turns matters, the prompt quotes the
   relevant rulings inline.

2. Every prompt pre-declares its scope fence. RC knows before starting what's
   in and what's out. Scope creep mid-prompt is a sign the prompt was
   under-specified.

3. Reference-file ports always include a "stop and report" rule for the
   reference-doesn't-have-it case. This is non-negotiable after the Support
   commit learning in Phase 4 A5 sub-phase 4.

4. Pre-flight self-check is never skipped, even for trivial prompts. The
   three-line bash block is cheap insurance against state drift between
   Principal's mental model and RC's actual repo state.

5. Multi-commit prompts stop between commits on failure. No piling.

6. Post-execution reports include verifiable receipts (commit hashes, push
   confirmations, diff snippets), not just assertions of success.

---

## Anti-patterns to avoid

- **Vague action verbs.** "Handle the X case" or "address the Y gap" — RC
  can't execute "handle" or "address." Use specific verbs: "add," "delete,"
  "rename," "replace," "gate on."

- **Unbounded scope.** "Fix all the gaps in Account" is a work stream, not
  a prompt. A prompt is a commit. Multi-commit prompts are still bounded —
  N commits with explicit per-commit scope.

- **Hidden context.** Referring to "the helper we discussed" without
  quoting the decision. If Principal ruled on something two turns ago,
  the prompt restates the ruling inline.

- **Missing receipts.** A prompt without §8 Report back with is a prompt
  that can't be reviewed.

- **"Figure it out" clauses.** If Principal doesn't know what to do, the
  answer isn't to delegate the decision to RC. The answer is for Principal
  to investigate or ask Owner, then write a prompt RC can execute.

---

## Change control

Changes to this file require Principal Engineer review. Proposals to change
the prompt format emerge from observed execution problems (unclear steps,
missed receipts, reference-file surprises) — document the triggering
incident in the decision log below.

---

## Decision log

| Date | Change | Rationale |
|------|--------|-----------|
| 2026-04-18 | Created canonical | Phase 4 A5 sub-phase 4 support-commit surprise exposed that "don't invent" rule + "stop and report" pattern had only been written ad-hoc in each prompt. Codifying the prompt format so it's consistent across Phase 4+ sweeps. |
