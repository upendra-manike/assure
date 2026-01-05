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
 * Wait for element to be available
 */
export async function waitForSelector(session: BrowserSession, selector: string, timeout: number = 5000): Promise<number> {
  const startTime = Date.now();
  const checkInterval = 100;

  while (Date.now() - startTime < timeout) {
    try {
      const nodeId = await querySelector(session, selector);
      if (nodeId !== null) {
        return nodeId;
      }
    } catch (error) {
      // Element not found, continue waiting
    }
    await setTimeout(checkInterval);
  }

  throw new Error(`Element "${selector}" not found within ${timeout}ms`);
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
 * Click an element
 */
export async function clickElement(session: BrowserSession, selector: string): Promise<void> {
  const nodeId = await waitForSelector(session, selector);
  
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
 * Type text into an input field
 */
export async function typeText(session: BrowserSession, selector: string, text: string): Promise<void> {
  const nodeId = await waitForSelector(session, selector);
  
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
 * Get text content of an element
 */
export async function getTextContent(session: BrowserSession, selector: string): Promise<string> {
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
