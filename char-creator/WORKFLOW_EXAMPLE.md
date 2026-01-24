# Claude Workflow Example

This document shows an example of the Claude development workflow in action.

## Scenario: Adding a New Feature

Let's say we need to add a new feature: "Export character to PDF"

### Step 1: Check Git Status & Create Branch

```bash
# Run pre-change hook
npm run pre-change

# Create feature branch
git checkout -b feature/export-pdf
```

**Output:**
```
🔍 Pre-change validation...
📍 Current branch: main
⚠️  You're on main branch. Consider creating a feature branch:
   git checkout -b feature/<description>
✅ Pre-change validation complete
```

### Step 2: Make Code Changes

Claude makes changes to implement PDF export:
- Add new component: `src/components/PDFExport.tsx`
- Add PDF generation logic
- Update Header component with export button

### Step 3: Run Validation

```bash
# Run post-change hook
npm run post-change
```

**Expected Output:**
```
🔧 Post-change validation starting...
==================================

📋 Step 1: Type Checking
---
✅ Type checking passed

📋 Step 2: Build Verification
---
✅ Build successful

📋 Step 3: Unit Tests
---
✅ All tests passed

📋 Step 4: Test Coverage
---
📊 Coverage: 82.5%
✅ Coverage above 80% threshold

==================================
✅ All validations complete!

📝 Next steps:
   1. Review changes: git status
   2. Stage changes: git add <files>
   3. Commit: git commit -m 'type: description'
   4. Push: git push -u origin <branch-name>
```

### Step 4: If Errors Occur

**Example: Type Error**

```bash
npm run post-change
```

**Output:**
```
📋 Step 1: Type Checking
---
❌ Type errors found:
src/components/PDFExport.tsx(42,5): error TS2322: Type 'string' is not assignable to type 'number'.

❌ Step Type Checking failed!
🔍 Please review the errors above and fix them.
```

**Claude's Response:**
"I found a type error in PDFExport.tsx line 42. The issue is that I'm assigning a string to a number property. Let me fix that..."

```typescript
// Before (incorrect)
const pageNumber: number = "1";

// After (correct)
const pageNumber: number = 1;
```

**Re-run validation:**
```bash
npm run post-change
```

### Step 5: Commit & Push

```bash
# Stage changes
git add src/components/PDFExport.tsx src/components/Header.tsx

# Commit
git commit -m "feat: add PDF export functionality

- Add PDFExport component with jsPDF integration
- Add export button to Header
- Generate formatted character sheet PDF
- Include all character data and stats

Closes #42"

# Push
git push -u origin feature/export-pdf
```

## Example: Fixing a Bug

### Scenario: BP calculation is incorrect

```bash
# Create fix branch
git checkout -b fix/bp-calculation

# Claude makes changes to calculations.ts

# Run validation
npm run post-change
```

**Output shows test failure:**
```
📋 Step 3: Unit Tests
---
❌ Tests failed:
 FAIL  src/utils/__tests__/calculations.bp.test.ts
  ● calculateTotalBPSpent › should calculate total BP correctly

    expect(received).toBe(expected)

    Expected: 150
    Received: 170

❌ Step Unit Tests failed!
```

**Claude's Response:**
"The test is failing because the expected value changed after my fix. Let me verify the calculation is now correct..."

```typescript
// Update test expectation
it('should calculate total BP correctly', () => {
  const result = calculateTotalBPSpent(/* ... */);
  expect(result).toBe(170); // Updated from 150
});
```

**Re-run and commit:**
```bash
npm run post-change  # All checks pass
git add .
git commit -m "fix: correct BP calculation for knowledge skills

- Fixed discount application logic
- Updated test expectations
- All tests passing

Fixes #38"
```

## Example: Adding Tests for Coverage

**Scenario: Coverage drops to 75%**

```bash
npm run post-change
```

**Output:**
```
📋 Step 4: Test Coverage
---
📊 Coverage: 75.3%
⚠️  Coverage below 80% threshold (75.3%)
📝 Consider adding more tests to improve coverage
```

**Claude's Response:**
"Coverage dropped below 80%. Let me add tests for the uncovered code..."

```typescript
// Add tests for new feature
describe('PDFExport', () => {
  it('should generate PDF with character data', () => {
    // Test implementation
  });

  it('should handle missing data gracefully', () => {
    // Test edge case
  });
});
```

**Re-run:**
```bash
npm run post-change
```

**Output:**
```
📊 Coverage: 81.2%
✅ Coverage above 80% threshold
```

## Quick Reference Commands

```bash
# Before making changes
npm run pre-change

# After making changes (full validation)
npm run post-change

# Or run checks individually
npm run type-check    # TypeScript only
npm run build         # Build only
npm run test          # Tests only
npm run test:coverage # Coverage only

# Run all checks at once
npm run validate

# Watch mode for development
npm run test:watch
```

## Common Patterns

### Pattern 1: Feature Development
```bash
git checkout -b feature/my-feature
# Make changes
npm run post-change
git commit -am "feat: description"
```

### Pattern 2: Bug Fix
```bash
git checkout -b fix/bug-description
# Make changes
npm run post-change
git commit -am "fix: description"
```

### Pattern 3: Refactoring
```bash
git checkout -b refactor/what-changed
# Make changes
npm run post-change  # Ensure no regressions
git commit -am "refactor: description"
```

## Integration with CI/CD

These same checks can run in CI:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run validate  # Runs all checks
```

## Tips

1. **Fix errors in order**: Type errors → Build errors → Test failures → Coverage
2. **Read error messages carefully**: They usually tell you exactly what's wrong
3. **Run checks frequently**: Don't wait until the end to validate
4. **Keep commits atomic**: One logical change per commit
5. **Write descriptive commit messages**: Help your future self understand why
