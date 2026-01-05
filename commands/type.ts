/**
 * TYPE command - Types text into an input field
 */

import { BrowserSession, typeText } from '../engine/browser.js';

export async function executeType(session: BrowserSession, args: string[]): Promise<void> {
  if (args.length < 2) {
    throw new Error('TYPE command requires a selector and text argument');
  }

  const selector = args[0];
  const text = args.slice(1).join(' '); // Join in case text has spaces
  await typeText(session, selector, text);
}
