# 🚀 Dynamic Elements Support in Assure

Assure now has **built-in support for dynamic elements** - perfect for testing modern web applications built with React, Vue, Angular, or any framework that loads content dynamically.

## ✨ Automatic Dynamic Element Handling

**All commands automatically wait for dynamic elements!**

### CLICK - Auto-waits for elements
```assure
# Automatically waits up to 10 seconds for element to be visible and clickable
CLICK "#dynamic-button"
```

### TYPE - Auto-waits for inputs
```assure
# Automatically waits for input to be ready
TYPE "#dynamic-input" "Hello World"
```

### EXPECT - Auto-waits for elements
```assure
# Automatically waits for element to appear
EXPECT VISIBLE "#dynamic-content"
EXPECT TEXT "#status" CONTAINS "Success"
```

## 🎯 Explicit Waiting Commands

For more control, use `WAIT FOR` commands:

### WAIT FOR ELEMENT
Wait for an element to be visible and clickable:

```assure
WAIT FOR ELEMENT "#react-component"
WAIT FOR ELEMENT ".vue-component"
WAIT FOR ELEMENT "[data-testid='dynamic-button']"
```

### WAIT FOR TEXT
Wait for specific text to appear in an element:

```assure
WAIT FOR TEXT "#status-message" "Loading complete"
WAIT FOR TEXT ".notification" "Success"
```

### WAIT FOR URL
Wait for URL to change (after navigation):

```assure
WAIT FOR URL "/dashboard"
WAIT FOR URL "example.com/profile"
```

### WAIT FOR NETWORK IDLE
Wait for all AJAX/fetch requests to complete:

```assure
WAIT FOR NETWORK IDLE
```

## 📝 Real-World Examples

### Example 1: React App

```assure
TEST "React App Test"

OPEN "https://app.example.com"
WAIT FOR NETWORK IDLE

# Wait for React component to render
WAIT FOR ELEMENT ".react-component"

# Click button (auto-waits if needed)
CLICK "#load-data-button"

# Wait for data to load
WAIT FOR TEXT ".data-status" "Data loaded"

# Verify content
EXPECT TEXT ".data-list" CONTAINS "Item 1"
```

### Example 2: Vue.js Dynamic Form

```assure
TEST "Vue.js Form"

OPEN "https://app.example.com/form"
WAIT FOR ELEMENT "#vue-form"

# Form fields load dynamically - auto-waits
TYPE "#email-input" "test@example.com"
TYPE "#password-input" "password123"

# Submit button appears dynamically
CLICK "#submit-button"

# Wait for success message
WAIT FOR TEXT ".success-message" "Form submitted"
```

### Example 3: AJAX Content Loading

```assure
TEST "AJAX Content"

OPEN "https://example.com"
CLICK "#load-content-button"

# Wait for AJAX to complete
WAIT FOR NETWORK IDLE

# Content is now loaded
WAIT FOR ELEMENT ".ajax-content"
EXPECT TEXT ".ajax-content" CONTAINS "Loaded successfully"
```

### Example 4: Single Page Application (SPA)

```assure
TEST "SPA Navigation"

OPEN "https://app.example.com"
WAIT FOR NETWORK IDLE

# Navigate to dashboard
CLICK "#dashboard-link"

# Wait for navigation
WAIT FOR URL "/dashboard"
WAIT FOR ELEMENT ".dashboard-content"

# Verify dashboard loaded
EXPECT TEXT ".welcome" CONTAINS "Welcome"
```

## 🔧 How It Works

### Smart Waiting Algorithm

1. **Element Detection** - Checks if element exists in DOM
2. **Visibility Check** - Verifies element is visible (not hidden)
3. **Viewport Check** - Ensures element is in viewport
4. **Clickability Check** - Verifies element is not disabled or covered
5. **Retry Logic** - Retries every 100ms for up to 10 seconds

### Timeout Behavior

- **Default timeout**: 10 seconds
- **Check interval**: 100ms
- **Automatic retry**: Yes
- **Error message**: Clear indication of what failed

## 💡 Best Practices

### ✅ Do's

1. **Let commands auto-wait** - CLICK, TYPE, EXPECT handle dynamic elements automatically
2. **Use WAIT FOR NETWORK IDLE** after actions that trigger AJAX
3. **Use WAIT FOR ELEMENT** for critical components that must load
4. **Use WAIT FOR TEXT** when waiting for specific content

```assure
# ✅ Good - Auto-waiting
CLICK "#dynamic-button"
TYPE "#dynamic-input" "text"

# ✅ Good - Explicit waiting for critical elements
WAIT FOR ELEMENT "#critical-component"
CLICK "#button"
```

### ❌ Don'ts

1. **Don't use fixed WAIT times** for dynamic content
2. **Don't assume elements load instantly**
3. **Don't skip network idle checks** after AJAX actions

```assure
# ❌ Bad - Fixed wait time
WAIT 5
CLICK "#button"  # Might fail if element loads slowly

# ✅ Good - Smart waiting
CLICK "#button"  # Auto-waits up to 10 seconds
```

## 🎨 Framework-Specific Tips

### React
```assure
# Wait for React component to mount
WAIT FOR ELEMENT "[data-react-component]"

# Wait for React state update
WAIT FOR TEXT ".react-status" "Updated"
```

### Vue.js
```assure
# Wait for Vue component
WAIT FOR ELEMENT ".vue-component"

# Wait for Vue data binding
WAIT FOR TEXT "#vue-data" "Loaded"
```

### Angular
```assure
# Wait for Angular component
WAIT FOR ELEMENT "app-component"

# Wait for Angular change detection
WAIT FOR NETWORK IDLE
```

## 🐛 Troubleshooting

### Problem: "Element not found within 10000ms"

**Solutions:**
1. Check if selector is correct
2. Increase timeout (if needed, modify code)
3. Verify element actually appears on page
4. Check if element is in an iframe

### Problem: "Element not visible or clickable"

**Solutions:**
1. Element might be covered by another element
2. Element might be outside viewport
3. Element might be disabled
4. Use `WAIT FOR ELEMENT` to ensure it's ready

### Problem: "Text not found in element"

**Solutions:**
1. Text might load asynchronously
2. Use `WAIT FOR TEXT` before checking
3. Check if text is in a different element
4. Verify text actually appears on page

## 📊 Performance

- **Auto-wait overhead**: Minimal (~100ms checks)
- **Default timeout**: 10 seconds (configurable)
- **Success rate**: High (handles most dynamic scenarios)
- **Retry logic**: Efficient (stops as soon as element is ready)

## 🚀 Summary

Assure now handles dynamic elements **automatically**:

- ✅ CLICK waits for elements to be clickable
- ✅ TYPE waits for inputs to be ready
- ✅ EXPECT waits for elements to appear
- ✅ OPEN waits for network to be idle
- ✅ WAIT FOR commands for explicit control

**No more flaky tests due to timing issues!** 🎉

