# Claude Development Workflow

This file contains instructions for Claude (AI assistant) to follow when making changes to this codebase.

## Pre-Change Workflow

Before making any code changes, Claude should:

1. **Check Git Status**
   ```bash
   git status
   ```
   - If not a git repository, initialize it: `git init && git add . && git commit -m "Initial commit"`

2. **Create Feature Branch**
   - Generate a descriptive branch name based on the task
   - Pattern: `feature/<brief-description>` or `fix/<brief-description>`
   - Example: `feature/add-light-mode` or `fix/abilities-crash`
   ```bash
   git checkout -b feature/<description>
   ```

## Post-Change Workflow

After making code changes, Claude MUST run through this checklist:

### 1. Type Checking
```bash
npm run type-check || npx tsc --noEmit
```
- **Action**: Fix all TypeScript errors before proceeding
- **Common issues**:
  - Missing type assertions
  - Unused variables/imports (use `_` prefix or remove)
  - Property access on potentially undefined values
  - Incorrect type assignments

### 2. Build Verification
```bash
npm run build
```
- **Action**: Fix all build errors before proceeding
- **Common issues**:
  - Import errors
  - Module resolution failures
  - Missing dependencies

### 3. Unit Tests
```bash
npm test
```
- **Action**: Fix all failing tests before proceeding
- **If tests fail**:
  - Read the error messages carefully
  - Update test fixtures if data structures changed
  - Update test expectations if behavior intentionally changed
  - Add new tests for new functionality

### 4. Test Coverage
```bash
npm run test:coverage
```
- **Requirement**: Maintain at least 80% code coverage
- **Action**: If coverage drops below 80%:
  - Write additional tests for uncovered code paths
  - Focus on critical business logic first
  - Ensure new features have corresponding tests

### 5. Lint Check (Optional but Recommended)
```bash
npm run lint
```
- **Action**: Fix linting errors for code quality

## Quick Verification Script

Run all checks at once:
```bash
npm run type-check && npm run build && npm test && npm run test:coverage
```

## Commit Guidelines

After all checks pass:

1. **Stage Changes**
   ```bash
   git add <files>
   ```

2. **Commit with Descriptive Message**
   ```bash
   git commit -m "type: brief description

   - Detailed change 1
   - Detailed change 2

   Fixes #<issue-number> (if applicable)"
   ```

   Commit types: `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`

3. **Push Branch**
   ```bash
   git push -u origin <branch-name>
   ```

## Error Resolution Priority

1. **TypeScript errors** - Must fix first (prevents build)
2. **Build errors** - Must fix second (prevents runtime)
3. **Test failures** - Must fix third (prevents merge)
4. **Coverage gaps** - Address last (quality gate)

## When to Skip Workflow

Only skip this workflow for:
- Documentation-only changes (*.md files)
- Configuration tweaks that don't affect code
- Emergency hotfixes (but still run checks before commit)

## Test Coverage Guidelines

### What Needs Tests
- ✅ Business logic functions (calculations, validations)
- ✅ Data transformations (parsers, formatters)
- ✅ Critical user workflows
- ✅ Edge cases and error handling

### What Can Skip Tests
- ❌ Simple UI components with no logic
- ❌ Type definitions
- ❌ Configuration files

## Common Test Patterns

### Testing Calculations
```typescript
describe('calculateAttributeCost', () => {
  it('should return 0 for value 1', () => {
    expect(calculateAttributeCost(1)).toBe(0);
  });

  it('should calculate cost for value 5', () => {
    expect(calculateAttributeCost(5)).toBe(75);
  });
});
```

### Testing Components
```typescript
describe('Header', () => {
  it('should render character name', () => {
    render(<Header />);
    expect(screen.getByPlaceholderText('Character Name')).toBeInTheDocument();
  });
});
```

### Testing Hooks
```typescript
describe('useCalculations', () => {
  it('should calculate BP spent correctly', () => {
    const { result } = renderHook(() => useCalculations());
    expect(result.current.bpSpent).toBe(0);
  });
});
```

## Debugging Failed Tests

1. **Read the error message** - It usually tells you exactly what's wrong
2. **Check test fixtures** - Ensure mock data matches expected types
3. **Verify imports** - Make sure all dependencies are mocked properly
4. **Run single test** - `npm test -- <test-file>` to isolate issues
5. **Use console.log** - Add logs to understand what's happening

## Package Scripts Reference

```json
{
  "dev": "vite",                          // Start dev server
  "build": "tsc && vite build",          // Type check + build
  "type-check": "tsc --noEmit",          // Type check only
  "test": "vitest run",                  // Run tests once
  "test:watch": "vitest",                // Run tests in watch mode
  "test:coverage": "vitest run --coverage", // Generate coverage report
  "lint": "eslint . --ext ts,tsx"        // Lint code
}
```

## Notes for Claude

- **Always** run the full workflow after making changes
- **Never** skip type checking - it catches bugs early
- **Always** explain what you're fixing if errors occur
- **Document** any new patterns or decisions
- **Ask** the user if test expectations are unclear
