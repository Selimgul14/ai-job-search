---
name: job-application-assistant
description: >
  Assists with job applications: evaluating job postings, tailoring CVs, writing cover letters,
  and preparing for interviews. Triggers on keywords like: job posting, job application, CV,
  cover letter, resume, interview prep, job fit, career, application, apply, ansøgning, stilling
allowed-tools: Read, Glob, Grep, WebFetch, WebSearch, Edit, Write, AskUserQuestion
---

# Job Application Assistant

---

## Workflow

When the user provides a job posting (URL or text), follow this workflow:

### Step 1: Research & Evaluate Fit
- Fetch the job posting content (use WebFetch for URLs)
- Analyze the posting for required competencies, keywords, and priorities
- Research the company (website, LinkedIn, mission, recent news)
- Score the posting against the candidate's profile using the framework in `04-job-evaluation.md`
- Present the evaluation table and verdict
- Suggest whether the candidate should call the employer before applying (see `04-job-evaluation.md` for guidance)
- Ask the user if they want to proceed with an application

### Step 2: Tailor CV
- Read the most relevant existing CV variant from `cv/` as a starting point
- Follow the guidelines in `05-cv-templates.md`
- Create `cv/main_<company>.tex` with tailored content
- Adjust: profile statement, skills section, experience bullet emphasis, section order

### Step 3: Write Cover Letter
- Follow the writing style rules in `03-writing-style.md` (critical: no em-dashes, no cliches)
- Follow the template structure in `06-cover-letter-templates.md`
- Create `cover_letters/cover_<company>_<role>.tex`
- Ensure the letter connects specific experience to the role requirements

### Step 4: Interview Preparation
- Follow the framework in `07-interview-prep.md`
- Prepare STAR-format answers for likely questions
- Identify role-specific talking points
- Draft questions the candidate should ask the interviewer

---

## Reference Files

| File | Purpose |
|------|---------|
| `01-candidate-profile.md` | Education, experience, skills, publications, awards |
| `02-behavioral-profile.md` | Behavioral assessment, strengths, ideal environments |
| `03-writing-style.md` | Tone, structure, do's and don'ts |
| `04-job-evaluation.md` | Scoring framework for job fit |
| `05-cv-templates.md` | LaTeX CV structure and tailoring rules |
| `06-cover-letter-templates.md` | LaTeX cover letter structure and tailoring rules |
| `07-interview-prep.md` | STAR examples, tough questions, roleplay guidelines |

---

## Quick Commands

The user may also ask for individual steps without the full workflow:
- "Evaluate this job posting" - Step 1 only
- "Write a CV for [company]" - Step 2 only
- "Write a cover letter for [role] at [company]" - Step 3 only
- "Help me prepare for an interview at [company]" - Step 4 only
- "What jobs should I look for?" - Career strategy discussion using profile + evaluation framework

---

## Bulk Application Tiers

After a `/scrape` run, the user triages the result list into up to four buckets. This section defines how to execute each tier. Process **generic first, then tailored-only, then full** (cheapest/fastest to most expensive) so the user sees quick wins land before the slow ones.

### Tier: Skip
No action. Optionally note the reason in `job_search_tracker.csv` (status `skipped`) if the user gave one, otherwise don't bother logging skips.

### Tier: Generic CV (fastest — no tailoring, no cover letter)
- Do not evaluate fit in depth and do not tailor anything.
- Pick one of the three generic one-page CVs by the posting's title alone (created 2026-09-16):
  - **DevOps / SRE / platform / systems / infrastructure** → `cv/Selim_Gul_DevOps_Engineer_CV.pdf` (source `cv/onepage_generic_devops.tex`)
  - **Cloud / cloud platform / Azure / cloud operations** → `cv/Selim_Gul_Cloud_Engineer_CV.pdf` (source `cv/onepage_generic_cloud.tex`)
  - **Backend / software / full-stack / Python / .NET** → `cv/Selim_Gul_Backend_Software_Engineer_CV.pdf` (source `cv/onepage_generic_backend.tex`)
  - If unsure, use the DevOps one. Do NOT use the reference PDFs in `documents/cv/` — they contain an outdated measurement count (1.2M+; correct figure is ~800K).
  - If a PDF is missing or stale, recompile with `xelatex -jobname=<pdf name without .pdf> <source>.tex` from `cv/`.
- No cover letter.
- Tell the user which file to submit for each job in this bucket. Add a row per job to `job_search_tracker.csv` with `cv_file` set to the base CV used, `cover_letter_file` blank, and a note that it was sent unmodified.

### Tier: Tailored CV only (no cover letter)
A lighter, faster version of `/apply` — skip the reviewer-agent research loop and the cover letter entirely:
1. Read `01-candidate-profile.md`, `05-cv-templates.md`, and the closest base CV as a starting point.
2. Tailor the profile statement, skills order, and experience bullet emphasis to the posting (same rules as `/apply` Step 2), writing directly to `cv/main_<company>.tex`.
3. Compile with lualatex and visually inspect the PDF (same mandatory checks as `/apply` Step 5: exactly 2 pages, no orphaned `\cventry` titles).
4. Skip the drafter-reviewer research loop (`/apply` Steps 1, 3, 4) — no company research, no reviewer agent. This tier trades that depth for speed.
5. Log the row in `job_search_tracker.csv`.

### Tier: Full application (tailored CV + cover letter)
Run the complete `/apply` workflow (`.claude/commands/apply.md`) unchanged — full fit evaluation, drafter-reviewer loop with company research, tailored CV and cover letter, compile-and-inspect for both. Reserve this tier for postings the user has flagged as genuinely worth the effort; process one at a time, not in a batch.
