---
name: cv-project-value-writing
description: "Write CV resume content that highlights project value, business impact, and ownership. Use when turning project work into strong bullet points, portfolio summaries, interview-ready talking points, and role-targeted achievements."
argument-hint: "Provide role target, project context, and evidence (metrics, scope, stack, ownership)."
user-invocable: true
---

# CV Project Value Writing

## What This Skill Produces
- Role-targeted CV bullets that emphasize value, not just tasks
- Project summary lines for CV, LinkedIn, or portfolio entries
- Optional interview talking points that map to each bullet

## Default Style
- Balanced technical plus business framing
- Outcome-first wording with concise implementation context
- Credible impact claims supported by evidence or clear scope signals

## When to Use
- You need to write or improve project entries for a CV/resume
- Existing bullets list technologies but not outcomes
- You want to show ownership, complexity, and measurable impact

## Inputs To Collect
- Target role and level (for example: Backend Engineer, Mid-Level)
- Project context (problem, users, domain)
- Your ownership (what you designed, built, led, or improved)
- Tech stack (languages, frameworks, infrastructure)
- Evidence (metrics, baseline, improvement, scale)
- Constraints (time, cost, reliability, compliance)

## Procedure
1. Define target role outcomes.
Match the bullet language to the hiring signal for the target role.

2. Extract value chain from each project task.
Convert each activity into: action -> system change -> user or business result.

3. Choose a bullet pattern.
Use one of these forms:
- Built X using Y, enabling Z at scale A.
- Reduced A by B percent through C, improving D.
- Led E across F teams, delivering G under constraint H.

4. Add concrete evidence.
Prefer numbers, ranges, and relative improvements. If exact metrics are unknown, use honest bounded estimates and label them clearly.

5. Encode technical depth only where it supports value.
Keep stack details concise unless the target role depends on them.

6. Tighten language.
Use strong verbs, remove filler, keep each bullet outcome-first and specific.

7. Run quality checks.
Validate with the checklist below before finalizing.

## Decision Rules
- If there are verified metrics: use exact numbers.
- If metrics are unavailable: use directional impact with scope signals (for example: multi-tenant, production, thousands of records).
- If impact is indirect: state the operational outcome (faster delivery, fewer incidents, better maintainability).
- If the role is backend/platform: prioritize reliability, performance, scalability, architecture.
- If the role is product/full-stack: prioritize user outcomes, conversion, feature adoption, and delivery speed.

## Quality Checklist
- Each bullet starts with a strong action verb
- Each bullet includes a result or impact, not just implementation detail
- At least one bullet shows ownership or leadership
- At least one bullet signals complexity (scale, constraints, integrations)
- Language matches target role and avoids vague claims
- No unsupported or misleading metrics

## Output Format
For each project, produce:
1. One-line project summary
2. Three to five role-targeted bullets
3. Optional two interview talking points tied to strongest bullets

## Rewriting Examples
Weak:
- Worked on an AI property marketplace using Next.js and NestJS.

Strong:
- Built an AI-assisted property marketplace with Next.js and NestJS, reducing property discovery time by surfacing intent-matched listings and streamlining booking flow.

Weak:
- Implemented authentication and APIs.

Strong:
- Designed JWT-based auth and modular API services in NestJS to secure tenant-scoped access and support reliable property, booking, and AI-query workflows.

Weak:
- Added booking and dashboard pages.

Strong:
- Implemented booking orchestration and dashboard workflows across the Next.js client and NestJS APIs, improving end-to-end transaction clarity for users and reducing manual follow-up load.

## Prompt Starters
- Rewrite my AI Property Marketplace bullets for a balanced technical-plus-business CV tone.
- Turn this AI Property Marketplace summary into 5 impact-focused bullets for a full-stack role.
- Create interview talking points from my AI Property Marketplace bullets and map each to business value.
