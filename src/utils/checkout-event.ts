// Keep an event ID across network failures/reloads, but start a new order when
// the buyer changes the checkout. Storage is only a hash + random ID, never PII.
export async function checkoutEventId(checkout: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(checkout));
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(b => b.toString(16).padStart(2, '0')).join('');
  const key = 'dermotin_checkout_attempt';
  try {
    const previous = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (previous?.hash === hash && previous?.id && Date.now() - previous.timestamp < 24 * 60 * 60 * 1000) return previous.id;
  } catch { /* Storage can be unavailable. The OMS's own retries are still idempotent. */ }
  const id = crypto.randomUUID();
  try { sessionStorage.setItem(key, JSON.stringify({ hash, id, timestamp: Date.now() })); } catch { /* optional */ }
  return id;
}

export function completeCheckoutAttempt() {
  try { sessionStorage.removeItem('dermotin_checkout_attempt'); } catch { /* optional */ }
}
