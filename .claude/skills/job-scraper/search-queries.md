# Search Queries for Job Scraper

## Candidate
**Selim Gul** — MSc Advanced Computer Science, University of Liverpool (graduating Sep 2026)
Open to: UK, Netherlands, Germany, Turkey, Denmark (English-language)
Visa: UK Graduate Visa (no sponsorship, 2yr); NL Orientation Year (no sponsorship, 1yr)

## Search Sites

**Primary (LinkedIn — use for all markets):**
- linkedin.com/jobs — filter by location (United Kingdom / Netherlands / Germany / Turkey / Denmark) and date posted (last 30 days)

**UK-specific:**
- indeed.co.uk
- reed.co.uk
- cwjobs.co.uk

**Netherlands:**
- indeed.nl
- glassdoor.nl
- werkzoeken.nl

**Germany:**
- stepstone.de
- indeed.de
- glassdoor.de

**Turkey:**
- kariyer.net
- linkedin.com/jobs (filter Turkey)

**Denmark (English-language roles):**
- jobindex.dk (filter language: English)
- linkedin.com/jobs (filter Denmark)

## Query Categories

### Priority 1: Cloud & DevOps Engineering
These match Selim's strongest industry experience (Intertech: Ansible, Python, Linux, Azure).

```
"graduate cloud engineer" UK
"cloud engineer" graduate UK
"graduate devops engineer" UK
"devops engineer" graduate UK
"cloud engineer" "azure" UK
"devops engineer" "ansible" OR "terraform" UK
"graduate site reliability engineer" UK
"platform engineer" graduate UK
site:linkedin.com/jobs "cloud engineer" "azure" United Kingdom
site:linkedin.com/jobs "devops engineer" graduate Netherlands
site:stepstone.de "Cloud Engineer" Junior OR Graduate
site:jobindex.dk "cloud engineer" english
```

### Priority 2: Software Engineering (General & Backend)
Selim's broadest profile — backend, full-stack, systems engineering.

```
"graduate software engineer" UK
"software engineer" graduate UK
"junior software engineer" UK
"backend engineer" graduate UK
"backend developer" python OR typescript UK
"full stack engineer" graduate UK
"software developer" graduate Liverpool OR London OR Manchester OR Edinburgh
site:linkedin.com/jobs "software engineer" graduate "python" OR "typescript" "United Kingdom"
site:linkedin.com/jobs "backend engineer" junior Netherlands
site:stepstone.de "Software Engineer" Junior OR Graduate Python OR TypeScript
site:kariyer.net "yazılım mühendisi" OR "software engineer"
```

### Priority 3: Mobile Development (Flutter)
Selim's strongest app-layer experience — Flutter, Dart, Firebase.

```
"flutter developer" UK
"mobile developer" flutter UK
"flutter engineer" UK
"mobile engineer" flutter OR dart UK
"cross-platform developer" flutter UK
site:linkedin.com/jobs "flutter developer" "United Kingdom"
site:linkedin.com/jobs "flutter engineer" Netherlands OR Germany
site:kariyer.net "flutter developer"
```

### Priority 4: Adjacent Roles (Broader Net)
Roles that match Selim's skills but use different titles.

```
"graduate systems engineer" UK
"infrastructure engineer" graduate UK
"automation engineer" python OR ansible UK
"solutions engineer" graduate UK
"technical consultant" graduate UK
"cloud automation" python UK
site:linkedin.com/jobs "automation engineer" "python" OR "ansible" "United Kingdom"
site:linkedin.com/jobs "systems engineer" graduate Netherlands OR Germany
"typescript developer" OR "next.js developer" UK
```

## Location Filter

All locations accepted — Selim is open to relocation countrywide within:
- **Ideal:** Liverpool, London, Manchester, Amsterdam, Rotterdam, Berlin, Munich, Istanbul, Ankara, Copenhagen
- **Acceptable:** Any UK city, any NL city, any DE city, any TR city, any DK English-language posting
- **Remote:** Also acceptable — no preference stated

## Date Filter

Only include jobs posted within the last **30 days**, or with an application deadline that has not yet passed. If posting date cannot be determined, include but flag as "date unknown".

## Visa / Sponsorship Filter

- **UK roles:** Flag if posting says "no visa sponsorship" — Selim does NOT need sponsorship (Graduate Visa). Include these roles.
- **NL roles:** Flag if posting says "no sponsorship" — Selim does NOT need sponsorship for 1 year (Orientation Year Visa). Include these roles.
- **DE/TR/DK roles:** Standard process; note if employer explicitly says they sponsor international candidates.

## Adapting Queries

If the user specifies a focus area, select queries from the matching category and generate 2-3 custom queries:
- "/scrape cloud" → Priority 1 queries + `"cloud native" graduate` + `"azure devops" junior`
- "/scrape mobile" → Priority 3 queries + `"react native" graduate` (broader net) + `"ios developer" flutter`
- "/scrape backend" → Priority 2 queries + `"api developer" python` + `"django developer" UK`
- "/scrape denmark" → Priority 1-4 queries filtered to Denmark + jobindex.dk searches
