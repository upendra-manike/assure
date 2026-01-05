/**
 * OPEN command - Navigates to a URL (enhanced for dynamic pages)
 */

import { BrowserSession, navigate, waitForNetworkIdle } from '../engine/browser.js';

export async function executeOpen(session: BrowserSession, args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error('OPEN command requires a URL argument');
  }

  const url = args[0];
  await navigate(session, url);
  
  // Wait for network to be idle (handles dynamic content loading)
  await waitForNetworkIdle(session);
}
