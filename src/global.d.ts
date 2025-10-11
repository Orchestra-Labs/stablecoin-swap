import { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: NodeJS.Process;
  }

  const Buffer: typeof Buffer;
  const process: NodeJS.Process;
}

export {};
