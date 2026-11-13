import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white/70 backdrop-blur-2xl text-slate-700 border-t border-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200/70">
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="text-xl font-bold tracking-tight text-slate-950">
              Unseen Miles
            </Link>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Every mile planned, even the unseen ones. An intelligent travel companion connecting live web research, boutique stays, local transit, Google Maps routes, and budget clarity in one serene workspace.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/plan" className="hover:text-blue-700 transition-colors">
                  AI Trip Planner
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-blue-700 transition-colors">
                  Explore Destinations
                </Link>
              </li>
              <li>
                <Link to="/stays" className="hover:text-blue-700 transition-colors">
                  Stays & Comparison
                </Link>
              </li>
              <li>
                <Link to="/flights" className="hover:text-blue-700 transition-colors">
                  Flights & Routes
                </Link>
              </li>
              <li>
                <Link to="/transport" className="hover:text-blue-700 transition-colors">
                  Local Transportation
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Traveller Hub
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/saved" className="hover:text-blue-700 transition-colors">
                  Saved Journeys
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-700 transition-colors">
                  Travel Preferences
                </Link>
              </li>
              <li>
                <Link to="/trip/bali-december-escape" className="hover:text-blue-700 transition-colors">
                  Sample Trip Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Unseen Miles. Live web search citations and indicative benchmarks are labelled transparently.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/profile" className="hover:text-slate-800 transition-colors">
              Preferences
            </Link>
            <Link to="/saved" className="hover:text-slate-800 transition-colors">
              Saved Trips
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
