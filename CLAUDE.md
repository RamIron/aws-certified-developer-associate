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

## Current State

- **Current section:** Section 5 - EC2 Fundamentals
- **Current lesson:** 6.8 - EBS Volume Types (completed)
- **Next lesson:** 6.9 - EBS Multi-Attach
- **Total XP:** 1250
- **Lessons completed:** 29
