'use client';

/**
 * Mali fetch wrapper za admin API: JSON, kredencijali, 401 → redirect na login,
 * greške vraća kao Error sa čitljivom porukom (+ lista validationih problema).
 */

export class AdminApiError extends Error {
  issues?: string[];
  status: number;

  constructor(message: string, status: number, issues?: string[]) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

export async function adminFetch<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body && typeof init.body === 'string' ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  if (response.status === 401) {
    window.location.href = '/admin/login';
    throw new AdminApiError('Sesija je istekla — prijavi se ponovo.', 401);
  }

  let data: Record<string, unknown> = {};
  try {
    data = await response.json();
  } catch {
    // ne-JSON odgovor (npr. 500 HTML) — data ostaje prazan
  }

  if (!response.ok || data.success === false) {
    throw new AdminApiError(
      typeof data.error === 'string' ? data.error : `Greška (HTTP ${response.status}).`,
      response.status,
      Array.isArray(data.issues) ? (data.issues as string[]) : undefined
    );
  }
  return data as T;
}
