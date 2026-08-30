---
name: code-review
description: >-
  Audits Onyx carwash code for bugs, performance leaks, and type safety. Use
  when the user runs /code-review, asks for a review, or wants a PR/diff audit.
disable-model-invocation: true
---

# Code review

Slash command: **`/code-review`**

Review the user's **selection**, `@` paths, or **unstaged/branch diff**. If the scope is unclear, review the current diff.

## Steps

1. Gather the change (read files or `git diff`).
2. Audit the three required areas below, plus Onyx-specific checks.
3. Report only real issues. No style nits already covered by Prettier.

## Required audit

**Bugs**
- Wrong table (`categories` / `all_services` / `services_packages` instead of `categories1` / `services1`)
- Mutations that skip `revalidatePath` on admin **and** public pages (`/`, `/services`, `/contact`)
- Auth gaps: new `/admin/*` routes that bypass `proxy.ts`; login moved into `(admin-protected)`
- Contact/API: missing Zod parse, leaking internals in JSON
- Null-unsafe `.single()` / missing empty states

**Performance leaks**
- Client Supabase (`lib/supabase.ts`) in new Server Components
- Waterfall fetches that could be `Promise.all`
- Missing `revalidatePath` / over-fetching `select('*')` when a few columns suffice
- Heavy client JS on public pages that could stay RSC
- Unbounded lists without limit/order; images without `next/image` where the file already uses it

**Type safety**
- `any`, unchecked `json`, untyped `FormData`
- Hand-edited `lib/database.types.ts` (should come from `pnpm gen:types`)
- Layout JSON not matching `ServiceRow` / `layout1_data`–`layout4_data` in `lib/app.types.ts`
- Ignoring Supabase `{ data, error }`

## Also flag

- New `middleware.ts` (must stay `proxy.ts`)
- Prisma/Drizzle, npm/yarn, Tailwind v3 config
- Secrets in source
- Extending frozen legacy folders (`all-services*`, `servicespage`, `admin/services`)

## Output

```markdown
# Code review

**Scope:** [files or diff]

## Findings

### 🔴 Critical
- **[file:line]** Problem. Why it breaks. How to fix.

### 🟡 Warning
- **[file:line]** ...

### 🟢 Note
- **[file:line]** ...

## Summary
1–3 sentences: ship / fix-first / blocked.
```

Omit empty severity sections. Do not rewrite the file unless the user asks.