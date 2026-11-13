import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDeterministicItinerary,
  calculateBudgetBreakdown,
  convertCurrency,
  extractRequirementsFromText,
  optimizeItineraryForBudget,
  rankHotels,
} from './travelEngine';
import { HOTELS } from '../data/catalog';

test('extractRequirementsFromText parses natural language trip prompt accurately', () => {
  const req = extractRequirementsFromText(
    'I want to travel from Kolkata to Bali for 5 days in December. My total budget is ₹80,000 for two people. I love beaches, cafés and peaceful places.'
  );

  assert.equal(req.origin, 'Kolkata');
  assert.equal(req.destination, 'Bali');
  assert.equal(req.durationDays, 5);
  assert.equal(req.travellers, 2);
  assert.equal(req.budget, 80000);
  assert.equal(req.currency, 'INR');
  assert.equal(req.travelMonth, 'December');
  assert.ok(req.interests.includes('Beaches'));
  assert.ok(req.interests.includes('Cafes'));
  assert.equal(req.avoidCrowds, true);
});

test('calculateBudgetBreakdown sums exactly to total budget across 8 categories', () => {
  const breakdown = calculateBudgetBreakdown(80000, 24000, 30000);
  const sum = Object.values(breakdown).reduce((acc, n) => acc + n, 0);
  assert.equal(sum, 80000);
  assert.ok(breakdown.emergencyReserve >= 0);
  assert.ok(breakdown.flights > 0);
  assert.ok(breakdown.hotels > 0);
});

test('rankHotels prioritizes budget-compatible quiet stays with explanation', () => {
  const ranked = rankHotels(HOTELS, {
    destinationId: 'bali',
    maxNightlyInr: 7000,
    preferredTier: 'boutique',
    avoidCrowds: true,
  });

  assert.ok(ranked.length >= 2);
  assert.equal(ranked[0].id, 'ht-bali-ubud-sanctuary');
  assert.ok(ranked[0].recommendationReason?.includes('Recommended'));
});

test('buildDeterministicItinerary produces valid day-by-day schema', () => {
  const req = extractRequirementsFromText('From Kolkata to Bali for 5 days, budget 80000 INR, 2 travellers');
  const itinerary = buildDeterministicItinerary(req, 'test-trip-1');

  assert.equal(itinerary.id, 'test-trip-1');
  assert.equal(itinerary.days.length, 5);
  assert.equal(itinerary.destination, 'Bali');
  assert.ok(itinerary.estimatedTotal > 0);
});

test('optimizeItineraryForBudget adjusts stay and recalculates breakdown when budget drops', () => {
  const req = extractRequirementsFromText('From Kolkata to Bali for 5 days, budget ₹80,000 for 2 people');
  const original = buildDeterministicItinerary(req, 'test-trip-opt');
  const { updated, changes } = optimizeItineraryForBudget(original, 55000);

  assert.equal(updated.targetBudget, 55000);
  assert.equal(updated.estimatedTotal, 55000);
  assert.ok(changes.length > 0);
  assert.ok((updated.selectedHotel?.pricePerNightInr || 0) <= (original.selectedHotel?.pricePerNightInr || 99999));
});

test('convertCurrency converts INR to IDR and USD consistently', () => {
  const usd = convertCurrency(10000, 'INR', 'USD');
  const idr = convertCurrency(1000, 'INR', 'IDR');
  assert.ok(usd > 100 && usd < 150);
  assert.equal(idr, 187500);
});
