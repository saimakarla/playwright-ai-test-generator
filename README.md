# Playwright AI Test Generator

Turn plain-English user stories into ready-to-run Playwright tests using **GitHub Models** (the LLMs that power **GitHub Copilot**) — plus a companion guide for using **Copilot Chat** directly in VS Code.

This project demonstrates two complementary AI-powered QA workflows:

| Approach | Best for | File |
|---|---|---|
| **API script** (`generate.js`) | Batch generation, CI/CD, generating many tests from a backlog | `generate.js` |
| **Copilot Chat in VS Code** | One-off generation while coding, interactive refinement | `COPILOT-CHAT-WORKFLOW.md` |

Both use the same prompt and produce equivalent tests. Pick whichever fits the task.

## Why this is on my GitHub

QA AI testing roles want to see that you can:
1. Call an LLM API from your own code (the script approach)
2. Use Copilot in your day-to-day workflow (the Chat approach)
3. Understand prompt engineering well enough to get consistent output
4. Know the trade-offs between batch and interactive generation

This repo demonstrates all four in one place.

## What it does

```
You write:                          The tool generates:
─────────────────────               ──────────────────────────────────
Title: Login flow                   const { test, expect } = require(
URL: ...                              '@playwright/test');

As a customer I want to             test('Customer can log in with valid
log in with email and                 credentials', async ({ page }) => {
password so that I can                // Open the login page
access my dashboard                   await page.goto('https://...');
                                      // Fill the email
Steps:                                await page.locator('#userEmail')
- Open login page                       .fill('test@example.com');
- Type email "..."                    ...
- Type password "..."                 // Verify dashboard is reached
- Click Login                         await expect(page).toHaveURL(
                                        /dashboard/);
Expected:                           });
- URL contains /dashboard
```

## Repo layout

```
.
├── generate.js                      # the API tool — heavily commented
├── COPILOT-CHAT-WORKFLOW.md         # how to do the same thing in Copilot Chat
├── package.json
├── .env.example                     # where your GitHub PAT goes (template)
├── examples/
│   ├── login.txt                    # sample user story → login flow
│   ├── search.txt                   # sample → product search + add to cart
│   └── negative-login.txt           # sample → error message cases
└── generated-tests/                 # output goes here (created automatically)
```

## Setup (free — no Copilot subscription required)

```bash
# 1. Install dependencies
npm install

# 2. Get a GitHub Personal Access Token (PAT)
#    Open: https://github.com/settings/tokens
#    Click "Generate new token (classic)"
#    Select scope: "models:read"
#    Generate, then COPY the token immediately

# 3. Save the token in a local .env file
cp .env.example .env
# then open .env and paste your token

# 4. Generate your first test
node generate.js examples/login.txt
```

You should see something like:

```
Reading user story from: examples/login.txt
---
Title: Login flow on Rahul Shetty Academy
...
---

Asking GitHub Models (Copilot) to generate the test...

Done. Generated test saved to:
   /Users/.../generated-tests/login.spec.js

Preview (first 30 lines):
---
const { test, expect } = require('@playwright/test');

test('Registered customer can log in with valid credentials', async ({ page }) => {
  // Open the login page
  await page.goto('https://rahulshettyacademy.com/client');
  ...
```

## Generate tests for the other examples

```bash
node generate.js examples/search.txt
node generate.js examples/negative-login.txt
```

Each one writes to `generated-tests/<name>.spec.js`.

## Run the generated tests with Playwright

```bash
# Install Playwright browsers (only needed once)
npx playwright install chromium

# Run a specific generated test
npx playwright test generated-tests/login.spec.js
```

## Want to use Copilot Chat instead?

See **[COPILOT-CHAT-WORKFLOW.md](./COPILOT-CHAT-WORKFLOW.md)** — same prompts, but used interactively inside VS Code. No API key, no script, just chat and copy-paste.

## Write your own user stories

Drop a new `.txt` file into `examples/` following the same shape:

```
Title: <short title>
URL: <starting URL>

As a <role>
I want to <action>
So that <reason>

Steps:
- step 1
- step 2

Expected:
- assertion 1
- assertion 2
```

Then run `node generate.js examples/<your-file>.txt`.

## Honest limitations

- **The model doesn't know your real selectors.** It guesses based on common patterns. For unknown apps the generated test will need a few selector edits — still 90% less work than from scratch.
- **The output is a starting point, not final code.** Always review before merging.
- **Free tier rate limits apply.** GitHub Models free tier is generous for personal projects — usually 50–150 requests per day depending on the model.

## Tech stack

- **Node.js** + JavaScript (no TypeScript, kept simple)
- **GitHub Models API** for the LLM call (free with any GitHub account)
- **`openai` npm package** as the SDK (GitHub Models is OpenAI-compatible)
- **Playwright** for the test framework being generated
- **dotenv** for credential management

## Roadmap

- [ ] Support multiple tests per story (one per scenario)
- [ ] Auto-detect existing page objects in the repo and reuse them
- [ ] CLI flag to specify the output filename
- [ ] VS Code task that runs generation on save
