import { useEffect, useState } from 'react';
import { ArrowRightLeft, Languages } from 'lucide-react';
import type { LanguagePhrase } from '../../types/travel';

interface CurrencyLanguageToolsProps {
  homeCurrency?: string;
  destinationCurrency: string;
  languageName: string;
  phrases: LanguagePhrase[];
  estimatedTotalHome?: number;
}

const CURRENCIES = ['INR', 'USD', 'EUR', 'CHF', 'IDR', 'NPR', 'JPY', 'TRY', 'ISK', 'MAD', 'THB'];

export function CurrencyLanguageTools({
  homeCurrency = 'INR',
  destinationCurrency,
  languageName,
  phrases,
  estimatedTotalHome = 80000,
}: CurrencyLanguageToolsProps) {
  const [amount, setAmount] = useState(String(estimatedTotalHome));
  const [fromCurr, setFromCurr] = useState(homeCurrency);
  const [toCurr, setToCurr] = useState(destinationCurrency);
  const [rateResult, setRateResult] = useState<{
    converted: number;
    rate: number;
    date: string;
    note: string;
  } | null>(null);

  const [phraseInput, setPhraseInput] = useState('Where is the quietest coffee shop nearby?');
  const [translation, setTranslation] = useState<{
    translated: string;
    pronunciation: string;
    culturalNote: string;
    providerLabel?: string;
  } | null>(null);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    setToCurr(destinationCurrency);
  }, [destinationCurrency]);

  useEffect(() => {
    const val = Number(amount) || 1000;
    let active = true;
    fetch(`/api/currency?amount=${val}&from=${fromCurr}&to=${toCurr}`)
      .then((r) => r.json())
      .then((data) => {
        if (active && typeof data.converted === 'number') {
          setRateResult({
            converted: data.converted,
            rate: data.rate,
            date: data.date,
            note: data.note,
          });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [amount, fromCurr, toCurr]);

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phraseInput.trim()) return;
    setTranslating(true);
    try {
      const resp = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrase: phraseInput.trim(), targetLanguage: languageName }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setTranslation(data);
      }
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Currency Converter */}
      <div className="rounded-3xl liquid-glass p-6 space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Currency Companion</h3>
            <p className="text-xs text-slate-500">
              {fromCurr} → {toCurr} · Indicative reference rate
            </p>
          </div>
          <ArrowRightLeft className="w-4 h-4 text-blue-600" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="curr-amount" className="block text-xs font-medium text-slate-600 mb-1">
              Amount
            </label>
            <input
              id="curr-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-white/80 bg-white/75 text-sm font-sans font-semibold tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="curr-from" className="block text-xs font-medium text-slate-600 mb-1">
              From
            </label>
            <select
              id="curr-from"
              value={fromCurr}
              onChange={(e) => setFromCurr(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-white/80 text-sm bg-white/85"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="curr-to" className="block text-xs font-medium text-slate-600 mb-1">
              To
            </label>
            <select
              id="curr-to"
              value={toCurr}
              onChange={(e) => setToCurr(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-white/80 text-sm bg-white/85"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl liquid-glass-subtle p-4">
          <p className="text-xs text-slate-500">Converted Estimate</p>
          <p className="text-2xl font-bold text-slate-900 font-sans tabular-nums tracking-tight mt-1">
            {toCurr} {(rateResult?.converted ?? 0).toLocaleString()}
          </p>
          {rateResult && (
            <p className="text-xs text-slate-500 mt-1.5 tabular-nums">
              1 {fromCurr} ≈ {rateResult.rate} {toCurr} · Date: {rateResult.date} · {rateResult.note}
            </p>
          )}
        </div>
      </div>

      {/* Language Phrase Assistant */}
      <div className="rounded-3xl liquid-glass p-6 space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Local Language ({languageName})
            </h3>
            <p className="text-xs text-slate-500">
              Essential traveller phrases & AI contextual phrase translator
            </p>
          </div>
          <Languages className="w-4 h-4 text-blue-600" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {phrases.slice(0, 4).map((p) => (
            <div key={p.english} className="rounded-xl liquid-glass-subtle p-3">
              <p className="text-xs text-slate-500">
                {p.context} · {p.english}
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{p.local}</p>
              <p className="text-xs font-medium text-blue-700 mt-0.5">{p.pronunciation}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleTranslate} className="flex flex-col sm:flex-row gap-2">
          <label htmlFor="phrase-input" className="sr-only">
            Ask AI to translate a travel phrase
          </label>
          <input
            id="phrase-input"
            type="text"
            value={phraseInput}
            onChange={(e) => setPhraseInput(e.target.value)}
            placeholder={`Ask how to say anything in ${languageName}…`}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-white/80 bg-white/80 text-sm"
          />
          <button
            type="submit"
            disabled={translating}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer pressable"
          >
            {translating ? 'Translating…' : 'Translate Phrase'}
          </button>
        </form>

        {translation && (
          <div className="rounded-2xl bg-blue-50/80 border border-blue-200/70 p-3.5 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{translation.translated}</p>
              {translation.providerLabel && (
                <span className="text-[11px] font-medium text-blue-700 shrink-0">
                  {translation.providerLabel}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-blue-800">{translation.pronunciation}</p>
            <p className="text-xs text-slate-600">{translation.culturalNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
