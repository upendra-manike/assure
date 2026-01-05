/**
 * OPEN command - Navigates to a URL
 */

import { BrowserSession, navigate } from '../engine/browser.js';

export async function executeOpen(session: BrowserSession, args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error('OPEN command requires a URL argument');
  }

  const url = args[0];
  await navigate(session, url);
}
