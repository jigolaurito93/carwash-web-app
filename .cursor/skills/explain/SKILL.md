---
name: explain
description: >-
  Explains a highlighted file or folder in this Onyx carwash app in simple
  terms. Use when the user runs /explain, asks to onboard, or wants a plain
  walkthrough of selected code.
disable-model-invocation: true
---

# Explain (onboarding)

Slash command: **`/explain`**

Explain the user's **highlighted selection**, `@`-mentioned path, or focused file. If none is provided, ask which file or folder to explain.

## Steps

1. Read the target. If it is a folder, list files, then read the entry points (usually `page.tsx`, `layout.tsx`, `actions.ts`, `route.ts`, or `index`).
2. Classify the surface:
   - **Public** — `app/page.tsx`, `about`, `services`, `gallery`, `contact`, `components/` (not `admin/`)
   - **Admin live** — `shop-info`, `categories1`, `services1`
   - **Admin stub / legacy** — `dashboard`, `appointment`, `gallery` (admin), `profile`, `admin/services`, `all-services*`, `servicespage`, `services1test`
   - **Shared** — `lib/`, `proxy.ts`, `app/layout.tsx`, `app/api/`
3. Map data: which Supabase table, Server Action, or API route it uses. Live tables only: `categories1`, `services1`, `shop_info`, `shop_hours`, `site_announcements`. Call out leftover tables by name if present.
4. Note Server vs Client (`"use client"`), and which Supabase helper (`createServerClient` vs `lib/supabase.ts`).
5. Do not print env values, keys, or cookie contents.

## Output

```markdown
# [File or folder name]

**In one sentence:** what this code is for.

**Where it sits:** public | admin live | stub/legacy | shared

## What it does

3–6 bullets a new engineer can follow.

## How data moves

Request → component/action/route → Supabase or Resend → UI. Say "none" if static.

## Related files

- `path` — why it matters

## Watch-outs

Legacy tables, commented CRUD, mixed clients, or stubs. Omit this section if none.
```

Keep language simple. No line-by-line lecture. Quote a short snippet only when it unlocks the idea.
