# Job Application Assistant for Selim Gul

## Role
This repo is a job application workspace. Claude acts as a career advisor and application assistant for Selim Gul, helping with:
1. **Job fit evaluation** - Assess job postings against your profile (skills, experience, behavioral traits)
2. **CV tailoring** - Adapt existing CV templates (LaTeX/moderncv) to target specific roles
3. **Cover letter writing** - Draft targeted cover letters using existing templates (LaTeX)
4. **Interview preparation** - Prepare answers, questions, and talking points for interviews
5. **Career strategy** - Advise on positioning and personal branding

## Candidate Profile

### Identity
- **Name:** Selim Gul
- **Location:** Liverpool, UK | Open to relocation: UK (countrywide), Netherlands, Germany, Turkey, Denmark (English-language)
- **Phone:** +44 7760637907
- **Email:** gul.selim@outlook.com
- **LinkedIn:** https://linkedin.com/in/selim-gul
- **GitHub:** https://github.com/Selimgul14
- **Languages:** Turkish (native), English (fluent — TOEFL iBT 112/120)
- **Status:** MSc student, graduating September 2026
- **Visa:** UK Graduate Visa (eligible to work without sponsorship, 2 years from Sep 2026 graduation); Netherlands Orientation Year Visa (1 year). **Do NOT state on CV** — include naturally in cover letters for UK and NL applications only.

### Education
- **M.Sc. Advanced Computer Science** (Sep 2025 – Sep 2026) — University of Liverpool, Liverpool, UK
  - Modules: Cloud Computing, Machine Learning, Advanced Algorithmic Solutions, Big Data Analytics
- **B.S. Computer Science & Engineering** (Sep 2020 – Sep 2024) — Sabanci University, Istanbul, Turkey
  - 50% Merit Scholarship (top 1% national entrance ranking)
  - Coursework: OS, Networks, Database Systems, Software Engineering
- **Exchange** (Jan–May 2024) — SUNY Oswego, New York, USA
- **Exchange** (Sep–Dec 2022) — Hanyang University, Seoul, South Korea

### Professional Experience
- **Volunteer Software Developer** (Sep 2023 – Present) — **IVAO**, Remote
  - Contributing to Aurora, open-source cross-platform ATC client in C# and Blazor
  - Real-time data processing and UI performance optimisation for safety-critical software
- **Systems Engineer (Part-Time)** (Dec 2023 – Jun 2024) — **Intertech**, Istanbul, Turkey
  - Architected LLM-based automation tools to generate Ansible playbooks — 40% reduction in manual scripting time
  - Engineered Python/PowerShell pipeline to synchronise VM inventory across Hyper-V and VMware
  - Managed Linux/Windows server environments for high-availability banking infrastructure
- **Software Engineer Intern** (Jul 2023 – Sep 2023) — **Intertech**, Istanbul, Turkey
  - Built mobile security tool using OpenCV and CNN classifier; 94% document verification precision
  - Integrated image processing into Flutter UI for low-latency real-time performance on mid-range devices
- **Learning Assistant, Mobile Computing** (Feb 2022 – Jun 2022) — **Sabanci University**, Istanbul, Turkey
  - Mentored 40+ students in Flutter/Dart (state management, widget lifecycle, async programming)
  - Weekly code reviews and debugging; average project scores improved by 10%

### Independent Projects
- **EV Trip Tracker** (Next.js 15, TypeScript, Supabase, Tailwind, Leaflet, Vercel — 2025/2026): Full-stack web app for logging EV charging across a ~5,000 km multi-country road trip. Physics-accurate efficiency model (battery SoC drop × usable capacity — avoids inflating numbers from free top-ups). Multi-currency cost tracking (stored in original denomination, never converted at write time). Map, CSV/Excel export. Deployed on Vercel. Built with Claude Code.
- **Election Analysis & Nowcasting Engine** (Python, MIP — 2023–24): Sabancı University senior capstone project (ENS491). Mixed-Integer Programming model predicting election outcomes from scraped precinct-level data.
- **CT-Angiography Vessel Segmentation** (Python, OpenCV, Azure — 2024): Medical imaging pipeline with CLAHE + adaptive thresholding; GPT-4 API interface for natural language radiology queries.
- **E-Commerce Ecosystem CS308** (Flutter, Firebase, Agile — 2022): Lead developer, 5-person team. Real-time inventory, secure payments, Firebase. Managed Agile sprints and Git workflow.

### Technical Skills
- **Primary:** Python, TypeScript, Flutter/Dart, C#/.NET, Microsoft Azure (AZ-900), Linux, Ansible
- **Secondary:** C++, SQL, Java, Docker, Kubernetes, Terraform, Next.js/React, Firebase, Supabase, OpenCV
- **Tools:** Git, GitHub Actions, VMware, Hyper-V, Vercel, Jira, Confluence, Agile/Scrum
- **ML & Data:** OpenCV, NumPy, Pandas, CrewAI, Jupyter, Mixed-Integer Programming

### Certifications
- Microsoft Certified: Azure Fundamentals (AZ-900)
- TOEFL iBT: 112/120 (Advanced English Proficiency)
- IBM Data Science: Tools for Data Science; Python for Data Science and AI; Foundations: Data, Data, Everywhere; Ask Questions to Make Data-Driven Decisions

### Awards
- **50% Merit Scholarship** — Sabanci University (2020), top 1% national university entrance ranking

### Behavioral Profile
- **Adaptable generalist** — actively shapes profile to fit the role; maintains distinct CV variants as evidence
- **End-to-end builder** — motivated by shipping complete, production-quality software from idea to deployment
- **High initiative** — LLM Ansible automation at Intertech was self-initiated; EV tracker and election engine built without prompting
- **Strengths:** Cross-stack problem-solving, autonomous work, shipping-focused environments, clear deliverables
- **Growth areas:** Deepening specialism (currently a breadth-first profile); prefers clear requirements over ambiguous scope
- **Thrives in:** Environments that reward shipping over process; roles with ownership of a feature or system end-to-end

### What Excites You
- Building new features/systems end-to-end
- Automation that removes repetitive manual work
- Shipping working software to real users
- Problem-solving that spans the stack (infrastructure through frontend)

### Target Roles
- **Cloud/DevOps:** Cloud Engineer, DevOps Engineer, Platform Engineer, Site Reliability Engineer
- **Software Engineering:** Software Engineer, Backend Engineer, Full-Stack Engineer, Systems Engineer
- **Mobile:** Flutter Developer, Mobile Developer, Mobile Engineer
- **Adjacent:** Automation Engineer, Solutions Engineer, Technical Consultant

### Deal-breakers
- Pure frontend roles with no systems/backend component
- Roles requiring visa sponsorship (Selim does NOT need sponsorship — Graduate Visa UK, Orientation Year NL)

## Repo Structure
- `cv/` - LaTeX CV variants (moderncv template, banking style)
- `cover_letters/` - LaTeX cover letters (custom cover.cls template)
- `.claude/skills/` - AI skill definitions for the application workflow
- `.agents/skills/` - Job search CLI tools

## Workflow for New Job Applications
1. User provides a job posting (URL or text)
2. **Always evaluate fit first**: skills match, experience match, behavioral/culture match. Present this assessment to the user before proceeding.
3. If good fit: create targeted CV (`cv/main_<company>.tex`) and cover letter (`cover_letters/cover_<company>_<role>.tex`)
4. **Verify both documents** (see Verification Checklist below)
5. Prepare interview talking points based on the role requirements and your strengths

**Important:** When mentioning agentic coding or AI tooling in CVs/cover letters, explicitly reference **Claude Code** by name.

## Verification Checklist
After creating or updating a CV or cover letter, re-read the generated file and verify **all** of the following before presenting to the user. Report the results as a pass/fail checklist.

### Factual accuracy
- [ ] All claims match actual profile (CLAUDE.md / candidate profile) - no fabricated skills, experience, or achievements
- [ ] Job titles, dates, company names, and locations are correct
- [ ] Contact details are correct
- [ ] All company-specific claims (partnerships, products, technology, expansions) have been independently verified via WebFetch/WebSearch - do not trust reviewer agent research without verification

### Targeting
- [ ] Profile statement / opening paragraph is tailored to the specific role (not generic)
- [ ] Skills and experience bullets are reframed to match the job requirements
- [ ] Key job requirements are addressed (with gaps acknowledged where relevant)
- [ ] Nice-to-have requirements are highlighted where there is a match

### Consistency
- [ ] CV follows the standard 2-page moderncv/banking format
- [ ] Cover letter uses cover.cls template and established structure
- [ ] Tone is consistent across CV and cover letter
- [ ] No contradictions between CV and cover letter content

### Quality
- [ ] No LaTeX syntax errors (balanced braces, correct commands)
- [ ] No spelling or grammar errors
- [ ] Agentic coding / AI tooling references mention **Claude Code** by name
- [ ] Cover letter is addressed to the correct person (or "Dear Hiring Manager" if unknown)
- [ ] Cover letter fits approximately one page

### Compiled PDF verification (MANDATORY - never skip)
Both documents MUST be compiled and visually inspected via the Read tool on the PDF output. "Looks fine in the .tex" is not acceptable - LaTeX page-break decisions are unpredictable. Iterate until these all pass:
- [ ] CV compiled with **lualatex** (pdflatex often fails on modern MiKTeX with fontawesome5 font-expansion errors). Cover letter compiled with **xelatex** (cover.cls requires fontspec).
- [ ] **CV is exactly 2 pages** - not 1, not 3
- [ ] **No orphaned `\cventry` titles** - a job/education title must never sit at the bottom of a page with its bullets spilling to the next page. Use `\needspace{5\baselineskip}` before each `\cventry` to prevent this, and `\enlargethispage{2-3\baselineskip}` to rescue a trailing section that just barely spills
- [ ] **Cover letter is exactly 1 page** - signature block must fit with the body, never overflow
- [ ] **Cover letter bullet font matches body font** - `\lettercontent{}` must not wrap `\begin{itemize}...\end{itemize}` (the command's trailing `\\` errors on `\end{itemize}`, and moving itemize outside loses the Raleway font). Standard pattern: close `\lettercontent{}`, then wrap the list in `{\raggedright\fontspec[Path = OpenFonts/fonts/raleway/]{Raleway-Medium}\fontsize{11pt}{13pt}\selectfont \begin{itemize}...\end{itemize}\par}`
