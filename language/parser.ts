/**
 * Parser - Parses Assure test scripts into command arrays
 */

import { tokenize } from './tokenizer.js';

export interface Command {
  action: string;
  args: string[];
  lineNumber: number;
}

export function parse(script: string): Command[] {
  const lines = script.split('\n');
  const commands: Command[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines and comments
    if (!line || line.startsWith('#')) {
      continue;
    }

    const tokens = tokenize(line);
    if (tokens.length === 0) {
      continue;
    }

    const [action, ...args] = tokens;
    commands.push({
      action: action.toUpperCase(),
      args: args.map(arg => arg.replace(/^["']|["']$/g, '')), // Remove quotes
      lineNumber: i + 1
    });
  }

  return commands;
}

