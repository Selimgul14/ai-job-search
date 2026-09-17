# Search Queries for Job Scraper

## Candidate
**Selim Gul** — MSc Advanced Computer Science, University of Liverpool (dissertation submitted 11 Sep 2026)
Based in Istanbul, Türkiye. Job search is **Turkey-only** as of Aug 2026 (relocated permanently). Turkish citizen — no visa/work-permit constraints for domestic employers.

## Search Sites

**Primary:**
- linkedin.com/jobs — filter location "İstanbul, Türkiye" / "Türkiye"
- kariyer.net — largest Turkish job portal, strong coverage of tech roles
- secretcv.com
- yenibiris.com
- indeed.com (Turkey listings)

Postings on Turkish portals are frequently in Turkish even for English-language workplaces — search both Turkish and English terms for every category below.

## Query Categories

### Priority 1: Cloud & Platform Engineering
Matches Selim's strongest recent work — the WiFi diagnostics platform (Azure, Bicep, Docker, TimescaleDB, Grafana) and Intertech infrastructure automation (Ansible, Hyper-V/VMware).

```
"bulut mühendisi" İstanbul
"cloud engineer" İstanbul
"devops mühendisi" İstanbul
"devops engineer" İstanbul
"platform engineer" OR "platform mühendisi" Türkiye
"azure" "linux" mühendis İstanbul
"sistem yöneticisi" azure OR ansible İstanbul
site:linkedin.com/jobs "cloud engineer" OR "devops engineer" Türkiye
site:kariyer.net "bulut mühendisi" OR "devops mühendisi"
site:kariyer.net "cloud engineer" OR "devops engineer"
```

### Priority 2: Backend / Software Engineering
Selim's broadest profile — backend, full-stack, systems engineering (Python/FastAPI, C#/.NET).

```
"backend developer" İstanbul
"backend mühendisi" İstanbul
"yazılım mühendisi" python OR "c#" İstanbul
"software engineer" python OR ".net" İstanbul
"full stack developer" İstanbul
"python developer" İstanbul
site:linkedin.com/jobs "software engineer" OR "backend developer" Türkiye
site:kariyer.net "yazılım mühendisi"
site:kariyer.net "backend developer" OR "backend mühendisi"
```

### Priority 3: Automation & Infrastructure (Adjacent)
Roles that match Selim's skills but use different titles — strong secondary net given his Ansible/PowerShell/VM automation background.

```
"sistem mühendisi" İstanbul
"otomasyon mühendisi" python OR ansible
"altyapı mühendisi" İstanbul
"IT operations engineer" İstanbul
"infrastructure engineer" Türkiye
site:linkedin.com/jobs "systems engineer" OR "infrastructure engineer" Türkiye
site:kariyer.net "sistem mühendisi" OR "otomasyon mühendisi"
```

### Priority 4: Mobile Development (Flutter) — Broader Net
Secondary given the current base CVs lean backend/cloud, but still a genuine skill area.

```
"flutter developer" İstanbul
"mobile developer" flutter Türkiye
"flutter mühendisi"
site:linkedin.com/jobs "flutter developer" Türkiye
site:kariyer.net "flutter developer"
```

## Location Filter

- **Ideal:** Istanbul (any district)
- **Acceptable:** Any Turkish city (Ankara, Izmir, Bursa, etc.) — auto-included, no need to flag
- **Acceptable:** Remote roles based in Turkey
- **Too far:** Any role outside Turkey — out of scope for the current search

## Date Filter

Only include jobs posted within the last **30 days**, or with an application deadline that has not yet passed. If posting date cannot be determined, include but flag as "date unknown".

## Visa / Sponsorship Filter

Not applicable — Selim is a Turkish citizen applying to domestic Turkish employers. Do not add visa/sponsorship framing to postings, cover letters, or evaluations for this search.

## Known Limitations

- **kariyer.net, yenibiris.com, and Glassdoor block automated WebFetch** (403 responses as of Aug 2026) — search snippets from these sites can surface leads, but individual listing pages can't be fetched to verify open/closed status. LinkedIn, Indeed Turkey, company career pages, and smaller boards (eleman.net, isbul.net, jobs.smartrecruiters.com, apply.workable.com) fetch fine. When a promising lead only exists on a blocked site, note it as unverified rather than guessing its status.
- A large share of Turkish LinkedIn/portal postings that show up in search results turn out to be expired ("artık başvuru kabul etmiyor") — always verify via WebFetch before including a job in results.

## Adapting Queries

If the user specifies a focus area, select queries from the matching category and generate 2-3 custom queries:
- "/scrape cloud" → Priority 1 queries + `"azure devops" İstanbul` + `"bulut altyapı" mühendis`
- "/scrape backend" → Priority 2 queries + `"api developer" python İstanbul` + `"django developer" İstanbul`
- "/scrape mobile" → Priority 4 queries + `"react native" developer İstanbul` (broader net)
- "/scrape broad" → run all four priority categories
