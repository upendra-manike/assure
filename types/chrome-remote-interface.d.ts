declare module 'chrome-remote-interface' {
  interface CDP {
    (options?: { port?: number; host?: string }): Promise<any>;
  }
  const cdp: CDP;
  export default cdp;
}

