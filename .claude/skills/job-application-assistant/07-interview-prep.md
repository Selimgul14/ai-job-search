# Interview Preparation Guide

## STAR Format

Structure answers as: **Situation** (context), **Task** (your responsibility), **Action** (what you did), **Result** (outcome).

Keep answers to 1-2 minutes. Be specific. End with what you learned or would do differently.

## Ready-Made STAR Examples

### 1. LLM-Powered Ansible Automation at Intertech (Initiative & Technical Impact)
**S:** The operations team at Intertech maintained banking infrastructure across Hyper-V and VMware. Writing Ansible playbooks was time-consuming and repetitive — engineers were spending hours on manual scripting for each configuration change.
**T:** As part of my part-time systems engineering role, I identified this as an opportunity to improve team efficiency and took initiative to design a solution.
**A:** Designed and built an LLM-based tool that dynamically generated Ansible playbooks from structured input. Integrated it into the team's existing infrastructure workflow using Python.
**R:** Playbook changes became faster and consistent across environments. The tool was adopted by the operations team and continued in use after my tenure ended.
**Use for:** "Tell me about a time you improved a process", "Give an example of initiative", "How have you applied AI/ML in a practical context?", "Tell me about a technical achievement you're proud of"

---

### 2. Remote WiFi Performance & Diagnostic Platform (End-to-End System Design & Reliability Engineering)
**S:** No existing tool could reliably tell whether a slow connection was caused by the local WiFi link, the upstream ISP, or a third-party service being down — a genuinely ambiguous, recurring problem.
**T:** Build a platform that could collect real-world network performance data continuously and unattended, and correctly attribute degradation to its actual source.
**A:** Designed and deployed an end-to-end system: a Raspberry Pi/Linux probe running web, video, email, and download workloads against local, controlled-cloud, and real-world endpoints; a FastAPI backend; and an Azure-hosted time-series store (PostgreSQL/TimescaleDB, provisioned with Bicep, running in Docker on Azure App Service with Blob Storage for archival). Built resilient unattended operation with systemd, SQLite store-and-forward buffering for connectivity gaps, and retry/recovery logic, plus Grafana dashboards for health scoring and historical incident queries.
**R:** Collected ~800K measurements over continuous real-world deployment. The platform correctly attributed a real 40-minute upstream outage to the ISP while confirming the local WiFi link stayed healthy — validating the core design goal.
**Use for:** "Tell me about a system you designed end-to-end", "Cloud/infrastructure experience", "How do you approach reliability or observability?", "Tell me about a technical project involving ambiguous root-cause diagnosis"

---

### 3. Fake ID Detection System (Technical Problem-Solving & Delivery)
**S:** During my internship at Intertech, I was tasked with building a proof-of-concept mobile security tool. The goal was to detect fraudulent ID documents in real-time using a mobile camera.
**T:** Design and deliver a working prototype within the internship period that met a meaningful precision threshold.
**A:** Built a Flutter mobile application integrated with OpenCV for image processing and a CNN classifier for authenticity detection. Optimised the on-device inference pipeline to maintain low latency on mid-range devices.
**R:** Achieved 94% precision on the document verification task. The tool was delivered as a working prototype within the internship timeline.
**Use for:** "Tell me about a technical project you delivered end-to-end", "Mobile development experience", "Computer vision / ML application", "Delivering under a deadline"

---

### 4. EV Trip Tracker — Personal Project (Initiative, Full-Stack Engineering)
**S:** Planning a ~5,000 km Tesla road trip across 7 countries with 5 different currencies and no existing tool that tracked charging efficiency the way I needed.
**T:** Build a production-quality web app from scratch that I would actually use on the trip.
**A:** Built a full-stack Next.js 15 / TypeScript / Supabase application with a physics-accurate efficiency model. Key design decision: used battery state-of-charge drop rather than kWh-added to measure efficiency — this avoids inflating numbers when you receive a free top-up. Added multi-currency support (storing original denomination, never converting at write time), a Leaflet map, and CSV/Excel export. Deployed on Vercel.
**R:** All three phases shipped and deployed. The app was used on the actual trip. Currently maintained on GitHub.
**Use for:** "Tell me about a personal project", "What do you build outside of work?", "Full-stack engineering", "Design decisions you're proud of", "Tell me about a time you solved a problem for yourself"

---

### 5. E-Commerce Ecosystem — CS308 (Team Leadership & Agile Delivery)
**S:** A 5-person team project at Sabanci University requiring a full-stack mobile e-commerce application built from scratch in one semester.
**T:** As lead developer, I was responsible for architecture decisions, sprint management, and ensuring the team delivered a production-quality MVP on time.
**A:** Designed the application architecture (Flutter + Firebase), set up Git branching conventions, ran weekly Agile sprints using Jira, conducted code reviews, and coordinated between the frontend and backend contributors.
**R:** Delivered a working application with real-time inventory, secure payment flows, and user authentication. The project received a high grade and all features were submitted on time.
**Use for:** "Teamwork and leadership", "Agile/Scrum experience", "Managing a project", "Coordinating with others under a deadline"

---

### 6. Learning Assistant — Mobile Computing (Communication & Teaching)
**S:** 40+ undergraduate students in the CS310 Mobile Computing course at Sabanci University were learning Flutter development — many struggling with state management and asynchronous programming in Dart.
**T:** As learning assistant, help students understand complex Flutter concepts and improve their project quality within a single semester.
**A:** Ran weekly lab sessions focused on widget lifecycle, state management (Provider/Bloc), and async Dart. Conducted individual code reviews and debugging sessions. Adapted explanations based on each student's prior programming background.
**R:** Average project scores improved by 10% compared to the previous semester. Students consistently demonstrated cleaner architecture and better adherence to OOP principles in their submissions.
**Use for:** "Communication of technical concepts", "Working with non-technical stakeholders", "Mentoring or teaching experience", "Patience and adaptability"

---

## Common Tough Questions

### "Why did you leave [previous company]?"
> Intertech was an internship / part-time role during my degree — the natural end point was completing my BSc and transitioning to the MSc. The experience was valuable and I left on good terms.

### "You don't have [specific skill/experience]."
> Acknowledge the gap honestly, then bridge to adjacent experience. For example: "I haven't worked with [X] directly, but I've done similar work with [Y] — the core concepts transfer, and I typically pick up new tools quickly. I'd expect to be productive within [timeframe]."

### "Where do you see yourself in 5 years?"
> In a role where I've built genuine depth in [area most relevant to the job], while still working across the stack. I'm interested in growing into technical ownership — architecting systems and making design decisions, not just implementing them.

### "What's your biggest weakness?"
> I'm a generalist by nature, which means I can contribute across many areas but haven't yet built a single deep specialism. I'm actively building depth in [most relevant area to role] — and I've found that my breadth makes me a faster learner when I go deep, because I already understand the systems around the thing I'm specialising in.

### "Why this company specifically?"
> Customize per company. Must reference: specific projects, company values, market position, or team structure. Never give a generic answer.

## Questions You Should Ask Interviewers

### About the Role
- "What does a typical week look like in this role?"
- "What would success look like in the first 6 months?"
- "What's the biggest challenge the team is facing right now?"

### About the Team
- "How big is the team, and how do you divide work?"
- "What does the development/project lifecycle look like, from idea to production?"
- "How do you onboard new team members?"

### About Tech & Growth
- "What's your current tech stack for [relevant area]?"
- "Is there room to grow into more architectural or strategic decisions?"
- "How does the team stay current with new tools and methods?"

### About Culture (use these to prevent disappointment)
- "How would you describe the team culture?"
- "What does professional development look like here?"
- "Is there flexibility for remote/hybrid work?"
- "What's the balance between development/new projects and maintenance work?"
- "How would you describe the leadership style in this team?"
- "What do people who thrive here have in common?"

## Phone/Video Interview Tips
- Have STAR examples written out (use this file)
- Keep a glass of water nearby
- Smile when speaking (it changes your tone)
- Ask for clarification if a question is vague
- It's OK to take 5 seconds to think before answering
- End with: "Is there anything else you'd like to know about my background?"

## After the Application (Best Practice)

### Follow-Up Etiquette
- **Don't call to "stand out"** or to learn more about the role post-submission - this risks a negative impression
- If the employer specified a timeline, respect it and wait
- If no timeline was given and significant time has passed (2+ weeks), a brief call to ask about status is acceptable
- If you have genuinely new, relevant information to share, a short follow-up is fine

### Thank-You Notes
- When you receive any update (interview invitation, rejection, or status update), send a brief thank-you message
- Express appreciation for their time and the process
- Keep it short (2-3 sentences)

## Roleplay Guidelines
When the user asks for interview practice:
1. Ask which role/company to simulate
2. Start with easy warm-up questions ("Tell me about yourself")
3. Progress to role-specific technical questions
4. Include 1-2 behavioral questions using the competencies from the job posting
5. End with a tough question or curveball
6. After each answer, give brief feedback: what worked, what to sharpen
7. Suggest which STAR example would work best for each question
