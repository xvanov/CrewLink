/**
 * API Request Helper - Pure Function Pattern
 * 
 * This helper demonstrates the TEA pattern:
 * - Pure function (framework-agnostic, testable)
 * - Accepts all dependencies explicitly
 * - Can be wrapped in fixtures or used directly
 * 
 * Reference: .bmad/bmm/testarch/knowledge/fixture-architecture.md
 */

type ApiRequestParams = {
  baseUrl: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  data?: unknown;
  headers?: Record<string, string>;
  token?: string;
};

/**
 * Pure function for making HTTP requests
 * Framework-agnostic - works in unit tests, Playwright, or any context
 */
export async function apiRequest({
  baseUrl,
  method,
  endpoint,
  data,
  headers = {},
  token,
}: ApiRequestParams): Promise<unknown> {
  const url = `${baseUrl}${endpoint}`;
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...headers,
  };

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${method} ${url} failed: ${response.status} ${errorText}`);
  }

  return response.json();
}


