# 🚀 Quick Start Guide - Testing Any Website with Assure

A complete step-by-step guide to test any website using Assure Testing Language.

---

## Step 1: Install Assure

### Option A: Install Globally (Recommended)

```bash
npm install -g assure-testing
```

**Verify installation:**
```bash
assure --version
```

### Option B: Install Locally in Your Project

```bash
npm install --save-dev assure-testing
```

**Use it:**
```bash
npx assure test.assure
```

---

## Step 2: Create Your First Test File

Create a file with `.assure` extension. For example: `my-website.assure`

```assure
TEST "My Website Test"

OPEN "https://example.com"
WAIT 2
EXPECT TITLE CONTAINS "Example"
```

---

## Step 3: Run Your Test

```bash
assure my-website.assure
```

**Output:**
```
🚀 Assure Test Runner
📄 Running: my-website.assure

🌐 Launching browser...
✓ Browser launched

🧪 My Website Test
✓ Line 3: OPEN "https://example.com"
✓ Line 4: WAIT 2
✓ Line 5: EXPECT TITLE CONTAINS "Example"

✅ TEST COMPLETED SUCCESSFULLY
```

---

## Step 4: Write More Complex Tests

### Example: Testing a Login Page

Create `login-test.assure`:

```assure
TEST "Login Test"

# Navigate to login page
OPEN "https://your-website.com/login"
WAIT 2

# Fill in login form
TYPE "#username" "testuser"
TYPE "#password" "testpass123"
CLICK "#login-button"

# Wait for redirect
WAIT 3

# Verify successful login
EXPECT URL CONTAINS "/dashboard"
EXPECT TEXT "#welcome" CONTAINS "Welcome"
```

**Run it:**
```bash
assure login-test.assure
```

---

## Step 5: Finding Element Selectors

To test a website, you need to find CSS selectors for elements. Here's how:

### Method 1: Browser Developer Tools

1. **Open your website in Chrome**
2. **Right-click on the element** you want to test
3. **Select "Inspect"**
4. **In the Elements panel**, right-click the highlighted HTML
5. **Select "Copy" → "Copy selector"**

**Example:**
```html
<button id="submit-btn">Submit</button>
```
Selector: `#submit-btn`

### Method 2: Common Selectors

| Element Type | Selector Example |
|--------------|----------------|
| ID | `#login-button` |
| Class | `.submit-btn` |
| Tag | `button` |
| Attribute | `input[type='submit']` |
| Combined | `form#login-form button` |

---

## Step 6: Complete Test Examples

### Example 1: Search Functionality

```assure
TEST "Search Test"

# Open website
OPEN "https://example.com"
WAIT 2

# Type in search box
TYPE "#search-input" "Assure Testing"
CLICK "#search-button"

# Wait for results
WAIT 3

# Verify results
EXPECT URL CONTAINS "/search"
EXPECT TEXT ".results" CONTAINS "Assure"
```

### Example 2: Form Submission

```assure
TEST "Contact Form"

# Open contact page
OPEN "https://example.com/contact"
WAIT 2

# Fill form fields
TYPE "#name" "John Doe"
TYPE "#email" "john@example.com"
TYPE "#message" "This is a test message"

# Submit form
CLICK "#submit-button"

# Wait for confirmation
WAIT 3

# Verify success
EXPECT TEXT ".success-message" CONTAINS "Thank you"
EXPECT VISIBLE ".success-message"
```

### Example 3: Navigation Test

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

# Contact page
CLICK "a[href='/contact']"
WAIT 2
EXPECT URL CONTAINS "/contact"
```

### Example 4: E-commerce Checkout

```assure
TEST "Add to Cart"

# Open product page
OPEN "https://shop.example.com/product/123"
WAIT 2

# Add to cart
CLICK "#add-to-cart"
WAIT 1

# Go to cart
CLICK "#cart-icon"
WAIT 2

# Verify item in cart
EXPECT TEXT ".cart-item" CONTAINS "Product Name"
EXPECT VISIBLE ".checkout-button"
```

---

## Step 7: Organizing Multiple Tests

Create a `tests/` folder and organize your tests:

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

**Run specific test:**
```bash
assure tests/auth/login.assure
```

---

## Step 8: Common Commands Reference

### Navigation
```assure
OPEN "https://example.com"
```

### Interaction
```assure
CLICK "#button"
TYPE "#input" "text"
```

### Waiting
```assure
WAIT 2        # Wait 2 seconds
WAIT 5        # Wait 5 seconds
```

### Assertions
```assure
EXPECT TITLE CONTAINS "Page Title"
EXPECT URL CONTAINS "/path"
EXPECT TEXT "#element" CONTAINS "text"
EXPECT VISIBLE "#element"
```

---

## Step 9: Troubleshooting

### Problem: "Element not found"

**Solution:**
```assure
# Add wait time before interacting
WAIT 3
EXPECT VISIBLE "#button"
CLICK "#button"
```

### Problem: "Chrome not found"

**Solution:**
```bash
# Set Chrome path
export CHROME_PATH="/path/to/chrome"
assure test.assure
```

### Problem: "Test times out"

**Solution:**
- Increase wait times
- Check if selectors are correct
- Verify website is accessible

---

## Step 10: Best Practices

### ✅ Do's

1. **Use descriptive test names**
   ```assure
   TEST "User Login with Valid Credentials"
   ```

2. **Add comments**
   ```assure
   # Navigate to login page
   OPEN "https://example.com/login"
   ```

3. **Wait appropriately**
   ```assure
   WAIT 2  # Wait for page load
   ```

4. **Verify important elements**
   ```assure
   EXPECT VISIBLE "#important-element"
   ```

5. **Use specific selectors**
   ```assure
   CLICK "#login-button"  # ✅ Good
   CLICK "button"         # ❌ Too generic
   ```

### ❌ Don'ts

1. Don't use hardcoded wait times for everything
2. Don't use generic selectors
3. Don't skip verification steps
4. Don't test too many things in one test file

---

## Real-World Example: Testing a Complete User Flow

```assure
TEST "Complete User Registration Flow"

# Step 1: Open registration page
OPEN "https://app.example.com/register"
WAIT 2
EXPECT TITLE CONTAINS "Register"

# Step 2: Fill registration form
TYPE "#first-name" "John"
TYPE "#last-name" "Doe"
TYPE "#email" "john.doe@example.com"
TYPE "#password" "SecurePass123!"
TYPE "#confirm-password" "SecurePass123!"

# Step 3: Accept terms
CLICK "#terms-checkbox"

# Step 4: Submit
CLICK "#register-button"

# Step 5: Wait for redirect
WAIT 5

# Step 6: Verify successful registration
EXPECT URL CONTAINS "/dashboard"
EXPECT TEXT "#welcome-message" CONTAINS "Welcome"
EXPECT VISIBLE "#user-menu"
EXPECT TEXT "#user-email" CONTAINS "john.doe@example.com"
```

---

## Quick Reference Card

| Command | Example | Purpose |
|---------|---------|---------|
| `OPEN` | `OPEN "https://example.com"` | Navigate to URL |
| `CLICK` | `CLICK "#button"` | Click element |
| `TYPE` | `TYPE "#input" "text"` | Type text |
| `WAIT` | `WAIT 2` | Wait seconds |
| `EXPECT TITLE` | `EXPECT TITLE CONTAINS "Page"` | Check title |
| `EXPECT URL` | `EXPECT URL CONTAINS "/path"` | Check URL |
| `EXPECT TEXT` | `EXPECT TEXT "#el" CONTAINS "text"` | Check text |
| `EXPECT VISIBLE` | `EXPECT VISIBLE "#el"` | Check visibility |

---

## Next Steps

1. ✅ Install Assure
2. ✅ Create your first test
3. ✅ Run the test
4. ✅ Write more complex tests
5. ✅ Organize your test suite
6. ✅ Integrate into CI/CD (optional)

---

## Need Help?

- 📚 [Full Tutorial](TUTORIAL.md)
- 📖 [README](README.md)
- 🐙 [GitHub Issues](https://github.com/upendra-manike/assure/issues)
- 📦 [npm Package](https://www.npmjs.com/package/assure-testing)

---

**Happy Testing! 🚀**

