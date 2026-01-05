# Quick Fix for Command Conflict

## The Problem

When you run `assure`, you're getting ImageMagick errors because there's a system command conflict.

## Quick Solutions

### ✅ Solution 1: Use npx (Easiest)

```bash
# Install locally
npm install --save-dev assure-testing

# Run tests
npx assure-testing test.assure
```

### ✅ Solution 2: Reinstall Globally

```bash
# Remove old installation
sudo rm /usr/local/bin/assure
npm uninstall -g assure-testing

# Reinstall
npm install -g assure-testing

# Test
assure test.assure
```

### ✅ Solution 3: Use npm scripts

Create `package.json`:
```json
{
  "scripts": {
    "test": "npx assure-testing"
  }
}
```

Run:
```bash
npm test test.assure
```

### ✅ Solution 4: Create an alias

Add to `~/.zshrc`:
```bash
alias assure-test="npx assure-testing"
```

Then:
```bash
assure-test test.assure
```

## Verify It Works

```bash
# Test with npx (always works)
npx assure-testing --help

# Or create a test file
echo 'TEST "Test"
OPEN "https://example.com"
WAIT 2' > test.assure

npx assure-testing test.assure
```

## Why This Happens

- System has an `assure` command (ImageMagick or other tool)
- npm's global bin directory might have conflicts
- Using `npx` ensures you get the correct package

**Recommendation: Use `npx assure-testing` instead of global install**

