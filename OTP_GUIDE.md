# 🔐 OTP Validation Support in Assure

Assure now supports **One-Time Password (OTP) validation** - perfect for testing authentication flows, 2FA, password resets, and phone/email verification.

## ✨ OTP Commands

### OTP MANUAL
Enter OTP code manually (for hardcoded test OTPs):

```assure
OTP MANUAL "123456" "#otp-input"
```

**Syntax:**
```
OTP MANUAL <code> [selector]
```

**Example:**
```assure
OTP MANUAL "654321" "#verification-code"
```

### OTP FROM CLIPBOARD
Read OTP from system clipboard:

```assure
OTP FROM CLIPBOARD "#otp-input"
```

**How it works:**
1. Copy OTP to clipboard (manually or via script)
2. Use `OTP FROM CLIPBOARD` command
3. Assure extracts OTP and enters it automatically

**Example:**
```assure
# Copy OTP to clipboard first, then:
OTP FROM CLIPBOARD "#otp-code"
```

### OTP FROM FILE
Read OTP from a text file:

```assure
OTP FROM FILE "otp.txt" "#otp-input"
```

**Syntax:**
```
OTP FROM FILE <file-path> [selector]
```

**File format:**
Create a file `otp.txt` with just the OTP:
```
123456
```

Or with text (OTP will be extracted):
```
Your verification code is: 123456
```

**Example:**
```assure
OTP FROM FILE "otp.txt" "#verification-code"
```

### OTP FROM EMAIL (Future)
Read OTP from email (requires email service integration):

```assure
OTP FROM EMAIL "#otp-input"
```

**Note:** Currently requires manual setup. Use `OTP FROM FILE` or `OTP FROM CLIPBOARD` instead.

### OTP FROM SMS (Future)
Read OTP from SMS (requires SMS service integration):

```assure
OTP FROM SMS "#otp-input"
```

**Note:** Currently requires manual setup. Use `OTP FROM FILE` or `OTP FROM CLIPBOARD` instead.

## 📝 Complete Examples

### Example 1: Login with 2FA

```assure
TEST "2FA Login"

# Step 1: Login
OPEN "https://app.example.com/login"
TYPE "#email" "user@example.com"
TYPE "#password" "password123"
CLICK "#login-button"

# Step 2: Wait for OTP input
WAIT FOR ELEMENT "#otp-input"
WAIT 2

# Step 3: Enter OTP
OTP MANUAL "123456" "#otp-input"

# Step 4: Verify
CLICK "#verify-button"
WAIT 3

# Step 5: Verify logged in
EXPECT URL CONTAINS "/dashboard"
```

### Example 2: Registration with Email Verification

```assure
TEST "Registration with Email OTP"

# Register
OPEN "https://app.example.com/register"
TYPE "#email" "user@example.com"
TYPE "#password" "password123"
CLICK "#register-button"

# Wait for OTP page
WAIT FOR ELEMENT "#otp-input"
WAIT FOR TEXT ".message" "OTP sent to email"

# Enter OTP from file (OTP saved in file)
OTP FROM FILE "email-otp.txt" "#otp-input"

# Verify
CLICK "#verify-email"
WAIT 3

# Verify success
EXPECT TEXT ".success" CONTAINS "Email verified"
```

### Example 3: Password Reset

```assure
TEST "Password Reset with OTP"

# Request reset
OPEN "https://app.example.com/forgot-password"
TYPE "#email" "user@example.com"
CLICK "#send-reset-code"
WAIT 2

# Wait for OTP
WAIT FOR ELEMENT "#reset-code"
WAIT FOR TEXT ".status" "Code sent"

# Enter OTP (from clipboard)
OTP FROM CLIPBOARD "#reset-code"

# Verify OTP
CLICK "#verify-code"
WAIT 2

# Set new password
WAIT FOR ELEMENT "#new-password"
TYPE "#new-password" "NewPass123!"
TYPE "#confirm-password" "NewPass123!"
CLICK "#reset-password"
WAIT 3

# Verify success
EXPECT URL CONTAINS "/login"
EXPECT TEXT ".message" CONTAINS "Password reset"
```

### Example 4: Phone Verification

```assure
TEST "Phone Verification"

OPEN "https://app.example.com/verify-phone"
TYPE "#phone" "+1234567890"
CLICK "#send-sms"
WAIT 2

# Wait for SMS OTP
WAIT FOR ELEMENT "#sms-code"
WAIT FOR TEXT ".info" "SMS sent"

# Enter OTP from clipboard (after receiving SMS)
OTP FROM CLIPBOARD "#sms-code"

# Verify phone
CLICK "#verify-phone"
WAIT 3

# Verify success
EXPECT TEXT ".verified" CONTAINS "Phone verified"
```

## 🔧 How It Works

### OTP Extraction

Assure automatically extracts OTP from:
- Plain numbers: `123456`
- Text with OTP: `Your code is: 123456`
- Common patterns: `code: 123456`, `OTP: 123456`
- 4-8 digit codes

### Smart Detection

The OTP command:
1. **Waits for OTP input field** to be visible and ready
2. **Extracts OTP** from source (file, clipboard, etc.)
3. **Validates OTP format** (4-8 digits)
4. **Types OTP** into the input field
5. **Provides clear feedback** on success/failure

## 💡 Best Practices

### ✅ Do's

1. **Always wait for OTP input field**
   ```assure
   WAIT FOR ELEMENT "#otp-input"
   OTP MANUAL "123456" "#otp-input"
   ```

2. **Use OTP FROM FILE for automated tests**
   ```assure
   # Store OTP in file
   echo "123456" > otp.txt
   # Use in test
   OTP FROM FILE "otp.txt" "#otp-input"
   ```

3. **Use OTP FROM CLIPBOARD for manual testing**
   ```assure
   # Copy OTP, then:
   OTP FROM CLIPBOARD "#otp-input"
   ```

4. **Verify OTP submission**
   ```assure
   OTP MANUAL "123456" "#otp-input"
   CLICK "#verify-button"
   WAIT 3
   EXPECT TEXT ".success" CONTAINS "verified"
   ```

### ❌ Don'ts

1. **Don't hardcode OTPs in production tests** (use files or clipboard)
2. **Don't skip waiting for OTP input field**
3. **Don't forget to verify OTP submission**

## 🎯 Use Cases

### 1. Two-Factor Authentication (2FA)
```assure
# Login → Enter OTP → Verify
OTP MANUAL "123456" "#2fa-code"
```

### 2. Email Verification
```assure
# Register → Receive email → Enter OTP
OTP FROM FILE "email-otp.txt" "#email-code"
```

### 3. Phone Verification
```assure
# Enter phone → Receive SMS → Enter OTP
OTP FROM CLIPBOARD "#sms-code"
```

### 4. Password Reset
```assure
# Request reset → Receive code → Enter OTP
OTP MANUAL "654321" "#reset-code"
```

### 5. Account Recovery
```assure
# Recover account → Verify with OTP
OTP FROM FILE "recovery-otp.txt" "#recovery-code"
```

## 🔄 Workflow Examples

### Automated OTP Testing

**Step 1:** Create OTP file
```bash
echo "123456" > otp.txt
```

**Step 2:** Use in test
```assure
OTP FROM FILE "otp.txt" "#otp-input"
CLICK "#verify"
```

### Manual OTP Testing

**Step 1:** Copy OTP to clipboard
**Step 2:** Use in test
```assure
OTP FROM CLIPBOARD "#otp-input"
CLICK "#verify"
```

## 🐛 Troubleshooting

### Problem: "Could not extract OTP from file"

**Solutions:**
1. Ensure file exists and is readable
2. Check file contains OTP (4-8 digits)
3. Verify file path is correct

### Problem: "Could not read OTP from clipboard"

**Solutions:**
1. Ensure OTP is copied to clipboard
2. Check clipboard contains OTP code
3. Try copying OTP again

### Problem: "Invalid OTP code"

**Solutions:**
1. OTP must be 4-8 digits
2. Check OTP format
3. Remove spaces or special characters

### Problem: "Element not found"

**Solutions:**
1. Wait for OTP input field first
2. Check selector is correct
3. Use `WAIT FOR ELEMENT` before OTP command

## 📊 OTP Source Comparison

| Source | Use Case | Pros | Cons |
|--------|----------|------|------|
| **MANUAL** | Hardcoded test OTPs | Simple, fast | Not dynamic |
| **FILE** | Automated tests | Automated, reliable | Requires file management |
| **CLIPBOARD** | Manual testing | Easy, flexible | Manual step required |
| **EMAIL** | Real email OTPs | Realistic | Requires integration |
| **SMS** | Real SMS OTPs | Realistic | Requires integration |

## 🚀 Summary

Assure now supports OTP validation with:

- ✅ **OTP MANUAL** - Enter OTP directly
- ✅ **OTP FROM FILE** - Read from file
- ✅ **OTP FROM CLIPBOARD** - Read from clipboard
- ✅ **Auto-waiting** - Waits for OTP input field
- ✅ **Smart extraction** - Extracts OTP from text
- ✅ **Format validation** - Validates OTP format

**Perfect for testing 2FA, email verification, phone verification, and password resets!** 🔐

