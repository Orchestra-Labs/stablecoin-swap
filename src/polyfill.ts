/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buffer } from 'buffer';
import process from 'process';

(window as any).Buffer = Buffer;
(window as any).process = process;

// Polyfill for process in global scope
if (typeof global.process === 'undefined') {
  (global as any).process = process;
}
