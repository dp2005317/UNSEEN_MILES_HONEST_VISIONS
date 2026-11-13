import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTavilyChatReply,
  cleanPlaceTitle,
  extractPriceHint,
  isGeminiQuotaError,
} from './tavilyFallback';
import { buildDeterministicItinerary, extractRequirementsFromText } from '../../src/lib/travelEngine';

test('isGeminiQuotaError detects 429 and RESOURCE_EXHAUSTED errors accurately', () => {
  assert.equal(isGeminiQuotaError(new Error('429 Too Many Requests: RESOURCE_EXHAUSTED')), true);
  assert.equal(isGeminiQuotaError({ status: 429, message: 'Quota exceeded' }), true);
  assert.equal(isGeminiQuotaError(new Error('API rate limit reached')), true);
  assert.equal(isGeminiQuotaError(new Error('Network timeout')), false);
});

test('cleanPlaceTitle strips trailing publisher suffixes', () => {
  assert.equal(cleanPlaceTitle('Oia Santorini Sunset Guide - Lonely Planet'), 'Oia Santorini Sunset Guide');
  assert.equal(cleanPlaceTitle('Best Boutique Hotels in Kyoto | Tripadvisor'), 'Best Boutique Hotels in Kyoto');
});

test('extractPriceHint pulls clean INR or USD pricing snippets when available', () => {
  assert.equal(
    extractPriceHint('Round-trip economy fares from Kolkata to Tokyo start around ₹42,000 - ₹54,000.', 'skyscanner.co.in'),
    '₹42,000 - ₹54,000'
  );
  assert.equal(extractPriceHint('Quiet coastal village with cliff walks.', 'booking.com'), 'booking.com');
});

test('buildTavilyChatReply produces clean prose without markdown tokens', () => {
  const req = extractRequirementsFromText('Plan a 4 day quiet trip from Mumbai to Kyoto for 2');
  const itinerary = buildDeterministicItinerary(req);
  const reply = buildTavilyChatReply({
    tavilyData: {
      answer: '**Kyoto** is ideal in spring & autumn. Book 1-stop flights via *ANA* or Japan Airlines.',
      results: [],
    },
    itinerary,
  });

  assert.equal(/\*\*|###/.test(reply), false);
  assert.ok(reply.includes('Kyoto is ideal in spring & autumn'));
  assert.ok(reply.includes(itinerary.selectedHotel?.name || ''));
});
