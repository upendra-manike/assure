# Installation Fix for Command Conflict

## Problem

If you see ImageMagick errors when running `assure`, it means there's a system command conflict.

## Solution

### Option 1: Use npx (Recommended)

Instead of installing globally, use `npx`:

```bash
# Install locally
npm install --save-dev assure-testing

# Run tests with npx
npx assure test.assure
```

### Option 2: Use Full Path

```bash
# Find where npm installed it
npm list -g assure-testing

# Use full path
/usr/local/bin/assure test.assure
```

### Option 3: Use npm scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "test": "npx assure"
  }
}
```

Then run:
```bash
npm test test.assure
```

### Option 4: Alias (if you want global)

```bash
# Add to ~/.zshrc or ~/.bashrc
alias assure-test="npx assure-testing"

# Then use
assure-test test.assure
```

## Verify Installation

```bash
# Check if installed
npm list -g assure-testing

# Test with npx
npx assure-testing test.assure
```

## Why This Happens

The system has an `assure` command (from ImageMagick or another tool) that takes precedence over the npm-installed command. Using `npx` ensures you get the correct package.

