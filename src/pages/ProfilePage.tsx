import { useEffect, useState } from 'react';
import { CheckCircle2, Save } from 'lucide-react';
import type { UserPreferences } from '../types/travel';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const INTEREST_CHOICES = ['Beaches', 'Cafes', 'Peaceful Places', 'Mountains', 'Culture', 'Wellness', 'Rail'];

export function ProfilePage() {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    fetch('/api/preferences')
      .then((r) => r.json())
      .then((d) => setPrefs(d.preferences))
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prefs) return;
    const resp = await fetch('/api/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs),
    });
    if (resp.ok) {
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    }
  };

  const toggleInterest = (tag: string) => {
    if (!prefs) return;
    const exists = prefs.interests.includes(tag);
    setPrefs({
      ...prefs,
      interests: exists ? prefs.interests.filter((i) => i !== tag) : [...prefs.interests, tag],
    });
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div>
          <p className="text-xs font-semibold tracking-wider text-blue-700">Personalization Engine</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 mt-1">
            Traveller Profile & Preferences
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Your preferences guide the AI planner’s hotel tier, pacing, currency, and neighborhood choices.
          </p>
        </div>

        {savedToast && (
          <div className="rounded-2xl bg-blue-50/90 border border-blue-200 px-4 py-3 text-xs font-semibold text-blue-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Preferences saved and active for upcoming AI trip recommendations.</span>
          </div>
        )}

        {prefs && (
          <form onSubmit={handleSave} className="rounded-3xl liquid-glass p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="pref-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Traveller Name
                </label>
                <input
                  id="pref-name"
                  type="text"
                  value={prefs.name}
                  onChange={(e) => setPrefs({ ...prefs, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/85 bg-white/80 text-sm"
                />
              </div>
              <div>
                <label htmlFor="pref-city" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Default Starting City
                </label>
                <input
                  id="pref-city"
                  type="text"
                  value={prefs.homeCity}
                  onChange={(e) => setPrefs({ ...prefs, homeCity: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/85 bg-white/80 text-sm"
                />
              </div>
              <div>
                <label htmlFor="pref-curr" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Currency
                </label>
                <select
                  id="pref-curr"
                  value={prefs.preferredCurrency}
                  onChange={(e) => setPrefs({ ...prefs, preferredCurrency: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/85 text-sm bg-white/80"
                >
                  {['INR', 'USD', 'EUR', 'CHF', 'JPY', 'THB'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="pref-style" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Travel Pace
                </label>
                <select
                  id="pref-style"
                  value={prefs.travelStyle}
                  onChange={(e) =>
                    setPrefs({ ...prefs, travelStyle: e.target.value as UserPreferences['travelStyle'] })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/85 text-sm bg-white/80"
                >
                  <option value="relaxed">Relaxed & Unhurried</option>
                  <option value="balanced">Balanced</option>
                  <option value="active">Active Discovery</option>
                </select>
              </div>
              <div>
                <label htmlFor="pref-hotel" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Hotel Style
                </label>
                <select
                  id="pref-hotel"
                  value={prefs.hotelPreference}
                  onChange={(e) =>
                    setPrefs({
                      ...prefs,
                      hotelPreference: e.target.value as UserPreferences['hotelPreference'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/85 text-sm bg-white/80"
                >
                  <option value="budget">Budget Friendly</option>
                  <option value="boutique">Boutique Sanctuary</option>
                  <option value="luxury">Luxury Resort</option>
                </select>
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-slate-700">Interests</p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_CHOICES.map((tag) => {
                  const active = prefs.interests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'bg-blue-600 text-white'
                          : 'liquid-glass-chip text-slate-700 hover:text-slate-950'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm font-medium text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.avoidCrowds}
                onChange={(e) => setPrefs({ ...prefs, avoidCrowds: e.target.checked })}
                className="rounded accent-blue-600"
              />
              <span>Prioritize quieter neighborhoods and early-morning non-crowded timings</span>
            </label>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
