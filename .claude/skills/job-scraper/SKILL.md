---
name: job-scraper
description: >
  Scrapes Turkish job sites (kariyer.net, LinkedIn Türkiye, etc.) for new positions matching your profile. Deduplicates across runs.
  Triggers on: job scrape, find jobs, search jobs, new jobs, job search, scrape jobs, /scrape
allowed-tools: Read, Write, Edit, Glob, Grep, WebFetch, WebSearch, Agent, AskUserQuestion
---

# Job Scraper

---

## How It Works

This skill searches multiple Turkish job sites using targeted queries based on your profile, deduplicates against previously seen jobs and the application tracker, and presents new matches with a quick fit assessment.

## Invocation

The user triggers this skill by saying things like:
- "Find new jobs"
- "Scrape for jobs"
- "Any new positions?"
- "/scrape"

Optional arguments:
- A focus area, e.g. "/scrape cloud" or "/scrape backend"
- A specific count, e.g. "/scrape 10" to override the default target

**Default mode is bulk:** target **20-30 new (non-duplicate) postings** per run, sourced primarily from LinkedIn, with only a brief fit check per posting — not the deep evaluation from `04-job-evaluation.md`. The goal is a wide list for the user to triage, not a small curated shortlist.

---

## Execution Steps

### Step 0: Load State

1. Read `job_scraper/seen_jobs.json` (create if missing - start with `{"seen": {}}`)
2. Read `job_search_tracker.csv` to extract already-applied companies+roles
3. Read `search-queries.md` (this directory) for the search strategy

### Step 1: Search

Run **WebSearch** queries from `search-queries.md`. By default, run **all priority categories** (not just the top 3) — bulk mode needs breadth across cloud/platform, backend, automation, and mobile to reach the 20-30 target. If the user specified a focus area (e.g. "cloud"), prioritize queries from that category but still supplement with others if the count target isn't met.

Weight queries toward **LinkedIn first** (`site:linkedin.com/jobs`), then kariyer.net and the other configured portals, since LinkedIn is the user's primary source for this search.

For each search:
- Use `WebSearch` with site-specific queries
- Target the configured geographic area (all of Turkey — see `search-queries.md`)
- Look for postings from the last 14 days
- Keep going across categories/queries until you hit the count target (20-30 new postings) or run out of reasonable queries to try — don't stop after the first few results if the target isn't met

### Step 2: Fetch & Parse

For each promising result from Step 1:
- Use `WebFetch` to retrieve the job posting page
- Extract: **job title**, **company**, **location**, **posting date** (or "recent"), **URL**, **key requirements** (brief), **application deadline** (if listed)
- Skip if the URL or company+title combo already exists in `seen_jobs.json`
- Skip if the company+role already appears in `job_search_tracker.csv`

### Step 3: Quick Fit Assessment

For each new job, do a rapid fit check (NOT the full evaluation from `04-job-evaluation.md` — that's reserved for `/apply` on jobs the user actually selects. Never run the full scoring framework during a bulk scrape, even for high-match jobs):

- **High match**: Role directly involves your core skills
- **Medium match**: Role is adjacent to your experience
- **Low match**: Role requires significant skills you lack

### Step 4: Deduplicate & Store

1. Add ALL fetched jobs (new and skipped) to `seen_jobs.json` with structure:
```json
{
  "seen": {
    "<url_or_company_title_key>": {
      "title": "...",
      "company": "...",
      "url": "...",
      "first_seen": "YYYY-MM-DD",
      "fit": "high/medium/low",
      "status": "new/skipped/evaluated"
    }
  }
}
```
2. Only present jobs NOT already in the seen list or tracker.

### Step 5: Present Results

Present new jobs in a table sorted by fit (high first):

```
## New Job Matches - YYYY-MM-DD

Found X new positions (Y high, Z medium, W low match).

| # | Fit | Title | Company | Location | Deadline | URL |
|---|-----|-------|---------|----------|----------|-----|
| 1 | High | ... | ... | ... | ... | [Link](...) |

### High-Match Highlights
For each high-match job, add 1-2 bullet points (brief — this is bulk triage, not full evaluation):
- Why it matches your profile
- Any obvious red flags
```

After presenting, ask the user to triage the list into four buckets by number:
> "Which numbers do you want to: (1) **skip**, (2) apply with a **generic CV** (no tailoring, no cover letter — fastest), (3) apply with a **tailored CV only** (no cover letter), or (4) apply with a **full tailored CV + cover letter**? You can group numbers per bucket, e.g. 'generic: 3,7,12 / tailored: 5,9 / full: 2'."

Once the user assigns buckets, execute per bucket using the tiers defined in `job-application-assistant/SKILL.md` → "Bulk Application Tiers". Process generic-CV jobs first (fastest), then tailored-only, then full applications last (slowest, one at a time).

### Step 6: Update Tracker (Optional)

If the user decides to apply to any job, add a row to `job_search_tracker.csv`.

---

## Important Rules

1. **Never fabricate job postings.** Only present jobs found via actual WebSearch/WebFetch results.
2. **Respect deduplication.** Always check seen_jobs.json AND job_search_tracker.csv before presenting.
3. **Focus on configured geographic area.** Skip jobs that require relocation or are clearly outside commute range.
4. **Only open positions.** Skip postings with expired deadlines or those marked as closed.
5. **Be efficient with WebFetch.** Don't fetch every search result - use titles and snippets to pre-filter before fetching.
6. **Parallel searches.** Use the Agent tool or parallel WebSearch calls to speed up the search phase.
