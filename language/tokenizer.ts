/**
 * Tokenizer - Breaks lines into tokens
 * Handles quoted strings and whitespace-separated tokens
 */

export function tokenize(line: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
      continue;
    }

    if (char === quoteChar && inQuotes) {
      inQuotes = false;
      if (current.trim()) {
        tokens.push(current.trim());
        current = '';
      }
      continue;
    }

    if (inQuotes) {
      current += char;
    } else if (char === ' ' || char === '\t') {
      if (current.trim()) {
        tokens.push(current.trim());
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    tokens.push(current.trim());
  }

  return tokens;
}

