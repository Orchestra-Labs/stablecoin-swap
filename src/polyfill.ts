import { Buffer } from 'buffer';
import process from 'process';

// Ensure global objects exist
if (typeof window !== 'undefined') {
  (window as any).global = window;
  (window as any).Buffer = Buffer;
  (window as any).process = process;
}

if (typeof global !== 'undefined') {
  (global as any).Buffer = Buffer;
  (global as any).process = process;
}
