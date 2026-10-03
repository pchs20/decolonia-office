# Contributing

This document defines the development practices for Decolonia Office. It is
also the operating guide for AI-assisted work in this repository.

## Working Principles

- Use OpenSpec to turn ideas into explicit, reviewable requirements and tasks.
- Keep implementation changes minimal, focused, and consistent with the
  repository's existing patterns.
- Keep the working tree safe: do not overwrite, reset, or remove changes made
  by another contributor or worktree.
- Treat ambiguity, blockers, and design/spec mismatches as reasons to pause and
  ask for direction rather than guessing.

## Repository Layout

- `openspec/` contains OpenSpec configuration, specifications, active changes,
  and archived changes.
- `openspec/config.yaml` selects the `spec-driven-with-adr` schema.
- `.opencode/` contains OpenCode commands and skills for the OpenSpec workflow,
  when present.
- `.claude/` contains Claude commands and skills for the OpenSpec workflow, when
  present.
- `.github/` contains GitHub-specific prompts, workflows, skills, and templates,
  when present.
- `docs/adr/` contains durable Architecture Decision Records. Keep ADRs outside
  `openspec/changes/` so they persist across changes. Create an ADR only when a
  change introduces or modifies a durable architectural decision. Accepted ADRs
  are immutable; replace a decision with a new ADR that supersedes the old one.
- `.github-token` and `.env` are local-only files and must never be committed.
- `worktrees/` is the shared location for task worktrees and is ignored by Git.

## OpenSpec Workflow

OpenSpec is the source of truth for planning and validating changes. The
default artifact sequence is:

`proposal.md` -> `specs/<capability>/spec.md` -> `design.md` -> `tasks.md`

Add `docs/adr/*.md` when the design introduces or changes a durable architectural
decision. The workflow is intentionally fluid, but implementation should
normally follow this loop:

1. Explore the problem before committing to a solution:
   `/opsx-explore <topic>`.
   Exploration is for investigation and clarification. It must not implement
   application code. OpenSpec artifacts may be created when explicitly asked.
2. Start a guided change with `/opsx-new <change-name>`, then use
   `/opsx-continue <change-name>` once per artifact. The change name must be
   kebab-case and becomes the branch name.
3. Alternatively, use `/opsx-propose <change-name>` for the one-shot planning
   flow. This creates all artifacts required to become implementation-ready.
4. Before creating artifacts, inspect existing specs and, when relevant,
   `CONTEXT.md` and every accepted, non-superseded ADR in `docs/adr/`. Use
   established terminology.
5. Use `/opsx-apply <change-name>` to implement the tasks. Read all context
   files returned by OpenSpec before editing. Keep `tasks.md` checkboxes current,
   changing `- [ ]` to `- [x]` immediately after each completed task.
6. If implementation exposes a missing requirement or design problem, update
   the relevant OpenSpec artifact before continuing. Pause for clarification
   when the task or intended behavior is unclear.
7. Run `/opsx-verify <change-name>` after implementation. Verification checks
   completeness, correctness, and coherence against the tasks, specs, design,
   and ADRs. Resolve critical issues before closing the change.
8. Run `/opsx-sync <change-name>` when the change contains delta specs. This
   merges additions, modifications, removals, and renames into `openspec/specs/`
   while preserving unrelated main-spec content.
9. Run `/opsx-archive <change-name>` after verification and required sync. The
   archive destination is derived from the OpenSpec planning home and uses
   `YYYY-MM-DD-<change-name>`.

Use OpenSpec's status and instruction output as the source of truth for paths:

```bash
openspec list --json
openspec status --change "<change-name>" --json
openspec instructions <artifact-id> --change "<change-name>" --json
```

Do not assume that a planning home or artifact path is repository-local when
the CLI reports otherwise.

## Branches

- Branch from the latest `main` unless the work depends on another branch.
- Create the branch when planning is complete and implementation is about to
  begin, after the OpenSpec iteration name has been established.
- Name the branch exactly after the OpenSpec iteration name. Do not add
  prefixes, suffixes, or descriptions.
- Keep one focused change per branch.

Example:

```text
add-feature-name
```

## Worktrees

Use a separate Git worktree only when the user explicitly requests one.
Otherwise, work in the current checkout.

When a worktree is requested:

1. Inspect the current checkout before creating it:
   `git status --short --branch`.
2. Create the task worktree under this repository's `worktrees/` directory.
   Keep all task worktrees under that shared directory.
3. Use the corresponding task worktree for every implementation and validation
   command. Do not edit or validate the task in the original checkout.
4. Treat the original checkout as a source-only checkout when the
   synchronization procedure explicitly requires it.
5. Never overwrite, reset, delete, or clean changes belonging to another
   worktree or contributor.
6. After the branch has been merged and the worktree is no longer needed,
   confirm that it contains no uncommitted work. Remove only the worktree you
   own and prune stale metadata:

   ```bash
   git worktree remove worktrees/<change-name>
   git worktree prune
   ```

If the user provides commands for creating a worktree, follow those commands
and ensure the resulting worktree is under `worktrees/`.

## Validation

Complete implementation and required validation as one working-tree change set
before requesting review. Run the standard checks unless the change does not
make them relevant:

```bash
pnpm test
pnpm check
pnpm build
```

When the change affects the running application's API or database connectivity,
start the required local services and run:

```bash
pnpm verify:connectivity
```

Run any additional project-specific checks documented in `README.md`, including
focused tests when appropriate. Run linting or formatting when the repository or
affected package provides those checks. Run the relevant checks for the change,
record failures accurately, and do not claim a check passed unless it was
executed.

Run `/opsx-verify <change-name>` after implementation. Before requesting review,
inspect the complete diff and status and remove unrelated changes from the
proposed change set.

## Commits

- Keep commits focused and logically complete.
- Do not create, amend, or otherwise modify commits until the user has reviewed
  the completed implementation and explicitly approved committing it. This
  review gate applies to all work, including AI-assisted work.
- Complete the implementation and required validation as one working-tree
  change set before requesting that review, except when a checkpoint, ambiguity,
  blocker, or other question specifically requires the user's attention earlier.
- After approval, use one or more focused commits only when the changes
  naturally form separate logical units. Do not force multiple commits, and do
  not force unrelated changes into one commit merely because the task is
  finished.
- Use Conventional Commits:
  `<type>(<optional-scope>): <imperative description>`.
- Valid types include `feat`, `fix`, `docs`, `style`, `refactor`, `test`,
  `chore`, `ci`, `build`, and `perf`.
- Keep the subject concise and do not end it with a period. Add a body when
  context or rationale is useful.
- Do not commit generated files, credentials, local environment files, caches,
  or build output.

After the user approves committing, and before each commit:

```bash
git status
git diff
git diff --cached
```

Stage only files belonging to that logical change. Keep implementation, tests,
documentation, dependency updates, and mechanical formatting separate when
that makes the history clearer. Never stage unrelated user or contributor
changes.

After committing, inspect the result:

```bash
git show --stat
git show
```

Example commit:

```text
feat(scope): add feature description
```

## GitHub And Pull Requests

The GitHub MCP integration, when configured in `opencode.json`, reads its token
from the local `.github-token` file. Use the configured integration for
repository operations when available, and never print, share, or commit the
token.

Ask the user for explicit permission before committing, pushing a branch, or
opening a pull request, unless that permission was granted at the beginning of
the conversation.

Before opening a pull request:

1. Confirm the branch is based on the intended target branch, normally `main`.
2. Check `git status --short --branch` and inspect the complete diff.
3. Review every commit included in the branch, not only the latest commit.
4. Remove unrelated changes, generated files, and credentials from the
   proposed diff.
5. Run relevant tests, linting, formatting, type checks, builds, and OpenSpec
   verification.
6. Search for and follow a repository pull request template if one exists.
7. Resolve conflicts before requesting review.

Use a title in this format:

```text
<gitmoji> <imperative description>
```

Choose one primary rendered Gitmoji from [gitmoji.dev](https://gitmoji.dev/).
Do not use `:alias:` syntax or combine several emojis. The description should
be short, imperative, and describe the overall change. Do not include an issue
number, trailing period, or Conventional Commit prefix such as `feat:`.

Keep the pull request description concise, specific, and focused on the
user-visible or technical outcome. Start directly with the change summary and
do not add a `Summary` header or a separate reviewer-notes section. Do not
include validation results, test status, or validation blockers unless the user
explicitly requests them. The title must encompass all related commits; it does
not need to match any individual commit message.

After opening a pull request, assign it to `pchs20` by default unless the user
explicitly requests a different assignee. Read the PR back from GitHub and
verify that the requested assignee is present, the base branch is correct, and
the title and description match this document. If assignment or verification
fails, report the failure and do not claim the PR is complete. Retry assignment
once when the failure is recoverable; otherwise stop and ask for direction.

Do not merge your own pull request unless repository policy explicitly permits
it.

## Safety Rules

- Check `git status --short --branch` before worktree creation, committing, or
  pushing.
- Never use destructive reset, checkout, clean, or removal commands on changes
  you do not own.
- Never expose or commit `.github-token`, `.env`, passwords, API keys, or other
  credentials.
- Keep the user informed when a decision, blocker, checkpoint, or permission is
  required.
