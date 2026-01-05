/**
 * WAIT FOR command - Wait for dynamic elements and conditions
 */

import { BrowserSession, waitForElementVisible, waitForText, waitForUrl, waitForNetworkIdle } from '../engine/browser.js';

export async function executeWaitFor(session: BrowserSession, args: string[]): Promise<void> {
  if (args.length < 2) {
    throw new Error('WAIT FOR command requires a condition and value');
  }

  const condition = args[0].toUpperCase();
  const value = args[1];

  switch (condition) {
    case 'ELEMENT':
      // WAIT FOR ELEMENT selector
      if (args.length < 2) {
        throw new Error('WAIT FOR ELEMENT requires a selector');
      }
      const selector = args[1];
      await waitForElementVisible(session, selector);
      break;

    case 'TEXT':
      // WAIT FOR TEXT selector "text"
      if (args.length < 3) {
        throw new Error('WAIT FOR TEXT requires a selector and text');
      }
      const textSelector = args[1];
      const textToWait = args.slice(2).join(' ');
      await waitForText(session, textSelector, textToWait);
      break;

    case 'URL':
      // WAIT FOR URL "url"
      await waitForUrl(session, value);
      break;

    case 'NETWORK':
      // WAIT FOR NETWORK IDLE
      await waitForNetworkIdle(session);
      break;

    default:
      throw new Error(`Unknown WAIT FOR condition: ${condition}`);
  }
}

