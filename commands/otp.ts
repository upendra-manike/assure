/**
 * OTP command - Handles One-Time Password validation
 * Supports reading OTP from email, SMS, clipboard, or manual input
 */

import { BrowserSession, typeText, waitForElementVisible } from '../engine/browser.js';
import { readFileSync } from 'fs';

export interface OTPSource {
  type: 'email' | 'sms' | 'clipboard' | 'manual' | 'file';
  value?: string;
  filePath?: string;
  selector?: string;
}

/**
 * Extract OTP from text (common patterns)
 */
function extractOTP(text: string): string | null {
  // Common OTP patterns
  const patterns = [
    /\b\d{4}\b/,           // 4 digits
    /\b\d{6}\b/,           // 6 digits
    /\b\d{8}\b/,           // 8 digits
    /code[:\s]+(\d{4,8})/i, // "code: 123456"
    /otp[:\s]+(\d{4,8})/i,  // "otp: 123456"
    /verification[:\s]+(\d{4,8})/i, // "verification: 123456"
    /(\d{4,8})/g,          // Any 4-8 digit number
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      // Return the first match, prefer longer matches
      const matches = text.match(/\d{4,8}/g);
      if (matches && matches.length > 0) {
        // Return the longest match (most likely to be OTP)
        return matches.sort((a, b) => b.length - a.length)[0];
      }
      return match[1] || match[0];
    }
  }

  return null;
}

/**
 * Read OTP from email (simulated - in real scenario, would connect to email service)
 */
async function readOTPFromEmail(emailService?: string): Promise<string | null> {
  // In a real implementation, this would:
  // 1. Connect to email service (Gmail API, IMAP, etc.)
  // 2. Fetch latest email
  // 3. Extract OTP from email body
  // 4. Return OTP
  
  // For now, return null - user should provide OTP manually or via file
  console.log('⚠️  Email OTP reading requires email service integration');
  console.log('   Please use OTP FROM FILE or OTP MANUAL instead');
  return null;
}

/**
 * Read OTP from SMS (simulated - in real scenario, would connect to SMS service)
 */
async function readOTPFromSMS(phoneNumber?: string): Promise<string | null> {
  // In a real implementation, this would:
  // 1. Connect to SMS service (Twilio, AWS SNS, etc.)
  // 2. Fetch latest SMS
  // 3. Extract OTP from SMS body
  // 4. Return OTP
  
  console.log('⚠️  SMS OTP reading requires SMS service integration');
  console.log('   Please use OTP FROM FILE or OTP MANUAL instead');
  return null;
}

/**
 * Read OTP from clipboard
 */
async function readOTPFromClipboard(): Promise<string | null> {
  try {
    // Try to read from clipboard using system command
    const { execSync } = require('child_process');
    const platform = process.platform;
    
    let clipboardContent = '';
    if (platform === 'darwin') {
      // macOS
      clipboardContent = execSync('pbpaste', { encoding: 'utf-8' });
    } else if (platform === 'linux') {
      // Linux (requires xclip or xsel)
      try {
        clipboardContent = execSync('xclip -selection clipboard -o', { encoding: 'utf-8' });
      } catch {
        clipboardContent = execSync('xsel --clipboard --output', { encoding: 'utf-8' });
      }
    } else if (platform === 'win32') {
      // Windows
      clipboardContent = execSync('powershell -command "Get-Clipboard"', { encoding: 'utf-8' });
    }
    
    if (clipboardContent) {
      const otp = extractOTP(clipboardContent.trim());
      if (otp) {
        return otp;
      }
    }
  } catch (error) {
    // Clipboard reading failed
  }
  
  return null;
}

/**
 * Read OTP from file
 */
function readOTPFromFile(filePath: string): string | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const otp = extractOTP(content.trim());
    return otp;
  } catch (error) {
    throw new Error(`Failed to read OTP from file: ${filePath}`);
  }
}

/**
 * Execute OTP command
 */
export async function executeOTP(session: BrowserSession, args: string[]): Promise<void> {
  if (args.length < 2) {
    throw new Error('OTP command requires: OTP FROM <source> [selector] or OTP MANUAL <code> [selector]');
  }

  const action = args[0].toUpperCase();
  const source = args[1];
  const selector = args.length > 2 ? args[2] : 'input[type="text"]'; // Default OTP input selector

  let otpCode: string | null = null;

  // Wait for OTP input field to be ready
  await waitForElementVisible(session, selector);

  if (action === 'FROM') {
    const sourceType = source.toUpperCase();

    switch (sourceType) {
      case 'EMAIL':
        otpCode = await readOTPFromEmail();
        if (!otpCode) {
          throw new Error('Could not read OTP from email. Use OTP FROM FILE or OTP MANUAL instead.');
        }
        break;

      case 'SMS':
        otpCode = await readOTPFromSMS();
        if (!otpCode) {
          throw new Error('Could not read OTP from SMS. Use OTP FROM FILE or OTP MANUAL instead.');
        }
        break;

      case 'CLIPBOARD':
        otpCode = await readOTPFromClipboard();
        if (!otpCode) {
          throw new Error('Could not read OTP from clipboard. Make sure OTP is copied to clipboard.');
        }
        console.log(`✓ OTP read from clipboard: ${otpCode}`);
        break;

      case 'FILE':
        if (args.length < 3) {
          throw new Error('OTP FROM FILE requires a file path');
        }
        const filePath = args[2];
        const selectorForFile = args.length > 3 ? args[3] : selector;
        otpCode = readOTPFromFile(filePath);
        if (!otpCode) {
          throw new Error(`Could not extract OTP from file: ${filePath}`);
        }
        console.log(`✓ OTP read from file: ${otpCode}`);
        await typeText(session, selectorForFile, otpCode);
        return;

      default:
        throw new Error(`Unknown OTP source: ${source}. Use EMAIL, SMS, CLIPBOARD, or FILE`);
    }
  } else if (action === 'MANUAL') {
    // OTP MANUAL <code> [selector]
    otpCode = args[1];
    const manualSelector = args.length > 2 ? args[2] : selector;
    
    if (!otpCode || !/^\d{4,8}$/.test(otpCode)) {
      throw new Error(`Invalid OTP code: ${otpCode}. OTP should be 4-8 digits`);
    }
    
    console.log(`✓ Using manual OTP: ${otpCode}`);
    await typeText(session, manualSelector, otpCode);
    return;
  } else {
    throw new Error(`Unknown OTP action: ${action}. Use FROM or MANUAL`);
  }

  if (!otpCode) {
    throw new Error('Failed to get OTP code');
  }

  // Type OTP into the input field
  await typeText(session, selector, otpCode);
  console.log(`✓ OTP entered: ${otpCode}`);
}

