/**
 * EXPECT command - Asserts conditions
 * Built from scratch using CDP
 */

import { BrowserSession, getTitle, getUrl, getTextContent, isVisible } from '../engine/browser.js';

export async function executeExpect(session: BrowserSession, args: string[]): Promise<void> {
  if (args.length < 2) {
    throw new Error('EXPECT command requires at least 2 arguments');
  }

  const [target, condition, ...valueParts] = args;
  const value = valueParts.join(' ');

  switch (target.toUpperCase()) {
    case 'TITLE':
      const title = await getTitle(session);
      if (condition.toUpperCase() === 'CONTAINS') {
        if (!title.includes(value)) {
          throw new Error(`Expected title to contain "${value}", but got "${title}"`);
        }
      } else if (condition.toUpperCase() === 'EQUALS') {
        if (title !== value) {
          throw new Error(`Expected title to equal "${value}", but got "${title}"`);
        }
      } else {
        throw new Error(`Unknown condition for TITLE: ${condition}`);
      }
      break;

    case 'URL':
      const url = await getUrl(session);
      if (condition.toUpperCase() === 'CONTAINS') {
        if (!url.includes(value)) {
          throw new Error(`Expected URL to contain "${value}", but got "${url}"`);
        }
      } else if (condition.toUpperCase() === 'EQUALS') {
        if (url !== value) {
          throw new Error(`Expected URL to equal "${value}", but got "${url}"`);
        }
      } else {
        throw new Error(`Unknown condition for URL: ${condition}`);
      }
      break;

    case 'TEXT':
      if (args.length < 3) {
        throw new Error('EXPECT TEXT requires a selector, condition, and value');
      }
      // For TEXT, the format is: EXPECT TEXT selector condition value
      // But args already has target removed, so: [selector, condition, ...value]
      const selector = args[0];
      const textCondition = args[1];
      const textValue = args.slice(2).join(' ');
      
      const elementText = await getTextContent(session, selector);
      
      if (textCondition.toUpperCase() === 'CONTAINS') {
        if (!elementText.includes(textValue)) {
          throw new Error(`Expected text to contain "${textValue}", but got "${elementText}"`);
        }
      } else if (textCondition.toUpperCase() === 'EQUALS') {
        if (elementText.trim() !== textValue.trim()) {
          throw new Error(`Expected text to equal "${textValue}", but got "${elementText}"`);
        }
      } else {
        throw new Error(`Unknown condition for TEXT: ${textCondition}`);
      }
      break;

    case 'VISIBLE':
      const visibleSelector = args[0];
      const visible = await isVisible(session, visibleSelector);
      if (!visible) {
        throw new Error(`Expected element "${visibleSelector}" to be visible`);
      }
      break;

    default:
      throw new Error(`Unknown EXPECT target: ${target}`);
  }
}
