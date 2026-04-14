# Claude Code Instructions - AWS Developer Associate DVA-C02

## Permissions

Claude can create and modify files and subdirectories in this repository to record study notes, transcripts, and progress.

## Git Commits

- Do NOT include `Co-Authored-By` in commit messages for this repo.

## Student Profile

- Developer in Uruguay, working for Vairix (offshore services for US clients)
- Uses common AWS services daily
- Preparing for the AWS Certified Developer Associate (DVA-C02) certification
- Course: [Ultimate AWS Certified Developer Associate 2026 DVA-C02](https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/) by Stephane Maarek

## Approach for Unfamiliar Services

When a service is unfamiliar or hard to retain without practical use:
1. **Why it exists** - The problem it solves
2. **Who uses it** - Typical use case
3. **What's on the exam** - What you need to know for the DVA-C02
4. **Simple rule** - An easy way to remember it

## Mandatory Workflow Per Lesson

### Step 1: Receive transcript
The user pastes the video transcript. NEVER use MCP/Playwright to obtain transcripts.

### Step 2: Create notes file
Create an MD file at: `/transcripts/{section}/{number}-{name}.md`
- Example: `/transcripts/3-IAM-CLI/3.1-IAM-Introduction.md`

### Step 3: Verify names
Verify lesson names against the Udemy course. NEVER invent names.

### Step 4: Teach in Wizard Mode
Break down the content step by step following the Wizard Mode format (see below).

### Step 5: Quiz
Run an interactive quiz after finishing the explanation.

### Step 6: Update progress
Update `progress/quiz-results.md` and `STUDY_PLAN.md`.

### Step 7: Next lesson
Indicate the next lesson and wait for the user.

### Step 8: Section summary (when a section is fully completed)
Create a `SECTION-{N}-SUMMARY.md` file inside the section's transcripts folder.
It should aggregate all lesson notes from that section into a single reference file:
- List all lessons (completed, skipped)
- Combine all key concepts, tables, and diagrams
- Include a consolidated Exam Tips section at the bottom

## Wizard Mode (Teaching Format)

1. Extract 3-6 key concepts from the lesson
2. Present ONE concept at a time with:
   - Clear explanation
   - ASCII diagram if useful
   - Practical example
3. **Wait for user confirmation** before moving to the next concept
4. NEVER dump all concepts at once

## Quiz Format

1. ONE question at a time (A/B/C/D multiple choice)
2. Wait for the user's answer before showing the next question
3. Immediate feedback with explanation
4. **RANDOMIZE** the position of correct answers. Do NOT fall into patterns (e.g., always B and C). Before building the quiz, decide positions: e.g. [D, A, C, B]
5. At the end: show score, XP earned, update `quiz-results.md` and `STUDY_PLAN.md`

### XP System
- +25 XP per correct answer
- 2-4 questions per lesson (depending on complexity)
- Questions must be derived EXCLUSIVELY from the transcript content, NEVER from memory

### Thresholds
- 75%+ = Passed
- 100% = PERFECT
- Below 75% = Marked as "REVIEW" in STUDY_PLAN.md

## Section Review HTML — Standards & Process

Each section gets a `SECTION-{N}-SUMMARY.html` review file. These are the standards learned from iterating on previous sections.

### Process
- **Build the HTML incrementally as lessons are completed**, not all at once at the end. After each lesson (or small group of lessons), add/update the relevant card so the user can verify it while the content is fresh.
- After the section is fully done, do a final pass to check for gaps.

### Content standards for each card
Every card must follow this pattern — no exceptions:

1. **Card-level intro paragraph** — before any table, diagram, or list, explain in plain language what this card is about and why it matters. Never open a card with a table or diagram cold.
2. **Subsection intro** — every `<h3>` subsection that contains a table or diagram must have a `<p>` explaining what it shows before showing it.
3. **Tables** — must have a subtitle (`<h3>`) and an intro sentence. Never float a table without context.
4. **Diagrams (SVG)** — must have an explanatory paragraph before them. If the diagram shows a multi-step flow, add numbered step labels on the arrows. If it combines two independent concepts, add a clarifying note.
5. **"What is this?"** rule — if a term, feature, or mechanism is introduced (e.g. stage variables, route keys, policy cache), explain what it IS before explaining how it works.

### Weak Points section
- Add a `<!-- WEAK POINTS -->` tricky questions card at the **bottom** of the HTML (after Exam Tips, last card).
- Populate it with tricky Udemy quiz questions as the user encounters them.
- Each entry: question summary + correct answer + explanation of why.
- **Internal question cards use a darker purple border:** `border:1px solid #4c1d95;border-radius:8px;padding:0.85rem;margin-bottom:0.75rem;background:#0f172a`
- **Always use this exact style for the tricky questions card:**
```html
<div class="card" style="border-color:#7c3aed; background:#13102a;">
  <div class="card-header">
    <span class="badge" style="background:#7c3aed;">🧩</span>
    <h2 style="color:#c4b5fd;">
      <span class="lang-en">Tricky Quiz Questions</span>
      <span class="lang-es">Preguntas Tricky del Quiz</span>
    </h2>
  </div>
  ...
</div>
```

## Current State

- **Current section:** Section 27
- **Total XP:** 12,675
- **Lessons completed:** 411
