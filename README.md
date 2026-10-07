# NEUROLOG

**AI-powered runtime failure diagnosis for developers.**

NEUROLOG is a developer diagnostic tool that turns raw runtime errors and console logs into a structured, readable diagnosis: **what broke, where it failed, why it failed, and what to do next.**

> **NEUROLOG diagnoses evidence, not assumptions.**

[Live Demo](https://neurolog-kappa.vercel.app/) · [GitHub Repository](https://github.com/Algo-jtx/NEUROLOG)

---

## Overview

Debugging often starts with an ugly wall of terminal output: stack traces, error messages, file paths, warnings, and framework noise. The useful information is there, but finding the actual failure can take time.

NEUROLOG is built around the **post-failure moment**.

A developer provides the runtime output, and NEUROLOG analyzes the evidence and returns a focused diagnostic report containing the failure type, likely source, confidence, root cause, and a practical resolution path.

The product is intentionally different from a general-purpose coding assistant:

> **Coding assistants help produce software. NEUROLOG focuses on what happens when that software runs and fails.**

---

## Current Status

**Working MVP**

The current implementation uses a manual diagnostic workflow:

```text
Developer
   ↓
Runtime error / console log
   ↓
Paste into NEUROLOG
   ↓
POST /api/triage
   ↓
AI analysis
   ↓
Structured diagnosis
   ↓
Root cause + next actions
```

The current web application is deployed and the core diagnostic flow is implemented.

An event-triggered version of NEUROLOG — where failures automatically invoke the diagnostic engine — was explored as a future direction, but it is **not part of the current implementation**.

---

## Core Features

- **Runtime log analysis** — accepts raw runtime output and error logs.
- **AI-assisted diagnosis** — uses a code-focused language model through Hugging Face.
- **Failure isolation** — identifies the relevant file and line when supported by the supplied evidence.
- **Structured results** — separates the diagnosis into clear sections instead of returning a generic chat response.
- **Confidence reporting** — surfaces how confident the diagnosis is.
- **Root-cause explanation** — explains why the failure occurred.
- **Actionable playbook** — provides ordered next steps for resolving the issue.
- **Developer-first interface** — compact terminal-inspired UI designed for quick scanning.
- **Deployed full-stack architecture** — Next.js frontend on Vercel with a FastAPI backend on Render.

---

## Diagnostic Output

NEUROLOG is designed around the order in which a developer usually needs information during a failure.

### 1. WHAT BROKE

The error or failure that occurred.

### 2. WHERE IT FAILED

The relevant file and line, when available from the supplied evidence.

### 3. HOW TO FIX IT

A practical sequence of next actions.

### 4. WHY IT FAILED

The underlying cause of the failure.

### 5. EVIDENCE

The information from the runtime output that supports the diagnosis.

The backend currently returns structured diagnostic fields including:

```text
severity
error_type
error_message
confidence
isolated_file
isolated_line
code_snippet
root_cause
playbook_steps
```

---

## Architecture

NEUROLOG is split into a frontend application and a backend diagnostic service.

```text
┌──────────────────────────┐
│        DEVELOPER         │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Runtime Error / Log      │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Next.js Frontend         │
│ React + TypeScript       │
└────────────┬─────────────┘
             │
             │ POST /api/triage
             ▼
┌──────────────────────────┐
│ FastAPI Backend          │
│ Python 3.12              │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Hugging Face             │
│ InferenceClient          │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Qwen2.5-Coder-32B-       │
│ Instruct                 │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Structured Diagnosis     │
│                          │
│ • Severity               │
│ • Error Type             │
│ • Confidence             │
│ • File / Line            │
│ • Root Cause             │
│ • Playbook Steps         │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Diagnostic Results UI    │
└──────────────────────────┘
```

### Request Flow

1. The developer encounters a runtime failure.
2. The developer copies the runtime output.
3. The log is pasted into NEUROLOG.
4. The frontend submits the evidence to the FastAPI backend.
5. The backend sends the diagnostic context to the Hugging Face model.
6. The model response is converted into NEUROLOG's structured diagnostic format.
7. The frontend renders the diagnosis and recommended next steps.

---

## Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| **Next.js 16.3.3** | Frontend framework |
| **React 19** | Component-based UI |
| **TypeScript** | Type-safe frontend development |
| **Tailwind CSS 4** | Styling |
| **Vercel** | Frontend deployment |

### Backend

| Technology | Purpose |
| --- | --- |
| **Python 3.12** | Backend language |
| **FastAPI** | REST API |
| **Pydantic** | Request and response validation |
| **Uvicorn** | ASGI server |
| **Hugging Face InferenceClient** | Hosted model access |
| **Qwen/Qwen2.5-Coder-32B-Instruct** | Code-oriented diagnostic reasoning |
| **python-dotenv** | Environment configuration |
| **Render** | Backend deployment |

---

## Frontend

The frontend is built as a focused diagnostic console rather than a generic SaaS dashboard.

### Interface Direction

- Dark background
- Restrained phosphor-green CRT aesthetic
- Terminal-inspired typography
- `Courier New`
- Subtle scanline and glow treatment
- Minimal interface
- Fast visual hierarchy
- Purpose-built loading state rather than a generic spinner

The application introduces NEUROLOG as:

> **A diagnostic agent for runtime failures.**

> Trace the failure. Understand the cause. Fix what comes next.

The main input area accepts runtime output and exposes the primary action:

**DIAGNOSE FAILURE**

### Analysis State

While a diagnosis is running, the interface uses a CRT-inspired diagnostic signal with messaging such as:

```text
DIAGNOSTIC SIGNAL
ACTIVE

>_ RUNTIME SIGNAL
```

The intention is to make NEUROLOG feel like it is tracing a failure rather than behaving like a generic AI chat interface.

---

## Backend

The backend is a FastAPI service responsible for:

- receiving runtime evidence from the frontend;
- validating the incoming diagnostic request;
- sending the relevant context to the AI model;
- guiding the model toward evidence-based diagnosis;
- returning a structured response that the frontend can render consistently.

### Main API Endpoint

```http
POST /api/triage
```

### Request Shape

```json
{
  "raw_log": "...",
  "runtime_env": "Python 3.12"
}
```

### Response Shape

```json
{
  "severity": "...",
  "error_type": "...",
  "error_message": "...",
  "confidence": "...",
  "isolated_file": "...",
  "isolated_line": "...",
  "code_snippet": "...",
  "root_cause": "...",
  "playbook_steps": []
}
```

The response is intentionally structured so the frontend can present the diagnosis as a developer-facing report rather than an unstructured AI answer.

---

## AI Layer

NEUROLOG currently uses:

**`Qwen/Qwen2.5-Coder-32B-Instruct`**

through the **Hugging Face InferenceClient**.

The AI layer is used for diagnostic reasoning over runtime evidence. The product is designed to prioritize the supplied logs and error context rather than inventing missing information.

The core principle is:

> **Evidence first. Confidence second. Explanation third.**

A useful diagnosis should identify what the available evidence supports and avoid presenting unsupported assumptions as fact.

---

## Repository Structure

At the top level, the project is separated into independent frontend and backend applications:

```text
NEUROLOG/
├── frontend/       # Next.js + React + TypeScript interface
├── backend/        # FastAPI + Hugging Face diagnostic service
├── .vscode/        # Workspace/editor configuration
├── .gitignore
├── LICENSE
└── README.md
```

This separation keeps the user interface, API, and AI integration independently deployable.

---

## Running the Frontend Locally

### Requirements

- Node.js
- npm

### Setup

```bash
git clone https://github.com/Algo-jtx/NEUROLOG.git
cd NEUROLOG/frontend
npm install
npm run dev
```

Then open the local Next.js development URL shown in the terminal.

### Available Frontend Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## Running the Backend Locally

### Requirements

- Python 3.12
- `pip`
- A Hugging Face access token or model access configuration required by the existing backend

### Setup

```bash
cd NEUROLOG/backend
python -m venv .venv
```

Activate the virtual environment.

**Linux / macOS**

```bash
source .venv/bin/activate
```

**Windows PowerShell**

```powershell
.venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Configure the environment values required by the existing Hugging Face integration, then start the FastAPI application using the backend entry point in the repository.

> Secrets and access tokens should be stored in environment variables and should never be committed to Git.

---

## Deployment

### Frontend

Hosted on **Vercel**:

https://neurolog-kappa.vercel.app/

### Backend

Hosted on **Render**:

https://neurolog-backend.onrender.com/

The frontend communicates with the backend through the diagnostic API.

---

## Design Philosophy

NEUROLOG is intentionally narrow.

It is **not** intended to be:

- a generic chatbot;
- an all-purpose coding assistant;
- a project-management dashboard;
- a replacement for a developer's IDE;
- a system that claims to monitor every development environment.

Its focus is much simpler:

```text
SOFTWARE FAILS
      ↓
NEUROLOG RECEIVES THE EVIDENCE
      ↓
TRACES THE FAILURE
      ↓
EXPLAINS WHAT BROKE
      ↓
SHOWS WHAT TO DO NEXT
```

That constraint shapes both the interface and the AI behavior.

---

## What I Built and Learned

NEUROLOG combines several areas of full-stack development in one product:

- designing a developer-focused user experience;
- building a React/Next.js interface in TypeScript;
- creating and consuming a FastAPI REST API;
- integrating a hosted language model through Hugging Face;
- designing structured AI outputs instead of relying on free-form responses;
- working with prompt design for evidence-based technical analysis;
- separating frontend and backend deployments;
- deploying a full-stack application with Vercel and Render;
- designing around uncertainty and confidence in AI-generated technical guidance.

---

## Future Direction

The current version intentionally preserves the simple:

```text
paste failure → diagnose → result
```

workflow.

Possible future extensions include:

- automatic failure-triggered diagnosis;
- integrations with CI/CD or developer workflows;
- richer environment and context capture;
- documentation retrieval when runtime evidence is insufficient;
- model routing or fallback models;
- tighter integration inside the tools where developers already work.

These are roadmap ideas and are **not presented as features of the current MVP**.

---

## Live Project

**Frontend:** https://neurolog-kappa.vercel.app/

**Repository:** https://github.com/Algo-jtx/NEUROLOG

**Backend:** https://neurolog-backend.onrender.com/

---

## License

This project is licensed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

## Author

**Juanita Mumbi**

Solo full-stack project focused on AI-assisted developer tooling and runtime diagnostics.
