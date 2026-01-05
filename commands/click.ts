/**
 * CLICK command - Clicks an element
 */

import { BrowserSession, clickElement } from '../engine/browser.js';

export async function executeClick(session: BrowserSession, args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error('CLICK command requires a selector argument');
  }

  const selector = args[0];
  await clickElement(session, selector);
}
