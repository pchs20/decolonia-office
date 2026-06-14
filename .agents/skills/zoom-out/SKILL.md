---
name: zoom-out
description: Tell the agent to step up one abstraction layer and map the surrounding OpenSpec workflow, relevant modules, callers, and mirrored artifacts. Use when you're unfamiliar with a slice or need system context.
disable-model-invocation: true
---

I don't know this area of code well. Go up a layer of abstraction and give me a map of the relevant OpenSpec artifacts, commands, skills, and callers using the project's domain vocabulary.

For this repository, start with:

- `openspec/config.yaml`
- `openspec/specs/<capability>/spec.md`
- `openspec/changes/<change>/proposal.md`, `design.md`, and `tasks.md`
- `.opencode/commands/opsx-*.md`
- `.opencode/skills/openspec-*.md`
- mirrored `.github/prompts/` and `.github/skills/`

Then trace:

- who calls or consumes the relevant artifact, command, or skill
- how it fits into `/opsx-explore`, `/opsx-new`, `/opsx-apply`, `/opsx-verify`, `/opsx-sync`, and `/opsx-archive`
- any glossary terms from `CONTEXT.md`, or from `README.md` and `AGENTS.md` if no `CONTEXT.md` exists yet

Use this skill whenever a change crosses artifact boundaries or you need the bigger-picture shape of the OpenSpec workflow before editing.
