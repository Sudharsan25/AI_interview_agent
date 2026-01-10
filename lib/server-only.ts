/**
 * Server-only utility
 * Throws an error if code is executed on the client side
 */
export function assertServerOnly() {
  if (typeof window !== 'undefined') {
    throw new Error(
      'This code can only run on the server. Use API routes or server actions instead.'
    );
  }
}
