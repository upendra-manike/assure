# BeRides Test Suite

This directory contains test files for testing https://stage.berides.com/

## Test Files

1. **homepage.assure** - Tests the homepage loading and basic elements
2. **navigation.assure** - Tests website navigation and menu items
3. **search.assure** - Tests search functionality (if available)
4. **forms.assure** - Tests contact forms, newsletter signup, etc.
5. **booking.assure** - Tests ride booking flow
6. **user-account.assure** - Tests login, logout, and user account features
7. **mobile-responsive.assure** - Tests mobile menu and responsive design

## How to Run Tests

### Run a single test:
```bash
assure berides-tests/homepage.assure
```

### Run all tests:
```bash
# Run each test individually
assure berides-tests/homepage.assure
assure berides-tests/navigation.assure
assure berides-tests/search.assure
assure berides-tests/forms.assure
assure berides-tests/booking.assure
assure berides-tests/user-account.assure
assure berides-tests/mobile-responsive.assure
```

## Customizing Tests

### Step 1: Find Selectors

1. Open https://stage.berides.com/ in Chrome
2. Right-click on any element you want to test
3. Select "Inspect"
4. Right-click the HTML element → "Copy" → "Copy selector"

### Step 2: Update Test Files

Replace the commented selectors with actual selectors from the website:

```assure
# Before (commented):
# CLICK "#login-button"

# After (with actual selector):
CLICK "#actual-login-button-id"
```

### Step 3: Uncomment Test Steps

Remove the `#` from test steps once you have the correct selectors:

```assure
# Uncomment this:
CLICK "a[href*='about']"
WAIT 2
EXPECT URL CONTAINS "about"
```

## Common Selectors to Look For

- **Login button**: `#login`, `.login-btn`, `button[type='submit']`
- **Search box**: `#search`, `input[type='search']`, `.search-input`
- **Navigation links**: `a[href*='about']`, `nav a`, `.menu-item`
- **Forms**: `#email`, `#password`, `input[name='email']`
- **Buttons**: `#submit`, `button.submit`, `.btn-primary`

## Tips

1. **Start with homepage.assure** - It's the simplest test
2. **Use browser DevTools** - Inspect elements to find selectors
3. **Adjust wait times** - Some pages may need more time to load
4. **Test one feature at a time** - Don't try to test everything at once
5. **Verify selectors work** - Run simple tests first before complex flows

## Troubleshooting

### "Element not found"
- Check if selector is correct
- Add more wait time: `WAIT 3`
- Verify element is visible: `EXPECT VISIBLE "#element"`

### "Test times out"
- Increase wait times
- Check if website is accessible
- Verify network connection

### "Click not working"
- Ensure element is clickable
- Add wait before clicking: `WAIT 2` then `CLICK`
- Check if element is covered by another element

## Example: Complete Test Flow

```assure
TEST "Complete BeRides User Journey"

# 1. Open homepage
OPEN "https://stage.berides.com/"
WAIT 3

# 2. Navigate to login
CLICK "#login-button"
WAIT 2

# 3. Login
TYPE "#email" "test@example.com"
TYPE "#password" "password123"
CLICK "#login-submit"
WAIT 3

# 4. Verify logged in
EXPECT URL CONTAINS "dashboard"
EXPECT VISIBLE "#user-menu"

# 5. Book a ride
CLICK "#book-ride"
WAIT 2
TYPE "#from" "Location A"
TYPE "#to" "Location B"
CLICK "#confirm"
WAIT 3

# 6. Verify booking
EXPECT TEXT ".confirmation" CONTAINS "confirmed"
```

## Next Steps

1. Run `homepage.assure` first to verify basic connectivity
2. Inspect the website to find actual selectors
3. Update each test file with real selectors
4. Uncomment and customize test steps
5. Run tests and verify they work
6. Add more test scenarios as needed

Happy Testing! 🚀

