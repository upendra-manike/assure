#!/usr/bin/env node
/**
 * Assure Test Runner
 * Runs .assure test files using custom CDP-based engine
 */

import fs from 'fs';
import path from 'path';
import { parse } from './language/parser.js';
import { createBrowser, closeBrowser } from './engine/browser.js';
import { execute } from './engine/executor.js';

async function runTest(testFile: string) {
  console.log(`\n🚀 Assure Test Runner`);
  console.log(`📄 Running: ${testFile}\n`);

  // Validate file extension
  if (!testFile.endsWith('.assure')) {
    console.error(`❌ Error: Test files must have .assure extension`);
    console.error(`   Received: ${testFile}`);
    console.error(`   Expected: *.assure`);
    process.exit(1);
  }

  // Read test file
  if (!fs.existsSync(testFile)) {
    console.error(`❌ Test file not found: ${testFile}`);
    console.error(`   Make sure the file exists and has the .assure extension`);
    process.exit(1);
  }

  const script = fs.readFileSync(testFile, 'utf-8');
  const commands = parse(script);

  if (commands.length === 0) {
    console.error('❌ No commands found in test file');
    process.exit(1);
  }

  let session;
  try {
    // Create browser session
    console.log('🌐 Launching browser...');
    session = await createBrowser(true); // headless mode
    console.log('✓ Browser launched\n');

    // Execute commands
    await execute(commands, session);

    console.log('\n✅ TEST COMPLETED SUCCESSFULLY');
  } catch (error: any) {
    console.error(`\n❌ TEST FAILED: ${error.message}`);
    process.exit(1);
  } finally {
    // Cleanup
    if (session) {
      console.log('\n🧹 Cleaning up...');
      await closeBrowser(session);
      console.log('✓ Browser closed');
    }
  }
}

// Main entry point
const testFile = process.argv[2];

if (!testFile) {
  console.log(`
🧪 Assure Testing Language

Usage:
  assure <test-file.assure>

Examples:
  assure login.assure
  assure tests/checkout.assure

For more information, visit: https://github.com/yourusername/assure
`);
  process.exit(0);
}

runTest(testFile).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

