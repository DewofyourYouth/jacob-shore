---
title: "Job Tracker AI"
description: "A local-first, cost-aware job search pipeline. Structured orchestration and selective LLM evaluation — cheap work done cheaply, expensive work done sparingly."
images:
  - /images/projects/job-tracker.jpg
---

![Job Tracker AI preview](/images/projects/job-tracker.jpg)

**A local-first CLI pipeline that turns a noisy job market into a ranked, LLM-scored shortlist — without burning API budget on roles you'd never take.**

[View on GitHub →](https://github.com/DewofyourYouth/job_tracker)

---

## The Problem

Job boards surface hundreds of listings with overlapping titles, inconsistent seniority signals, irrelevant stacks, and compensation that varies 3× by location and remote policy. Manual triage is slow. Sending every description straight to an LLM is expensive and doesn't solve the signal problem.

## How It Works

The pipeline does the cheap work cheaply and the expensive work sparingly:

1. **Ingest** — pull listings from ATS APIs (Greenhouse, Lever, Workable, Ashby) and Brave Search
2. **Hard filter** — eliminate on title keywords and avoid terms; zero API calls
3. **Rule score** — weighted scoring across role fit, seniority, location, stack, and compensation using YAML-defined criteria
4. **Semantic score** — optional local embedding similarity via `all-MiniLM-L6-v2`; no API call
5. **Quick LLM eval** — only the top-N survivors go to the model for a structured fit score, summary, strengths, and red flags; results cached by input hash
6. **Report generation** — detailed markdown reports for high-confidence listings; skips listings that already have a report
7. **Application materials** — `job apply` generates a tailored CV and cover letter, renders them to HTML templates, and exports PDFs via Playwright

Every stage writes structured output. The CSV is the persistent state store.

## What Makes It Different

**LLM calls are earned.** A listing that reaches the model has already passed a hard filter, a keyword scoring pass, and a configurable score threshold. The model sees a curated shortlist, not raw feed volume.

**Cost is a first-class concern.** Model selection, token budgets, concurrency, and how many listings reach each stage are all externalised to a YAML config. Cheaper models handle high-volume stages; better models handle report generation.

**Local-first data ownership.** The CV, profile, listings data, LLM responses, and generated reports live on disk. Nothing is sent to an external service except the LLM API call itself.

**Human-in-the-loop, not autopilot.** The pipeline produces ranked listings and fit reports. Apply/skip decisions remain with the operator.

**Determinism before probability.** Scoring uses explicit, auditable YAML rules — role archetypes, keyword lists, score ladders, weighted dimensions. You can read why a listing scored the way it did and adjust the knobs without guessing.

## Tech Stack

- **Python** with Click CLI, Jinja2 prompt templates, concurrent thread pools
- **OpenAI / Anthropic** — provider-agnostic `LLMClient` interface; switch per stage via config
- **Local semantic scoring** — `sentence-transformers` with `all-MiniLM-L6-v2`
- **PDF generation** — Playwright CDP to system Chrome (the only reliable way to suppress Chrome's date/title overlay in headless mode)
- **Storage** — URL-keyed CSV with upsert semantics; hash-keyed LLM response cache

## Quickstart

```bash
job generate-criteria   # derive scoring rules from your CV + profile
job pipeline            # scan → score → evaluate → report
job apply               # pick a listing and generate tailored application materials
```

[Full documentation and setup on GitHub →](https://github.com/DewofyourYouth/job_tracker)
