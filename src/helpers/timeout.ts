function awaitTimeout(delay: number, error: Error): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(error);
    }, delay);
  });
}

export function wrapPromiseWithTimeout<T>(
  promise: Promise<T>,
  delay: number,
  error: Error,
): Promise<T> {
  return Promise.race([promise, awaitTimeout(delay, error)]);
}
