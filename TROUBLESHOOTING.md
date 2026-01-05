# Troubleshooting Guide

## Problem: `assure` command not working

### Symptoms
- Getting ImageMagick errors
- Command not found errors
- Syntax errors when running `assure`

### Solutions

#### Solution 1: Use npx (Recommended - Always Works)

```bash
# Install locally
npm install --save-dev assure-testing

# Run tests
npx assure-testing test.assure
```

#### Solution 2: Use node directly

```bash
# Install locally
npm install --save-dev assure-testing

# Find the installed path
npm list assure-testing

# Run directly with node
node node_modules/assure-testing/dist/runner.js test.assure
```

#### Solution 3: Fix Global Installation

```bash
# Step 1: Remove corrupted binary
sudo rm /usr/local/bin/assure

# Step 2: Uninstall
npm uninstall -g assure-testing

# Step 3: Reinstall
npm install -g assure-testing@latest

# Step 4: Verify
which assure
head -1 $(which assure)  # Should show: #!/usr/bin/env node
```

#### Solution 4: Use npm scripts

Add to `package.json`:
```json
{
  "scripts": {
    "test": "node node_modules/assure-testing/dist/runner.js"
  }
}
```

Then:
```bash
npm test test.assure
```

## Verify Installation

```bash
# Check if installed
npm list assure-testing

# Test with node directly
node node_modules/assure-testing/dist/runner.js test.assure

# Or with npx
npx assure-testing test.assure
```

## Common Issues

### Issue: "Command not found"
**Fix:** Use `npx assure-testing` instead of `assure`

### Issue: ImageMagick errors
**Fix:** There's a system command conflict. Use `npx assure-testing`

### Issue: "Syntax error"
**Fix:** The binary is corrupted. Reinstall or use `npx`

### Issue: "Cannot find module"
**Fix:** Run `npm install` in your project directory

## Best Practice

**Always use npx for reliability:**
```bash
npx assure-testing test.assure
```

This ensures you always get the correct version and avoids system conflicts.

