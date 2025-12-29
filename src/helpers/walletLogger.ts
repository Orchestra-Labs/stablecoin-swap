import { toast } from '@/hooks/useToast';

// Error messages to silently ignore (wallet not installed, internal errors)
const SILENT_ERRORS = [
  'Client Not Exist',
  'not provided in `walletconnectOptions`',
  'initClientError',
  'offscreen document',
];

// Error messages that should show toasts (only show once per message type)
const USER_FACING_ERRORS: Record<
  string,
  { title: string; description: string }
> = {
  'Request Rejected': {
    title: 'Connection Rejected',
    description: 'You rejected the wallet connection request.',
  },
  ConnectError: {
    title: 'Connection Failed',
    description: 'Failed to connect to wallet. Please try again.',
  },
  Timeout: {
    title: 'Connection Timeout',
    description: 'The wallet connection timed out. Please try again.',
  },
  timeout: {
    title: 'Connection Timeout',
    description: 'The wallet connection timed out. Please try again.',
  },
  'timed out': {
    title: 'Connection Timeout',
    description: 'The wallet connection timed out. Please try again.',
  },
  'User Rejected': {
    title: 'Request Rejected',
    description: 'You cancelled the wallet request.',
  },
  'User rejected the connection': {
    title: 'Connection Rejected',
    description: 'You rejected the wallet connection request.',
  },
};

const shownToasts = new Set<string>();

function shouldSilence(message: string): boolean {
  return SILENT_ERRORS.some(err => message.includes(err));
}

function getToastForError(
  message: string,
): { title: string; description: string; key: string } | null {
  for (const [key, value] of Object.entries(USER_FACING_ERRORS)) {
    if (message.includes(key)) {
      return { ...value, key };
    }
  }
  return null;
}

// Store original console methods
const originalConsoleError = console.error;

// Helper to handle error messages
function handleErrorMessage(message: string): boolean {
  // Check if this should be silenced
  if (shouldSilence(message)) {
    return true; // handled (silenced)
  }

  // Check if this should show a toast (debounced)
  const toastInfo = getToastForError(message);
  if (toastInfo) {
    // Only show each toast type once per session (reset on page reload)
    if (!shownToasts.has(toastInfo.key)) {
      shownToasts.add(toastInfo.key);
      // Clear after 5 seconds to allow showing again
      setTimeout(() => shownToasts.delete(toastInfo.key), 5000);

      toast({
        title: toastInfo.title,
        description: toastInfo.description,
        variant: 'destructive',
      });
    }
    return true; // handled (showed toast)
  }

  return false; // not handled
}

// Setup function to patch console.error and unhandled rejections
export function setupWalletErrorFilter() {
  // Patch console.error
  console.error = (...args: unknown[]) => {
    const message = args.map(arg => String(arg)).join(' ');
    if (!handleErrorMessage(message)) {
      originalConsoleError.apply(console, args);
    }
  };

  // Catch unhandled promise rejections
  window.addEventListener(
    'unhandledrejection',
    (event: PromiseRejectionEvent) => {
      const message = event.reason?.message || String(event.reason);
      if (handleErrorMessage(message)) {
        event.preventDefault(); // Suppress the console error
      }
    },
  );
}

// Cleanup function if needed
export function cleanupWalletErrorFilter() {
  console.error = originalConsoleError;
}
