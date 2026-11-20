import { GoogleGenAI } from '@google/genai';

let cachedClient: GoogleGenAI | null = null;
let quotaExhaustedUntil = 0;

export function hasConfiguredGeminiKey(): boolean {
  const key = process.env.GEMINI_API_KEY?.trim();
  return Boolean(key && key !== 'MY_GEMINI_API_KEY' && key.length > 10);
}

export function isGeminiTemporarilyExhausted(): boolean {
  return Date.now() < quotaExhaustedUntil;
}

export function markGeminiQuotaExhausted(cooldownMs = 90_000): void {
  quotaExhaustedUntil = Date.now() + cooldownMs;
}

export function resetGeminiQuotaCooldown(): void {
  quotaExhaustedUntil = 0;
}

export function getGeminiClient(): GoogleGenAI {
  if (!hasConfiguredGeminiKey()) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        apiVersion: 'v1beta',
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return cachedClient;
}

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
