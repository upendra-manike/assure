/**
 * Browser Engine - Custom CDP-based browser automation
 * Built from scratch using Chrome DevTools Protocol
 */

import CDP from 'chrome-remote-interface';
import { spawn, ChildProcess } from 'child_process';
import { setTimeout } from 'timers/promises';
import { existsSync } from 'fs';

export interface BrowserSession {
  chromeProcess: ChildProcess;
  client: any;
  Page: any;
  Runtime: any;
  DOM: any;
  Input: any;
  Network: any;
}

const DEFAULT_CHROME_ARGS = [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--remote-debugging-port=9222'
];

/**
 * Find Chrome/Chromium executable path
 */
function findChromeExecutable(): string {
  const platform = process.platform;
  
  if (platform === 'darwin') {
    // macOS
    const paths = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium'
    ];
    for (const path of paths) {
      if (existsSync(path)) return path;
    }
  } else if (platform === 'linux') {
    // Try common Linux Chrome/Chromium paths
    const linuxPaths = ['google-chrome', 'chromium', 'chromium-browser'];
    for (const chromePath of linuxPaths) {
      // On Linux, we'll try to execute it to see if it exists
      // For now, return the first one and let spawn handle errors
      return chromePath;
    }
    return 'google-chrome'; // fallback
  } else if (platform === 'win32') {
    const paths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ];
    for (const path of paths) {
      if (existsSync(path)) return path;
    }
  }
  
  throw new Error('Chrome/Chromium not found. Please install Chrome or set CHROME_PATH environment variable.');
}

/**
 * Launch Chrome and connect via CDP
 */
export async function createBrowser(headless: boolean = true): Promise<BrowserSession> {
  const chromePath = process.env.CHROME_PATH || findChromeExecutable();
  const args = headless ? DEFAULT_CHROME_ARGS : DEFAULT_CHROME_ARGS.filter(arg => arg !== '--headless');
  
  // Launch Chrome
  const chromeProcess = spawn(chromePath, args, {
    stdio: 'ignore',
    detached: false
  });

  // Wait for Chrome to start
  await setTimeout(2000);

  // Connect to Chrome via CDP
  let client: any;
  let retries = 10;
  
  while (retries > 0) {
    try {
      client = await CDP({ port: 9222 });
      break;
    } catch (error) {
      retries--;
      if (retries === 0) {
        chromeProcess.kill();
        throw new Error('Failed to connect to Chrome DevTools Protocol');
      }
      await setTimeout(500);
    }
  }

  if (!client) {
    chromeProcess.kill();
    throw new Error('Failed to connect to Chrome DevTools Protocol');
  }

  // Enable required domains
  const { Page, Runtime, DOM, Input, Network } = client;
  await Page.enable();
  await Runtime.enable();
  await DOM.enable();
  await Network.enable();

  return {
    chromeProcess,
    client,
    Page,
    Runtime,
    DOM,
    Input,
    Network
  };
}

/**
 * Close browser and cleanup
 */
export async function closeBrowser(session: BrowserSession): Promise<void> {
  try {
    await session.client.close();
  } catch (error) {
    // Ignore close errors
  }
  
  try {
    session.chromeProcess.kill();
  } catch (error) {
    // Ignore kill errors
  }
}

/**
 * Navigate to URL
 */
export async function navigate(session: BrowserSession, url: string): Promise<void> {
  await session.Page.navigate({ url });
  await session.Page.loadEventFired();
}

/**
 * Get page title
 */
export async function getTitle(session: BrowserSession): Promise<string> {
  const result = await session.Runtime.evaluate({ expression: 'document.title' });
  return result.result.value;
}

/**
 * Get current URL
 */
export async function getUrl(session: BrowserSession): Promise<string> {
  const result = await session.Runtime.evaluate({ expression: 'window.location.href' });
  return result.result.value;
}

/**
 * Wait for element to be available (enhanced for dynamic elements)
 */
export async function waitForSelector(session: BrowserSession, selector: string, timeout: number = 10000): Promise<number> {
  const startTime = Date.now();
  const checkInterval = 100;

  while (Date.now() - startTime < timeout) {
    try {
      const nodeId = await querySelector(session, selector);
      if (nodeId !== null) {
        // Also check if element is visible and in viewport
        const isVisible = await checkElementVisible(session, nodeId);
        if (isVisible) {
          return nodeId;
        }
      }
    } catch (error) {
      // Element not found, continue waiting
    }
    await setTimeout(checkInterval);
  }

  throw new Error(`Element "${selector}" not found or not visible within ${timeout}ms`);
}

/**
 * Wait for element to be visible and clickable
 */
export async function waitForElementVisible(session: BrowserSession, selector: string, timeout: number = 10000): Promise<number> {
  const startTime = Date.now();
  const checkInterval = 100;

  while (Date.now() - startTime < timeout) {
    try {
      const nodeId = await querySelector(session, selector);
      if (nodeId !== null) {
        const visible = await checkElementVisible(session, nodeId);
        const clickable = await checkElementClickable(session, nodeId);
        if (visible && clickable) {
          return nodeId;
        }
      }
    } catch (error) {
      // Continue waiting
    }
    await setTimeout(checkInterval);
  }

  throw new Error(`Element "${selector}" not visible or clickable within ${timeout}ms`);
}

/**
 * Check if element is visible in viewport
 */
async function checkElementVisible(session: BrowserSession, nodeId: number): Promise<boolean> {
  try {
    const result = await session.DOM.resolveNode({ nodeId });
    if (!result.object.objectId) return false;

    const visibilityResult = await session.Runtime.callFunctionOn({
      objectId: result.object.objectId,
      functionDeclaration: `
        function() {
          const rect = this.getBoundingClientRect();
          const style = window.getComputedStyle(this);
          return (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            rect.width > 0 &&
            rect.height > 0 &&
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
          );
        }
      `,
      returnByValue: true
    });

    return visibilityResult.result.value === true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if element is clickable (not disabled, not covered)
 */
async function checkElementClickable(session: BrowserSession, nodeId: number): Promise<boolean> {
  try {
    const result = await session.DOM.resolveNode({ nodeId });
    if (!result.object.objectId) return false;

    const clickableResult = await session.Runtime.callFunctionOn({
      objectId: result.object.objectId,
      functionDeclaration: `
        function() {
          if (this.disabled) return false;
          if (this.getAttribute('aria-disabled') === 'true') return false;
          
          // Check if element is covered by another element
          const rect = this.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const topElement = document.elementFromPoint(centerX, centerY);
          
          return topElement === this || this.contains(topElement);
        }
      `,
      returnByValue: true
    });

    return clickableResult.result.value === true;
  } catch (error) {
    return false;
  }
}

/**
 * Wait for text to appear in element
 */
export async function waitForText(session: BrowserSession, selector: string, text: string, timeout: number = 10000): Promise<void> {
  const startTime = Date.now();
  const checkInterval = 200;

  while (Date.now() - startTime < timeout) {
    try {
      const elementText = await getTextContent(session, selector);
      if (elementText.includes(text)) {
        return;
      }
    } catch (error) {
      // Continue waiting
    }
    await setTimeout(checkInterval);
  }

  throw new Error(`Text "${text}" not found in element "${selector}" within ${timeout}ms`);
}

/**
 * Wait for URL to change or contain specific text
 */
export async function waitForUrl(session: BrowserSession, expectedUrl: string, timeout: number = 10000): Promise<void> {
  const startTime = Date.now();
  const checkInterval = 200;

  while (Date.now() - startTime < timeout) {
    try {
      const currentUrl = await getUrl(session);
      if (currentUrl.includes(expectedUrl)) {
        return;
      }
    } catch (error) {
      // Continue waiting
    }
    await setTimeout(checkInterval);
  }

  throw new Error(`URL did not contain "${expectedUrl}" within ${timeout}ms`);
}

/**
 * Wait for network to be idle (no pending requests)
 */
export async function waitForNetworkIdle(session: BrowserSession, timeout: number = 5000): Promise<void> {
  // Wait a bit for any pending requests
  await setTimeout(500);
  
  // Check if there are active network requests
  const startTime = Date.now();
  const checkInterval = 100;

  while (Date.now() - startTime < timeout) {
    try {
      const result = await session.Runtime.evaluate({
        expression: `
          (function() {
            if (typeof window.fetch === 'undefined') return true;
            // Simple check - in real implementation, track fetch/XHR requests
            return document.readyState === 'complete';
          })()
        `,
        returnByValue: true
      });

      if (result.result.value === true) {
        await setTimeout(500); // Wait a bit more to ensure stability
        return;
      }
    } catch (error) {
      // Continue waiting
    }
    await setTimeout(checkInterval);
  }
}

/**
 * Query selector and return nodeId
 */
export async function querySelector(session: BrowserSession, selector: string): Promise<number | null> {
  const document = await session.DOM.getDocument();
  const { nodeId } = await session.DOM.querySelector({
    nodeId: document.root.nodeId,
    selector: selector
  });
  return nodeId;
}

/**
 * Click an element (enhanced for dynamic elements)
 */
export async function clickElement(session: BrowserSession, selector: string): Promise<void> {
  // Wait for element to be visible and clickable (handles dynamic elements)
  const nodeId = await waitForElementVisible(session, selector);
  
  // Get bounding box
  const boxModel = await session.DOM.getBoxModel({ nodeId });
  if (!boxModel.model) {
    throw new Error(`Could not get bounding box for selector: ${selector}`);
  }

  const content = boxModel.model.content;
  const x = (content[0] + content[2]) / 2; // Center X
  const y = (content[1] + content[5]) / 2; // Center Y

  // Click at coordinates
  await session.Input.dispatchMouseEvent({
    type: 'mousePressed',
    x: x,
    y: y,
    button: 'left',
    clickCount: 1
  });

  await session.Input.dispatchMouseEvent({
    type: 'mouseReleased',
    x: x,
    y: y,
    button: 'left',
    clickCount: 1
  });

  // Wait a bit for any navigation or updates
  await setTimeout(100);
}

/**
 * Type text into an input field (enhanced for dynamic elements)
 */
export async function typeText(session: BrowserSession, selector: string, text: string): Promise<void> {
  // Wait for element to be visible and ready (handles dynamic elements)
  const nodeId = await waitForElementVisible(session, selector);
  
  // Focus the element
  await session.DOM.focus({ nodeId });

  // Clear existing value using nodeId
  const result = await session.DOM.resolveNode({ nodeId });
  if (result.object.objectId) {
    await session.Runtime.callFunctionOn({
      objectId: result.object.objectId,
      functionDeclaration: 'function() { this.value = ""; this.focus(); }'
    });
  }

  // Type character by character
  for (const char of text) {
    await session.Input.dispatchKeyEvent({
      type: 'char',
      text: char
    });
    await setTimeout(10); // Small delay between keystrokes
  }
}

/**
 * Get text content of an element (enhanced for dynamic elements)
 */
export async function getTextContent(session: BrowserSession, selector: string): Promise<string> {
  // Wait for element to be available (handles dynamic elements)
  const nodeId = await waitForSelector(session, selector);
  const result = await session.DOM.resolveNode({ nodeId });
  
  if (result.object.objectId) {
    const textResult = await session.Runtime.callFunctionOn({
      objectId: result.object.objectId,
      functionDeclaration: 'function() { return this.textContent || this.innerText || ""; }',
      returnByValue: true
    });
    return textResult.result.value || '';
  }
  
  return '';
}

/**
 * Check if element is visible
 */
export async function isVisible(session: BrowserSession, selector: string): Promise<boolean> {
  try {
    const nodeId = await querySelector(session, selector);
    if (nodeId === null) return false;
    
    const result = await session.DOM.resolveNode({ nodeId });
    if (!result.object.objectId) return false;
    
    const visibilityResult = await session.Runtime.callFunctionOn({
      objectId: result.object.objectId,
      functionDeclaration: `
        function() {
          const style = window.getComputedStyle(this);
          return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        }
      `,
      returnByValue: true
    });
    
    return visibilityResult.result.value === true;
  } catch (error) {
    return false;
  }
}

/**
 * Wait for specified seconds
 */
export async function wait(seconds: number): Promise<void> {
  await setTimeout(seconds * 1000);
}
