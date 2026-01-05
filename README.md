# 🧪 Assure - Custom Testing Language

**Assure** is a custom testing language (DSL) built from scratch with a unique browser automation engine using Chrome DevTools Protocol (CDP).

## ✨ Features

- 🎯 **Custom Syntax** - Human-readable test commands
- 🔧 **Built from Scratch** - No Playwright, no Selenium - pure CDP implementation
- ⚡ **Lightweight** - Minimal dependencies
- 🚀 **Fast** - Direct Chrome DevTools Protocol communication
- 📝 **Simple** - Easy to learn and write tests

## 🏗️ Architecture

```
assure/
│
├── language/
│   ├── parser.ts        # Parses Assure syntax
│   ├── tokenizer.ts     # Tokenizes lines
│
├── engine/
│   ├── browser.ts       # Custom CDP browser engine
│   ├── executor.ts      # Command executor
│
├── commands/
│   ├── open.ts          # OPEN command
│   ├── click.ts         # CLICK command
│   ├── type.ts          # TYPE command
│   ├── expect.ts        # EXPECT command
│
├── runner.ts            # Main test runner
└── *.assure             # Test files
```

## 📦 Installation

### Install from npm (Recommended)

```bash
# Install globally
npm install -g assure-testing

# Or install locally in your project
npm install --save-dev assure-testing
```

### Install from source

```bash
git clone https://github.com/yourusername/assure.git
cd assure
npm install
npm run build
```

**Requirements:**
- Node.js 18+
- Chrome or Chromium browser installed

**File Extension:**
- All test files must use the `.assure` extension (e.g., `test.assure`, `login.assure`)

## 🚀 Quick Start

1. **Create a test file with `.assure` extension** (`example.assure`):

```
TEST "My First Test"

OPEN "https://example.com"
WAIT 2
EXPECT TITLE CONTAINS "Example"
```

2. **Install dependencies**:

```bash
npm install
```

3. **Run the test**:

```bash
# If installed globally
assure example.assure

# If installed locally
npx assure example.assure

# Or using npm script
npm test example.assure
```

## 📚 Language Syntax

### Basic Commands

#### OPEN
Navigate to a URL:
```
OPEN "https://example.com"
```

#### CLICK
Click an element:
```
CLICK "#button"
CLICK ".submit-btn"
CLICK "button[type='submit']"
```

#### TYPE
Type text into an input:
```
TYPE "#username" "admin"
TYPE "#password" "secret123"
```

#### WAIT
Wait for specified seconds:
```
WAIT 2
WAIT 5
```

#### EXPECT
Assert conditions:

**Title:**
```
EXPECT TITLE CONTAINS "Dashboard"
EXPECT TITLE EQUALS "My App"
```

**URL:**
```
EXPECT URL CONTAINS "/dashboard"
EXPECT URL EQUALS "https://example.com/home"
```

**Text:**
```
EXPECT TEXT "#welcome" CONTAINS "Welcome"
EXPECT TEXT ".message" EQUALS "Success"
```

**Visibility:**
```
EXPECT VISIBLE "#modal"
```

### Comments

Lines starting with `#` are comments:
```
# This is a comment
OPEN "https://example.com"
```

### Test Labels

```
TEST "User Login Flow"
```

## 🔧 Custom Browser Engine

Assure uses a **custom-built browser engine** that communicates directly with Chrome via Chrome DevTools Protocol (CDP). This gives you:

- **Full Control** - Direct access to browser internals
- **No Heavy Dependencies** - Just `chrome-remote-interface` for CDP
- **Unique Implementation** - Built specifically for Assure

### How It Works

1. Launches Chrome with remote debugging enabled
2. Connects via WebSocket to Chrome DevTools Protocol
3. Executes commands using CDP methods
4. Handles element selection, clicking, typing, etc.

## 📝 Example Test File

Save your tests with the `.assure` extension (e.g., `login.assure`, `checkout.assure`):

```assure
TEST "User Login"

OPEN "https://example.com/login"

TYPE "#username" "admin"
TYPE "#password" "password123"
CLICK "#login-button"

WAIT 2

EXPECT URL CONTAINS "/dashboard"
EXPECT TEXT "#welcome" CONTAINS "Welcome"
EXPECT VISIBLE "#user-menu"
```

## 🛠️ Configuration

### Chrome Path

If Chrome is not in the default location, set the `CHROME_PATH` environment variable:

```bash
export CHROME_PATH="/path/to/chrome"
node runner.js test.assure
```

### Headless Mode

Currently runs in headless mode by default. To run with visible browser, modify `runner.ts`:

```typescript
session = await createBrowser(false); // visible browser
```

## 🎯 Supported Commands

| Command | Description | Example |
|---------|-------------|---------|
| `OPEN` | Navigate to URL | `OPEN "https://example.com"` |
| `CLICK` | Click element | `CLICK "#button"` |
| `TYPE` | Type text | `TYPE "#input" "text"` |
| `WAIT` | Wait seconds | `WAIT 2` |
| `EXPECT TITLE` | Assert title | `EXPECT TITLE CONTAINS "Page"` |
| `EXPECT URL` | Assert URL | `EXPECT URL CONTAINS "/home"` |
| `EXPECT TEXT` | Assert text | `EXPECT TEXT "#el" CONTAINS "text"` |
| `EXPECT VISIBLE` | Assert visibility | `EXPECT VISIBLE "#modal"` |
| `TEST` | Test label | `TEST "My Test"` |

## 🚧 Future Enhancements

- [ ] Variables and functions
- [ ] IF/ELSE conditionals
- [ ] RETRY mechanisms
- [ ] Parallel test execution
- [ ] HTML/JSON reports
- [ ] Screenshot support
- [ ] VS Code syntax highlighting
- [ ] CI/CD integration

## 📄 License

MIT

## 🤝 Contributing

This is a custom testing language built from scratch. Feel free to extend it!

---

**Built with ❤️ using Chrome DevTools Protocol**

