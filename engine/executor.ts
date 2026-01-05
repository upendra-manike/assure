/**
 * Command Executor - Executes Assure commands
 */

import { BrowserSession } from './browser.js';
import { Command } from '../language/parser.js';
import { executeOpen } from '../commands/open.js';
import { executeClick } from '../commands/click.js';
import { executeType } from '../commands/type.js';
import { executeExpect } from '../commands/expect.js';
import { wait } from './browser.js';

export async function execute(commands: Command[], session: BrowserSession): Promise<void> {
  for (const cmd of commands) {
    const { action, args, lineNumber } = cmd;

    try {
      switch (action) {
        case 'OPEN':
          await executeOpen(session, args);
          console.log(`✓ Line ${lineNumber}: OPEN "${args[0]}"`);
          break;

        case 'CLICK':
          await executeClick(session, args);
          console.log(`✓ Line ${lineNumber}: CLICK "${args[0]}"`);
          break;

        case 'TYPE':
          await executeType(session, args);
          console.log(`✓ Line ${lineNumber}: TYPE "${args[0]}" "${args.slice(1).join(' ')}"`);
          break;

        case 'WAIT':
          const seconds = Number(args[0]);
          if (isNaN(seconds)) {
            throw new Error(`WAIT command requires a valid number, got: ${args[0]}`);
          }
          await wait(seconds);
          console.log(`✓ Line ${lineNumber}: WAIT ${seconds}`);
          break;

        case 'EXPECT':
          await executeExpect(session, args);
          console.log(`✓ Line ${lineNumber}: EXPECT ${args.join(' ')}`);
          break;

        case 'TEST':
          // TEST is just a label, skip execution
          console.log(`\n🧪 ${args.join(' ')}`);
          break;

        default:
          throw new Error(`Unknown command: ${action} at line ${lineNumber}`);
      }
    } catch (error: any) {
      console.error(`\n❌ Error at line ${lineNumber}: ${action} ${args.join(' ')}`);
      console.error(`   ${error.message}`);
      throw error;
    }
  }
}

