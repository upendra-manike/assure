# 🎓 Assure Testing Language - Complete Tutorial

Welcome to the Assure Testing Language tutorial! This guide will teach you everything you need to know to write and run browser automation tests using Assure.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Your First Test](#your-first-test)
4. [Basic Commands](#basic-commands)
5. [Writing Tests](#writing-tests)
6. [Advanced Examples](#advanced-examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Introduction

Assure is a custom testing language (DSL) that lets you write browser automation tests in a simple, human-readable format. Instead of writing complex JavaScript, you write commands like:

```
OPEN "https://example.com"
CLICK "#button"
TYPE "#input" "Hello World"
```

### Why Assure?

- ✅ **Simple Syntax** - Easy to read and write
- ✅ **No JavaScript Required** - Write tests without coding
- ✅ **Built from Scratch** - Custom CDP engine, no heavy dependencies
- ✅ **Fast** - Direct Chrome DevTools Protocol communication
- ✅ **Human-Readable** - Tests read like plain English

---

## Installation

### Step 1: Install Node.js

Make sure you have Node.js 18+ installed:

```bash
node --version
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### Step 2: Install Assure

**Option A: Install Globally (Recommended)**

```bash
npm install -g assure-testing
```

**Option B: Install Locally in Your Project**

```bash
npm install --save-dev assure-testing
```

### Step 3: Verify Installation

```bash
assure --version
# or if installed locally
npx assure --version
```

### Step 4: Install Chrome/Chromium

Assure requires Chrome or Chromium browser. Make sure it's installed on your system.

---

## Your First Test

Let's create your first test file!

### Step 1: Create a Test File

Create a file named `hello.assure`:

```assure
TEST "My First Test"

OPEN "https://www.google.com"
WAIT 2
EXPECT TITLE CONTAINS "Google"
```

### Step 2: Run the Test

```bash
assure hello.assure
```

**Output:**
```
🚀 Assure Test Runner
📄 Running: hello.assure

🌐 Launching browser...
✓ Browser launched

🧪 My First Test
✓ Line 3: OPEN "https://www.google.com"
✓ Line 4: WAIT 2
✓ Line 5: EXPECT TITLE CONTAINS "Google"

✅ TEST COMPLETED SUCCESSFULLY
```

🎉 **Congratulations!** You just ran your first Assure test!

---

## Basic Commands

### OPEN - Navigate to a URL

Opens a webpage in the browser.

**Syntax:**
```
OPEN "url"
```

**Examples:**
```assure
OPEN "https://www.google.com"
OPEN "https://github.com"
OPEN "http://localhost:3000"
```

### CLICK - Click an Element

Clicks on a page element using CSS selectors.

**Syntax:**
```
CLICK "selector"
```

**Selectors:**
- `#id` - Element with ID
- `.class` - Element with class
- `button` - Element by tag name
- `input[type='submit']` - Element by attribute

**Examples:**
```assure
CLICK "#login-button"
CLICK ".submit-btn"
CLICK "button[type='submit']"
CLICK "a[href='/dashboard']"
```

### TYPE - Type Text

Types text into an input field.

**Syntax:**
```
TYPE "selector" "text"
```

**Examples:**
```assure
TYPE "#username" "admin"
TYPE "#password" "secret123"
TYPE "input[name='email']" "user@example.com"
```

**Note:** Text with spaces should be in quotes:
```assure
TYPE "#search" "Assure Testing Language"
```

### WAIT - Wait for Time

Waits for a specified number of seconds.

**Syntax:**
```
WAIT seconds
```

**Examples:**
```assure
WAIT 2
WAIT 5
WAIT 0.5
```

**Use Cases:**
- Wait for page to load
- Wait for animations to complete
- Wait for API calls to finish

### EXPECT - Assertions

Verifies conditions on the page.

#### EXPECT TITLE

**Syntax:**
```
EXPECT TITLE CONTAINS "text"
EXPECT TITLE EQUALS "text"
```

**Examples:**
```assure
EXPECT TITLE CONTAINS "Google"
EXPECT TITLE EQUALS "Welcome - My App"
```

#### EXPECT URL

**Syntax:**
```
EXPECT URL CONTAINS "text"
EXPECT URL EQUALS "url"
```

**Examples:**
```assure
EXPECT URL CONTAINS "/dashboard"
EXPECT URL EQUALS "https://example.com/home"
```

#### EXPECT TEXT

**Syntax:**
```
EXPECT TEXT "selector" CONTAINS "text"
EXPECT TEXT "selector" EQUALS "text"
```

**Examples:**
```assure
EXPECT TEXT "#welcome" CONTAINS "Welcome"
EXPECT TEXT ".message" EQUALS "Success!"
EXPECT TEXT "h1" CONTAINS "Hello"
```

#### EXPECT VISIBLE

**Syntax:**
```
EXPECT VISIBLE "selector"
```

**Examples:**
```assure
EXPECT VISIBLE "#modal"
EXPECT VISIBLE ".notification"
```

---

## Writing Tests

### Test Structure

Every test file should follow this structure:

```assure
TEST "Test Name"

# Your commands here
OPEN "https://example.com"
CLICK "#button"
EXPECT TITLE CONTAINS "Success"
```

### Comments

Use `#` for comments:

```assure
# This is a comment
OPEN "https://example.com"

# Navigate to login page
CLICK "#login-link"
```

### Organizing Tests

**Single Test File:**
```assure
TEST "User Login Flow"

OPEN "https://app.example.com/login"
TYPE "#email" "user@example.com"
TYPE "#password" "password123"
CLICK "#login-button"
WAIT 2
EXPECT URL CONTAINS "/dashboard"
```

**Multiple Test Scenarios:**

Create separate `.assure` files:
- `login.assure`
- `checkout.assure`
- `search.assure`

---

## Advanced Examples

### Example 1: Login Test

```assure
TEST "User Login"

# Navigate to login page
OPEN "https://app.example.com/login"

# Fill in credentials
TYPE "#username" "admin"
TYPE "#password" "secret123"

# Click login button
CLICK "#login-button"

# Wait for redirect
WAIT 3

# Verify successful login
EXPECT URL CONTAINS "/dashboard"
EXPECT TEXT "#welcome-message" CONTAINS "Welcome"
EXPECT VISIBLE "#user-menu"
```

### Example 2: Search Test

```assure
TEST "Google Search"

# Open Google
OPEN "https://www.google.com"
WAIT 2

# Type search query
TYPE "input[name='q']" "Assure Testing Language"

# Click search button
CLICK "input[type='submit']"

# Wait for results
WAIT 3

# Verify results page
EXPECT TITLE CONTAINS "Assure"
EXPECT URL CONTAINS "/search"
EXPECT VISIBLE "#search-results"
```

### Example 3: Form Submission

```assure
TEST "Contact Form"

# Open contact page
OPEN "https://example.com/contact"
WAIT 2

# Fill form
TYPE "#name" "John Doe"
TYPE "#email" "john@example.com"
TYPE "#message" "Hello, this is a test message"

# Submit form
CLICK "#submit-button"

# Wait for confirmation
WAIT 3

# Verify success message
EXPECT TEXT ".success-message" CONTAINS "Thank you"
EXPECT VISIBLE ".success-message"
```

### Example 4: Navigation Test

```assure
TEST "Website Navigation"

# Homepage
OPEN "https://example.com"
WAIT 2
EXPECT TITLE CONTAINS "Home"

# About page
CLICK "a[href='/about']"
WAIT 2
EXPECT URL CONTAINS "/about"
EXPECT TITLE CONTAINS "About"

# Services page
CLICK "a[href='/services']"
WAIT 2
EXPECT URL CONTAINS "/services"
EXPECT TITLE CONTAINS "Services"
```

---

## Best Practices

### 1. Use Descriptive Test Names

```assure
# ✅ Good
TEST "User Login with Valid Credentials"

# ❌ Bad
TEST "Test 1"
```

### 2. Add Comments for Clarity

```assure
# Navigate to login page
OPEN "https://app.example.com/login"

# Enter username
TYPE "#username" "admin"
```

### 3. Use Appropriate Wait Times

```assure
# Wait for page load
WAIT 2

# Wait for API response
WAIT 5

# Wait for animation
WAIT 1
```

### 4. Verify Important Elements

```assure
# After login, verify key elements
EXPECT URL CONTAINS "/dashboard"
EXPECT VISIBLE "#user-menu"
EXPECT TEXT "#welcome" CONTAINS "Welcome"
```

### 5. Organize Test Files

```
tests/
├── auth/
│   ├── login.assure
│   └── logout.assure
├── checkout/
│   └── purchase.assure
└── search/
    └── search.assure
```

### 6. Use Specific Selectors

```assure
# ✅ Good - Specific selector
CLICK "#login-button"

# ❌ Bad - Too generic
CLICK "button"
```

### 7. Test One Thing Per File

Each `.assure` file should test one specific scenario.

### 8. Handle Dynamic Content

```assure
# Wait for dynamic content to load
WAIT 3
EXPECT VISIBLE "#dynamic-content"
```

---

## Troubleshooting

### Problem: "Chrome not found"

**Solution:**
Set the `CHROME_PATH` environment variable:

```bash
export CHROME_PATH="/path/to/chrome"
assure test.assure
```

### Problem: "Element not found"

**Possible Causes:**
1. Selector is incorrect
2. Element hasn't loaded yet
3. Element is in an iframe

**Solutions:**
```assure
# Add wait time
WAIT 3
CLICK "#button"

# Verify element exists first
EXPECT VISIBLE "#button"
CLICK "#button"
```

### Problem: "Test times out"

**Solution:**
- Increase wait times
- Check if page is loading correctly
- Verify network connectivity

### Problem: "Type command not working"

**Solution:**
- Ensure input field is visible
- Check selector is correct
- Add wait before typing:

```assure
WAIT 2
EXPECT VISIBLE "#input"
TYPE "#input" "text"
```

### Problem: "Click not working"

**Solution:**
- Verify element is clickable
- Check if element is covered by another element
- Try waiting before clicking:

```assure
WAIT 2
EXPECT VISIBLE "#button"
CLICK "#button"
```

---

## Common Patterns

### Pattern 1: Login Flow

```assure
TEST "Login Flow"

OPEN "https://app.example.com/login"
TYPE "#username" "user"
TYPE "#password" "pass"
CLICK "#login"
WAIT 3
EXPECT URL CONTAINS "/dashboard"
```

### Pattern 2: Form Fill and Submit

```assure
TEST "Form Submission"

OPEN "https://example.com/form"
TYPE "#field1" "value1"
TYPE "#field2" "value2"
CLICK "#submit"
WAIT 2
EXPECT TEXT ".success" CONTAINS "Success"
```

### Pattern 3: Multi-Step Workflow

```assure
TEST "Multi-Step Process"

# Step 1
OPEN "https://example.com/step1"
CLICK "#next"
WAIT 2

# Step 2
EXPECT URL CONTAINS "/step2"
TYPE "#input" "data"
CLICK "#next"
WAIT 2

# Step 3
EXPECT URL CONTAINS "/step3"
CLICK "#finish"
WAIT 3
EXPECT TEXT ".complete" CONTAINS "Complete"
```

---

## Next Steps

1. **Practice** - Write tests for your own websites
2. **Explore** - Try different selectors and commands
3. **Organize** - Create a test suite structure
4. **Automate** - Integrate tests into CI/CD pipelines

---

## Resources

- **GitHub Repository:** https://github.com/upendra-manike/assure
- **npm Package:** https://www.npmjs.com/package/assure-testing
- **Documentation:** See README.md for full command reference

---

## Quick Reference

| Command | Syntax | Example |
|---------|--------|---------|
| OPEN | `OPEN "url"` | `OPEN "https://google.com"` |
| CLICK | `CLICK "selector"` | `CLICK "#button"` |
| TYPE | `TYPE "selector" "text"` | `TYPE "#input" "Hello"` |
| WAIT | `WAIT seconds` | `WAIT 2` |
| EXPECT TITLE | `EXPECT TITLE CONTAINS "text"` | `EXPECT TITLE CONTAINS "Google"` |
| EXPECT URL | `EXPECT URL CONTAINS "text"` | `EXPECT URL CONTAINS "/home"` |
| EXPECT TEXT | `EXPECT TEXT "selector" CONTAINS "text"` | `EXPECT TEXT "#msg" CONTAINS "Hello"` |
| EXPECT VISIBLE | `EXPECT VISIBLE "selector"` | `EXPECT VISIBLE "#modal"` |

---

**Happy Testing! 🚀**

If you have questions or need help, check the GitHub repository or open an issue.

