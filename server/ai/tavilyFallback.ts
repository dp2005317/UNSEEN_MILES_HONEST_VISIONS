import type { Itinerary, ResearchSource } from '../../src/types/travel';

export interface TavilySearchResultItem {
  title?: string;
  url?: string;
  content?: string;
}

export interface TavilySearchResponse {
  answer?: string;
  results?: TavilySearchResultItem[];
}

export function isGeminiQuotaError(err: unknown): boolean {
  if (!err) return false;
  const status =
    typeof err === 'object' && 'status' in err ? Number((err as { status?: unknown }).status) : NaN;
  if (status === 429) return true;

  const msg = (
    err instanceof Error
      ? err.message
      : typeof err === 'object'
        ? JSON.stringify(err)
        : String(err)
  ).toLowerCase();

  return (
    msg.includes('429') ||
    msg.includes('resource_exhausted') ||
    msg.includes('quota') ||
    msg.includes('rate limit') ||
    msg.includes('too many requests') ||
    msg.includes('exceeded')
  );
}

export function cleanWebSnippet(raw: string, maxLen = 145): string {
  const cleaned = raw
    .replace(/\|+/g, ' · ')
    .replace(/[-_]{3,}/g, ' ')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*|__|`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s*·\s*·+\s*/g, ' · ')
    .replace(/\s+/g, ' ')
    .replace(/^[·\s]+/, '')
    .trim();

  if (cleaned.length <= maxLen) return cleaned;
  const sliced = cleaned.slice(0, maxLen);
  const lastSpace = sliced.lastIndexOf(' ');
  const trimmed = lastSpace > maxLen * 0.6 ? sliced.slice(0, lastSpace) : sliced;
  return `${trimmed.replace(/[.,;:\-·]+$/, '').trim()}…`;
}

export function cleanChatReply(raw: string, maxLen = 3800): string {
  const lines = raw
    .replace(/\r/g, '')
    .split('\n')
    .map((line) =>
      line
        .replace(/^#{1,6}\s*/, '')
        .replace(/\*\*|__|`/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^\s*[-*]\s+/, '• ')
        .trim()
    );
  const text = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trim()}…`;
}

export function cleanPlaceTitle(rawTitle: string, maxLen = 58): string {
  const stripped = rawTitle
    .replace(/\s+(?:-|\||–|—|:)\s+(?:Tripadvisor|Lonely Planet|Booking\.com|Google|Wikipedia|Reddit|Condé Nast|Conde Nast|Expedia|Kayak|Skyscanner|Nomadic Matt|Culture Trip|Explore|Travel).*$/i, '')
    .replace(/\s*\|\s*[^|]+$/, '')
    .trim();
  return cleanWebSnippet(stripped || rawTitle, maxLen);
}

export function extractPriceHint(text: string, fallback: string): string {
  const inrMatch = text.match(/(?:₹|INR\s?)[\d,]{3,7}(?:\s*[–-]\s*(?:₹|INR\s?)?[\d,]{3,7})?/i);
  if (inrMatch) {
    return cleanWebSnippet(inrMatch[0].replace(/^INR\s?/i, '₹'), 32);
  }
  const usdEurMatch = text.match(/(?:\$|€|USD\s?|EUR\s?)[\d,]{2,5}(?:\s*[–-]\s*(?:\$|€|USD\s?|EUR\s?)?[\d,]{2,5})?(?:\s*\/\s*night)?/i);
  if (usdEurMatch) {
    return cleanWebSnippet(usdEurMatch[0], 32);
  }
  return fallback;
}

export function getSourceDomain(url?: string): string {
  if (!url) return 'Web source';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'Web source';
  }
}

export function hasConfiguredTavilyKey(): boolean {
  return Boolean(process.env.TAVILY_API_KEY?.trim());
}

export async function searchTavily(
  query: string,
  options?: { maxResults?: number; searchDepth?: 'basic' | 'advanced'; timeoutMs?: number }
): Promise<TavilySearchResponse | null> {
  const tavilyKey = process.env.TAVILY_API_KEY?.trim();
  if (!tavilyKey) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options?.timeoutMs ?? 8000);
  try {
    const resp = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        api_key: tavilyKey,
        query,
        search_depth: options?.searchDepth ?? 'basic',
        max_results: options?.maxResults ?? 5,
        include_answer: true,
      }),
    });
    if (!resp.ok) return null;
    return (await resp.json()) as TavilySearchResponse;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function tavilyResultsToSources(
  results: TavilySearchResultItem[] | undefined,
  fallbackUrl = 'https://www.google.com/travel',
  limit = 5
): ResearchSource[] {
  return (results || []).slice(0, limit).map((r) => ({
    title: cleanWebSnippet(r.title || 'Travel Source', 68),
    url: r.url || fallbackUrl,
    snippet: cleanWebSnippet(r.content || '', 160),
  }));
}

export function buildTavilyChatReply(params: {
  tavilyData: TavilySearchResponse | null;
  itinerary?: Itinerary;
  isBudgetRevision?: boolean;
  budgetChanges?: string[];
}): string {
  const { tavilyData, itinerary, isBudgetRevision, budgetChanges } = params;
  const answer = tavilyData?.answer ? cleanChatReply(tavilyData.answer, 480) : '';
  const topSnippet =
    !answer && tavilyData?.results?.[0]?.content
      ? cleanWebSnippet(tavilyData.results[0].content, 260)
      : '';
  const liveInsights = answer || topSnippet;

  const bullets: string[] = [];
  if (itinerary) {
    if (isBudgetRevision && budgetChanges && budgetChanges.length > 0) {
      bullets.push(...budgetChanges.map((c) => `• ${c}`));
    } else {
      bullets.push(
        `• Route & Pace: ${itinerary.durationDays}-day ${itinerary.destination} journey from ${itinerary.origin} for ${itinerary.travellers} travellers (${itinerary.pace} pace).`
      );
      if (itinerary.season || itinerary.travelMonth) {
        bullets.push(
          `• Seasonal Character: ${itinerary.season || 'Current Season'}${itinerary.travelMonth ? ` (${itinerary.travelMonth})` : ''} · Tailored for optimal seasonal weather and local vibrancy.`
        );
      }
      const landmarkNames = Array.from(
        new Set(
          itinerary.days
            .flatMap((d) => d.activities)
            .filter((a) => a.category !== 'transit' && !a.title.startsWith('Seasonal Dining:'))
            .map((a) => a.title.replace(/^Scenic Panorama:\s*/, ''))
        )
      ).slice(0, 5);
      if (landmarkNames.length > 0) {
        bullets.push(`• Iconic Sights Featured: ${landmarkNames.join(', ')}.`);
      }
      if (itinerary.signatureFoods && itinerary.signatureFoods.length > 0) {
        bullets.push(`• Signature Seasonal Cuisine: ${itinerary.signatureFoods.slice(0, 4).join(', ')}.`);
      }
      if (itinerary.selectedHotel) {
        bullets.push(
          `• Recommended Stay: ${itinerary.selectedHotel.name} (${itinerary.selectedHotel.area}).`
        );
      }
    }
    bullets.push(
      `• Indicative Budget: ${itinerary.currency} ${itinerary.estimatedTotal.toLocaleString()} total across flights, stays, transit, and dining.`
    );
    if (itinerary.packingAdvice && itinerary.packingAdvice.length > 0) {
      bullets.push(`• Packing & Transit Essentials: ${itinerary.packingAdvice.slice(0, 2).join('; ')}.`);
    }
  }

  const sections: string[] = [];
  if (liveInsights) {
    sections.push(liveInsights);
  } else if (itinerary) {
    sections.push(
      `I have prepared your ${itinerary.durationDays}-day ${itinerary.destination} journey from ${itinerary.origin}.`
    );
  }

  if (bullets.length > 0) {
    sections.push(bullets.join('\n'));
  }

  sections.push(
    'Live route timing, day-by-day experiences, hotel options, and direct partner booking links are ready below.'
  );

  return cleanChatReply(sections.join('\n\n'), 2800);
}
