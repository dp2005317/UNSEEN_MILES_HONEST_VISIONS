import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  transparentOverHero?: boolean;
}

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Destinations' },
  { to: '/plan', label: 'AI Planner' },
  { to: '/stays', label: 'Stays' },
  { to: '/flights', label: 'Flights' },
];

export function Navbar({ transparentOverHero = false }: NavbarProps) {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isOverlay = transparentOverHero && !scrolled && !mobileOpen;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
        isOverlay
          ? 'bg-white/10 backdrop-blur-md text-white border-b border-white/15'
          : 'bg-white/75 backdrop-blur-2xl text-slate-900 border-b border-white/85 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight whitespace-nowrap shrink-0 focus-visible:rounded"
        >
          Unseen Miles
        </Link>

        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const active =
              link.to === '/' ? pathname === '/' : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors relative py-1 ${
                  isOverlay
                    ? active
                      ? 'text-white'
                      : 'text-white/85 hover:text-white'
                    : active
                    ? 'text-blue-700'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {link.label}
                {active && (
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full ${
                      isOverlay ? 'bg-white' : 'bg-blue-600'
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/plan"
            className={`hidden sm:inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 ${
              isOverlay
                ? 'bg-white/95 text-slate-950 hover:bg-white shadow-sm'
                : 'bg-slate-950 text-white hover:bg-slate-800 shadow-xs'
            }`}
          >
            <span>Plan My Journey</span>
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white inline-flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`md:hidden w-11 h-11 rounded-full inline-flex items-center justify-center transition-colors ${
              isOverlay
                ? 'text-white hover:bg-white/15'
                : 'text-slate-800 hover:bg-white/60'
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white/92 backdrop-blur-2xl text-slate-900 border-b border-white/80 px-4 py-4 space-y-1 shadow-lg">
          {[
            ...NAV_LINKS,
            { to: '/transport', label: 'Transport' },
            { to: '/saved', label: 'Saved Trips' },
            { to: '/profile', label: 'Preferences' },
          ].map((item) => {
            const active =
              item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-3 py-2.5 rounded-xl text-sm font-medium ${
                  active
                    ? 'bg-blue-50/90 text-blue-700'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              to="/plan"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-slate-950 text-white text-sm font-semibold"
            >
              <span>Plan My Journey</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
