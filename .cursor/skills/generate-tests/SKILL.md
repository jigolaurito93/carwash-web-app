---
name: generate-tests
description: >-
  Generates unit tests for Onyx carwash code. Use when the user runs
  /generate-tests or asks for unit tests, specs, or test coverage. This repo
  has no runner yet; default to Vitest + React Testing Library.
disable-model-invocation: true
---

# Generate tests

Slash command: **`/generate-tests`**

Write unit tests for the **highlighted file**, `@` path, or named module.

## Framework (this repo)

There is **no** Jest, Vitest, or Playwright setup today (`package.json` has no `test` script).

**Default stack to add (once, then reuse):**

- Vitest + `jsdom` + `@testing-library/react` + `@testing-library/jest-dom`
- Install with **pnpm** only
- Colocate: `lib/foo.ts` → `lib/foo.test.ts`; `components/Foo.tsx` → `components/Foo.test.tsx`

If Vitest is still missing, say so in one sentence, add the minimal config + `package.json` `"test": "vitest"` **only if** the user wants setup in the same turn, then write the tests. Do not add Playwright unless they ask for e2e.

## What to test

| Target | Focus |
|---|---|
| Zod (`lib/validations/*`) | valid payload, missing fields, bad email |
| Server Actions | success update, `revalidatePath` targets, error return — mock `@/lib/supabase` or `createServerClient` |
| Route handlers | 400 on failed `safeParse`, 200 on Resend success — mock `resend` |
| Pure helpers (`lib/us-states.ts`, `cn`) | real cases, no component mount |
| Client components | submit, empty state, modal open — mock Supabase |

Do **not** test: `lib/database.types.ts`, page layout/CSS, or legacy folders (`all-services*`, `servicespage`, `admin/services`) unless asked.

## Patterns

- `import { describe, it, expect, vi } from "vitest"`
- Alias `@/` must work (mirror `tsconfig` in `vitest.config.ts`)
- Never use real `NEXT_PUBLIC_*` or `.env.local` values. Stub env in the test file.
- Mock network/DB. No live Supabase or Resend calls.
- Prefer `safeParse` / exported functions over mounting entire admin tables.

## Output

1. Write the test file(s).
2. Reply with:

```markdown
# Tests

**Target:** [source file]
**Files added:** [test path(s)]
**Run:** `pnpm test [path]`

**Cases:**
- [ ] ...
```

If you only planned tests and did not write them, say that explicitly.