# Job Evaluation Framework

## Scoring Dimensions

Evaluate each job posting against these five dimensions:

### 1. Technical Skills Match (0-100)
How well do the required/preferred skills align with the candidate's capabilities?

| Score | Meaning |
|-------|---------|
| 80-100 | Core requirements are primary skills |
| 60-79 | Most requirements match, 1-2 gaps that are learnable |
| 40-59 | Partial match, significant upskilling needed |
| 0-39 | Fundamental mismatch |

**Strong match areas:** Python, TypeScript, Flutter/Dart, C#/.NET, Microsoft Azure (AZ-900), Linux systems administration, Ansible, Terraform, Docker, Kubernetes, CI/CD (GitHub Actions), Next.js/React, REST APIs, Firebase, Supabase, OpenCV, Agile/Scrum
**Moderate match areas:** Django, NumPy/Pandas, SQL/PostgreSQL, Mixed-Integer Programming, Swift (minimal)
**Weak match areas:** Pure ML/deep learning research, data engineering at petabyte scale, enterprise Java systems, Rust, native iOS deep specialisation

### 2. Experience Match (0-100)
Does work history align with what they're looking for?

| Score | Meaning |
|-------|---------|
| 80-100 | Direct experience in the same domain and role type |
| 60-79 | Related experience, transferable skills clear |
| 40-59 | Adjacent experience, would need to make the case |
| 0-39 | Unrelated experience |

**Strong:** Cloud/DevOps automation (banking infrastructure at Intertech), mobile application development (Flutter, OpenCV), full-stack web engineering (EV tracker, Next.js/Supabase)
**Moderate:** Data analysis and pipelines, computer vision applications, open-source contribution to safety-critical software (IVAO/Aurora)
**Entry-level:** Enterprise-scale architecture decisions, team leadership, production ML systems at scale

### 3. Behavioral/Culture Fit (0-100)
Does the role and company culture match the behavioral profile?

| Score | Meaning |
|-------|---------|
| 80-100 | Culture strongly matches behavioral preferences |
| 60-79 | Mixed signals but mostly compatible |
| 40-59 | Some friction areas |
| 0-39 | Significant culture mismatch |

**Strong fit signals:** Cross-functional ownership, autonomous work, shipping-focused culture, full-stack or broad scope, clear deliverables
**Friction signals:** Pure specialist silos, heavy bureaucratic process, pure frontend with no systems component
**Red flags to research:** Department disorganization, work dominated by maintenance over development, poor chemistry with leadership, culture mismatches. Check reviews, media coverage, LinkedIn connections, and network contacts for insider perspective.

### 4. Location & Logistics (Pass/Fail + Notes)
- **UK roles:** PASS — holds UK Graduate Visa, eligible to work without sponsorship for 2 years from graduation (Sep 2026). For cover letters: "I hold a UK Graduate Visa and am available to start without sponsorship."
- **Netherlands roles:** PASS — holds Orientation Year Visa, eligible to work without sponsorship for 1 year. For cover letters: "I hold a Netherlands Orientation Year Visa and am available immediately without sponsorship."
- **Germany roles:** PASS — open to relocation; standard EU/Schengen work permit process applies as Turkish citizen. Verify requirements per employer.
- **Turkey roles:** PASS — citizen, no visa needed.
- **Denmark (English-language) roles:** PASS — open to relocation.
- **Remote with occasional office:** PASS
- **Frequent international travel:** FLAG (discuss if relevant to role)
- **Visa note:** Do NOT state visa status on CV. Include naturally in cover letters for UK and NL applications only (per templates above).

### 5. Career Alignment & Motivation (0-100)
Does this role advance career goals and contain tasks that energize?

| Score | Meaning |
|-------|---------|
| 80-100 | Strongly aligned with career direction, clear growth path |
| 60-79 | Good role but only partially aligned with long-term goals |
| 40-59 | Decent job but doesn't build toward career goals |
| 0-39 | Dead end or backwards step |

**Career goals:**
- Secure a graduate-level software engineering, cloud/DevOps, or mobile development role
- Build depth in whichever area the first role requires, while leveraging breadth across the stack
- Grow into technical ownership of a feature or system end-to-end

**Motivation filter:** Evaluate not just whether you *can* do the tasks, but whether the tasks will *energize* you. Consider:
- Tasks that energize: building new features/systems end-to-end, automation that removes repetitive work, shipping working software to real users, problem-solving across the stack
- Tasks that drain: unclear or constantly shifting requirements, pure maintenance with no new development, pure frontend with no backend/systems component
- Non-task factors: clear goals, autonomy on implementation, environment that rewards initiative

**Life situation alignment:** Consider personal constraints:
- **Security:** Graduating September 2026; seeking first full-time role, open to start immediately after graduation
- **Flexibility:** Open to relocation anywhere (UK, NL, DE, TR, DK); no constraints on hybrid/remote split; no salary floor stated
- **Professional development:** Strong interest in deepening expertise in whichever technical area the first role provides

### 6. Salary Benchmark (Optional)

If the salary lookup tool is configured (`salary_data.json` exists), look up the company:
```
python salary_lookup.py "<Company Name>" --json
```

If a city is known from the posting, add `--city "<City>"` to narrow results.

Present findings as:
```
### Salary Benchmark
| Metric | Value |
|--------|-------|
| [Category] index | XX.X (+/-X.X% vs baseline) |
| Overall index | XX.X (+/-X.X% vs baseline) |
```

Interpret results relative to the baseline defined in the data file's metadata. For index-based data, higher typically means above-market compensation.

If the salary tool is not configured, skip this section.

## Output Format

Present the evaluation as:

```
## Job Fit Evaluation: [Role] at [Company]

| Dimension | Score | Notes |
|-----------|-------|-------|
| Technical Skills | XX/100 | [brief note] |
| Experience Match | XX/100 | [brief note] |
| Behavioral Fit | XX/100 | [brief note] |
| Location | PASS/FAIL | [brief note] |
| Career Alignment | XX/100 | [brief note] |

**Overall Score: XX/100** (weighted average of scored dimensions)

### Verdict: [Strong Fit / Good Fit / Moderate Fit / Weak Fit / Poor Fit]

### Key Strengths for This Role
- [bullet points]

### Gaps to Address
- [bullet points]

### Recommendation
[1-2 sentences: apply/skip/apply with caveats]

### Company Research Checklist
- [ ] Checked company website (mission, values, recent news)
- [ ] Checked review sites (Glassdoor, Jobindex, etc.)
- [ ] Checked LinkedIn for team size, recent hires, connections
- [ ] Checked media for restructuring, growth, or workplace issues
- [ ] Identified network contacts who may know the team/manager
```

## Weighting
- Technical Skills: 30%
- Experience Match: 25%
- Behavioral Fit: 15%
- Career Alignment: 30%

(Location is pass/fail, not weighted)

## Thresholds
- **Strong Fit** (75+): Definitely apply, tailor everything
- **Good Fit** (60-74): Apply, address gaps in cover letter
- **Moderate Fit** (45-59): Consider carefully, discuss with user
- **Weak Fit** (30-44): Probably skip unless strategic reasons
- **Poor Fit** (<30): Skip

## Pre-Application: Call the Employer (Best Practice)

Before writing the application, consider whether the candidate should call the contact person listed in the posting. **Only call if there are substantive questions** - never call just to "be remembered."

### When to Suggest Calling
- The posting has unclear or ambiguous requirements
- It's unclear which competencies are essential vs. nice-to-have
- The role description is vague about day-to-day tasks
- There's a named contact person who invites questions

### Good Questions to Ask
- "What are the primary challenges in this role?"
- "How is time typically divided across the listed responsibilities?"
- "Which competencies are most critical for success in this position?"
- "What does success look like in the first 6-12 months?"

### Rules for the Call
- Prepare a 30-second "elevator pitch" about your background in case they ask
- The call's purpose is **gathering information**, not delivering a pitch
- Take notes - use what you learn to tailor the application
- Reference the conversation naturally in the cover letter ("After speaking with [name], I was especially drawn to...")
