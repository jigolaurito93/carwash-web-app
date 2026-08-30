# Project slash commands

Type `/` in chat, then the skill name. Highlight a file or folder (or `@` it) first.

| Command | Skill | What it does |
|---|---|---|
| `/explain` | [explain](explain/SKILL.md) | Plain-language walkthrough of the selection |
| `/code-review` | [code-review](code-review/SKILL.md) | Bugs, performance leaks, type safety |
| `/generate-tests` | [generate-tests](generate-tests/SKILL.md) | Vitest + RTL unit tests for the selection |

These skills are `disable-model-invocation: true` — they run only when you invoke them, not on every message.
