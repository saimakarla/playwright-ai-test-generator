// =============================================================================
// AI-Assisted Test Generator (powered by GitHub Models / Copilot)
// -----------------------------------------------------------------------------
// What this does:
//   1. Reads a plain-English user story from a .txt file
//   2. Sends it to GitHub Models (the same LLMs that power GitHub Copilot)
//      with instructions to convert the story into a Playwright test
//   3. Saves the generated code into the generated-tests/ folder
//
// How to run:
//   node generate.js examples/login.txt
//
// Why GitHub Models?
//   - FREE for any GitHub account (no Copilot subscription required)
//   - Same models that power Copilot Chat (GPT-4o, GPT-4o-mini, etc.)
//   - Authenticated with your GitHub Personal Access Token
//   - OpenAI-compatible API, so we use the standard `openai` npm package
//
// Sister workflow:
//   See COPILOT-CHAT-WORKFLOW.md for how to do the same thing
//   interactively inside VS Code using Copilot Chat instead of this script.
// =============================================================================

require('dotenv').config();                         // loads GITHUB_TOKEN from .env
const fs = require('fs');                           // file system — read/write files
const path = require('path');                       // safe way to build folder paths
const OpenAI = require('openai');                   // OpenAI npm package — works with
                                                    // GitHub Models because the API
                                                    // is OpenAI-compatible


// -----------------------------------------------------------------------------
// THE PROMPT
// -----------------------------------------------------------------------------
// This system prompt tells the model how to behave. Tweak any line here and
// the quality of generated tests changes — this is "prompt engineering".
const SYSTEM_PROMPT = `You are a senior QA Automation Engineer.

You convert plain-English user stories into Playwright tests written in JavaScript.

Rules:
- Use require('@playwright/test'), NOT import statements
- One test() block per scenario
- Test names must read like full sentences
- Prefer locators in this order: data-test attributes, then id, then class
- Use expect(...) with a meaningful assertion at the end
- Add a one-line comment above each step explaining WHAT it does
- Output ONLY the JavaScript code, no markdown fences, no prose, no explanations

If the story includes a URL, use it. Otherwise use https://example.com.`;


// -----------------------------------------------------------------------------
// MAIN FUNCTION
// -----------------------------------------------------------------------------
async function main() {
  // STEP 1 — Read the user story file path from the command line
  const storyPath = process.argv[2];
  if (!storyPath) {
    console.error('Usage: node generate.js <path-to-story.txt>');
    console.error('Example: node generate.js examples/login.txt');
    process.exit(1);
  }

  // STEP 2 — Make sure we have a GitHub token
  if (!process.env.GITHUB_TOKEN) {
    console.error('Missing GITHUB_TOKEN in your .env file.');
    console.error('Get a free PAT at https://github.com/settings/tokens');
    console.error('  - Token type: Classic');
    console.error('  - Select scope: "models:read" (under "Models")');
    console.error('Then put it in .env like:  GITHUB_TOKEN=ghp_...');
    process.exit(1);
  }

  // STEP 3 — Read the user story from disk
  const story = fs.readFileSync(storyPath, 'utf8');
  console.log(`\nReading user story from: ${storyPath}`);
  console.log('---');
  console.log(story);
  console.log('---');

  // STEP 4 — Call GitHub Models
  // We point the OpenAI SDK at GitHub's endpoint and use our PAT as the API key.
  console.log('\nAsking GitHub Models (Copilot) to generate the test...');
  const client = new OpenAI({
    baseURL: 'https://models.github.ai/inference',  // GitHub Models endpoint
    apiKey: process.env.GITHUB_TOKEN,               // your GitHub PAT
  });

  const response = await client.chat.completions.create({
    model: 'openai/gpt-4o-mini',     // fast + cheap; swap for openai/gpt-4o for higher quality
    max_tokens: 1500,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: story },
    ],
  });

  // STEP 5 — Extract the generated code from the response
  let generatedCode = response.choices[0].message.content.trim();

  // Strip any accidental markdown fences (```javascript ... ```) just in case
  generatedCode = generatedCode
    .replace(/^```(?:javascript|js)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  // STEP 6 — Decide what to name the output file
  const baseName = path.basename(storyPath, path.extname(storyPath));
  const outputDir = path.join(__dirname, 'generated-tests');
  const outputPath = path.join(outputDir, `${baseName}.spec.js`);

  fs.mkdirSync(outputDir, { recursive: true });

  // STEP 7 — Write the generated code to disk
  fs.writeFileSync(outputPath, generatedCode);

  // STEP 8 — Tell the user what happened
  console.log(`\nDone. Generated test saved to:`);
  console.log(`   ${outputPath}\n`);
  console.log('Preview (first 30 lines):');
  console.log('---');
  console.log(generatedCode.split('\n').slice(0, 30).join('\n'));
  console.log('---');
  console.log('\nRun it with:');
  console.log(`   npx playwright test ${outputPath}\n`);
}

// Kick off main() and print any errors clearly
main().catch(err => {
  console.error('\nSomething went wrong:');
  console.error(err.message || err);
  process.exit(1);
});
