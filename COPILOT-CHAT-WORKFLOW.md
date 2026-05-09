# Companion workflow — using GitHub Copilot Chat in VS Code

The `generate.js` script in this repo calls **GitHub Models** programmatically — perfect when you want to generate many tests at once or wire test generation into a build pipeline.

But sometimes you just want to scaffold a single test interactively while you're already in VS Code. For that, **GitHub Copilot Chat** is faster.

This guide shows you the same prompt patterns, just used inside VS Code instead.

## What you need (free)

- A GitHub account
- VS Code
- The **GitHub Copilot** extension (free tier: 2,000 code completions + 50 chat messages per month — plenty for QA work)

## One-time setup

1. Open VS Code → Extensions panel → search **GitHub Copilot** → click **Install**
2. A "Sign in" prompt appears → click it → authenticate with your GitHub account
3. Open the **Chat** view: press `Ctrl + Cmd + I` (Mac) or click the chat icon in the sidebar

You're ready.

## The workflow

### Step 1 — Pick a user story

Use any of the `.txt` files in `examples/`, or write your own following the same shape (Title, URL, As a / I want / So that, Steps, Expected).

### Step 2 — Open Copilot Chat in VS Code

Press `Ctrl + Cmd + I`. A panel opens on the right.

### Step 3 — Paste this exact prompt as your first message

```
You are a senior QA Automation Engineer.

Convert the user story below into a Playwright test in JavaScript.

Rules:
- Use require('@playwright/test'), NOT import statements
- One test() block per scenario
- Test names must read like full sentences
- Prefer locators in this order: data-test attributes, then id, then class
- Use expect(...) with a meaningful assertion at the end
- Add a one-line comment above each step explaining WHAT it does
- Output ONLY the JavaScript code, no prose

User story:
[PASTE YOUR USER STORY HERE]
```

Replace `[PASTE YOUR USER STORY HERE]` with the contents of your `.txt` file. Press Enter.

### Step 4 — Save the generated test

Copilot Chat shows the generated code in a code block. At the top-right of that block, click **Insert into new file** (or copy-paste it into a new `.spec.js` file under `generated-tests/`).

### Step 5 — Run it

```bash
npx playwright test generated-tests/your-test.spec.js
```

## When to use which

| Need | Tool |
|---|---|
| Generate one test while coding | **Copilot Chat in VS Code** (this workflow) |
| Generate 10 tests in one go | **`generate.js` script** (the API approach) |
| Generate tests in CI/CD | **`generate.js` script** |
| Iterate on selectors as you write | **Copilot inline completions** (just start typing) |

## Pro tips

1. **Inline completions** — start typing `// fill the username field` in a `.spec.js` file. Copilot suggests the next line. Press `Tab` to accept. This is faster than Chat for simple steps.

2. **Edit a test by chatting** — open a generated `.spec.js` file, select a section, press `Cmd + I`, type "add an assertion that the cart count increased by 1". Copilot edits in place.

3. **Refine the prompt** — if the generated tests use bad selectors, add to your prompt: *"In this app, all interactive elements have data-test attributes. Always prefer those."* Quality jumps immediately.

## Resume value

In an interview you can now say:

> *"I built a workflow that combines GitHub Copilot Chat for ad-hoc test generation with a GitHub Models API script for batch generation. The Chat workflow is faster while writing a single test; the script is better for generating a whole regression suite from a backlog of user stories."*

That's the kind of nuance hiring managers love because it shows you've actually used the tools, not just heard about them.
