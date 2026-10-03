---
description: Review this conversation for durable corrections, preferences, and process improvements
---

Read the entire conversation in this session, including my messages and your responses. Treat the conversation as evidence, not as a request to flatter me or to invent lessons.

Your goal is to identify durable improvements that would make a future session sharper.

## Analyze

Extract only evidence-backed items from these categories:

- **Corrections I made**: facts, terminology, scope, implementation choices, or workflow assumptions I corrected.
- **Preferences I stated or demonstrated**: communication style, coding style, tool usage, workflow, testing, documentation, or decision-making preferences.
- **Things you would do differently**: mistakes, unnecessary questions, missed context, poor assumptions, inefficient tool use, or places where your response could have been more precise.
- **Already captured**: lessons that are already documented in the applicable context files and do not need to be duplicated.

Do not treat a request specific to the current feature, a temporary constraint, or a single domain fact as a global preference unless the conversation supports that conclusion. Consolidate duplicates. Flag uncertainty instead of presenting an inference as a rule.

## Inspect Context

Before making recommendations, inspect the repository's instruction and context files that are relevant to future sessions. At minimum check:

- `AGENTS.md` and any nested `AGENTS.md` that governs the relevant files
- `openspec/config.yaml`
- Relevant files under `.opencode/`, `.claude/`, `.github/`, `docs/`, and any `CONTEXT.md` files

Use the actual files and headings that exist. Do not assume a `CONTEXT.md` file exists. For this repository, `AGENTS.md` is the primary project guidance file unless a more specific file applies.

## Report

Be extremely concise. Report only clear, evidence-backed improvements that are genuinely worth persisting. Do not report weak inferences, ordinary task details, duplicated guidance, or observations that would not materially improve a future session.

If there are no clear improvements, reply with exactly:

`Nothing to improve.`

If there are clear improvements, return only a flat numbered list using `1.`, `2.`, etc. Do not add headings, preamble, conclusion, or a separate evidence section. Each item must include, in one or two short sentences:

- the improvement as a reusable rule
- the exact repository-relative file and nearest heading where it should be saved
- ready-to-paste proposed text, when different from the rule

Prefer the narrowest correct scope:

- Cross-project agent behavior belongs in `AGENTS.md`.
- OpenSpec planning conventions belong in `openspec/config.yaml` or the relevant `.opencode/` workflow file.
- Architecture decisions belong in `docs/adr/`.
- Feature-specific requirements belong in the relevant OpenSpec spec or change artifact.
- Command-specific behavior belongs in the command or skill file itself.

Use the narrowest correct scope. Do not list non-durable observations. Do not edit files in this command unless I explicitly ask you to apply the recommendations. Never claim that a lesson was saved unless you actually edited and verified the file.
