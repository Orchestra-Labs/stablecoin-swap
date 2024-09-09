import { Buffer as BufferPolyfill } from 'buffer';

declare let Buffer: typeof BufferPolyfill;
globalThis.Buffer = BufferPolyfill;
