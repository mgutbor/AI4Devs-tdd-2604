# Prompt Record for Backend Test Generation

## 1. Initial prompt used to generate the backend Jest tests

You are a Senior Software Engineer specialized in TypeScript, Jest, Node.js, Prisma, and TDD.

Your task is to generate a Jest test suite for the candidate creation functionality in an ATS system.

The system must be tested in two areas:
1. Input validation of candidate data
2. Persistence of candidate data into the database

Requirements:
- Use Jest with TypeScript
- Mock Prisma and domain models (no real DB usage)
- Follow Arrange / Act / Assert pattern
- Cover:
  - valid candidate creation
  - invalid candidate validation
  - persistence of candidate and nested entities
  - Prisma unique constraint error handling (P2002)
  - unexpected database errors

Only generate tests based on the actual repository structure.

## 2. Refinement prompt used to enforce assignment constraints

Ensure that:
- Backend tests are placed in `backend/src/tests/tests-MGB.test.ts`
- No frontend tests are included in the final submission
- No production code is modified
- Tests are deterministic and isolated
- Only required behaviors are tested (validation + persistence)

## 3. Final cleanup prompt used to consolidate tests into a single file

You are working inside a TypeScript Node.js + React repository for a Master's assignment focused on TDD.

Your task is NOT to redesign the project.

You must ONLY fix the project so it strictly matches the assignment requirements.

CRITICAL REQUIREMENT (DO NOT CHANGE)

The assignment requires:
1. Backend tests MUST be located at:
   backend/src/tests/tests-MGB.test.ts

2. Only the following backend functionality must be tested:
   - Candidate creation (service layer)
   - Input validation
   - Database persistence via Prisma (mocked)
   - Error handling (validation errors, Prisma P2002, unexpected errors)

3. The frontend tests are OPTIONAL and must NOT be included in the final submission unless explicitly requested.

TASK

Step 1:
Check the repository and locate all existing test files related to candidate creation.

Step 2:
If the backend tests are not in the required file path:
- MOVE or MERGE them into:
  backend/src/tests/tests-MGB.test.ts

DO NOT duplicate tests.

Step 3:
Ensure the final backend test file:
- Uses Jest
- Uses TypeScript
- Mocks Prisma-related domain models correctly
- Does NOT interact with a real database
- Covers only the required backend behaviors

Step 4:
Remove or ignore frontend test files for the final submission:
- frontend/src/components/AddCandidateForm.test.tsx
(do NOT execute, modify, or include it in the final backend deliverable)

Step 5:
Verify that:
- All backend tests pass using Jest
- The test file can be executed with:
  cd backend && npx jest

Step 6:
Do NOT modify production code unless strictly required to fix test compatibility.

Step 7:
Do NOT add new features or new tests beyond what is required by the assignment.

OUTPUT EXPECTED

- A single backend test file at:
  backend/src/tests/tests-MGB.test.ts
- Clean, minimal, deterministic Jest tests
- Confirmation of what was moved or removed
- No frontend test modifications
