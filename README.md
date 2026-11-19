# 🌍 Unseen Miles — Honest Visions

> *Every mile planned, even the unseen ones.*  
> An intelligent AI travel companion engineered for mindful destination discovery, bespoke multi-day itineraries, verified stays, live route mapping, and budget-optimized journeys.

[![Vercel Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat&logo=vercel)](https://unseen-miles.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-UNSEEN__MILES__HONEST__VISIONS-blue?style=flat&logo=github)](https://github.com/dp2005317/UNSEEN_MILES_HONEST_VISIONS)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=flat&logo=google)](https://ai.google.dev/)
[![Tavily Search](https://img.shields.io/badge/Search-Tavily_AI-059669?style=flat)](https://tavily.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

---

## ✨ Features

- 🌐 **Worldwide Destination Coverage**: Plan trips to **any location on Earth** — from curated global hubs (London, Paris, Tokyo, New York, Bali, Amalfi, Santorini, Kyoto) to any custom city, town, or region with automatic coordinate geocoding, realistic boutique stays, airports, and transit routes.
- 🧠 **Conversational AI Travel Agent**: Powered by Google Gemini (`@google/genai`) to answer travel inquiries, tailor multi-day schedules, and provide local etiquette tips.
- 🔍 **Live Travel Web Research**: Integrates with Tavily Search API for up-to-date neighborhood scouting, quiet cafe discovery, and live route verification.
- 🗺️ **Interactive Google Maps**: Visualizes day-by-day stops and waypoints with interactive markers, coordinate geolocation, and direct Google Maps navigation links.
- 📅 **Deterministic & Adaptive Itinerary Engine**: Automatically calculates day-by-day itineraries based on travel style, duration, group size, and budget with automated budget re-allocation.
- 💱 **Live Currency & Weather**: Real-time mid-market currency conversion via Frankfurter API and live 5-day weather forecasts via Open-Meteo.
- 🏨 **Curated Stays & Routes**: Boutique and peaceful hotel recommendations filtered by crowd levels, transit benchmarks, and booking record organization.
- 🔒 **Enterprise-Grade Security**: Sensitive AI and search keys remain strictly on the backend; zero credentials exposed in client-side bundles.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Motion, React Router DOM
- **Backend**: Node.js, Express, Vercel Serverless Functions (`/api`), Zod Schema Validation
- **AI & Integrations**:
  - Google Gemini API (`@google/genai`)
  - Tavily Search API
  - Google Maps JavaScript API (`@vis.gl/react-google-maps`)
  - Open-Meteo Weather API
  - Frankfurter Currency API

---

## 📁 Project Architecture

```
unseen-miles/
├── api/                    # Vercel serverless function entrypoint
│   └── index.ts            # Mounts Express app as Vercel handler
├── server/
│   ├── ai/
│   │   ├── agent.ts        # Gemini travel reasoning & planning agent
│   │   ├── gemini.ts       # Gemini client singleton & model configuration
│   │   ├── tavilyFallback.ts # Tavily live web research & fallback
│   │   └── tavilyFallback.test.ts # Automated test suite
│   ├── app.ts              # Express API definitions & middleware
│   └── store.ts            # Resilient JSON & in-memory persistence store
├── src/
│   ├── components/         # Modular UI (Maps, Search, Budget, Nav, etc.)
│   ├── data/               # Catalog data (Destinations, Hotels, Flights)
│   ├── lib/                # Travel engine, worldwide geo-synthesizer & itinerary planner
│   │   ├── travelEngine.ts # Deterministic travel calculations & budget optimizer
│   │   └── worldwideDestinations.ts # Worldwide city database & dynamic destination synthesizer
│   ├── pages/              # Main view routes (Explore, Planner, Stays, Dashboard)
│   └── types/              # TypeScript definitions & Zod schemas
├── public/                 # Static assets & photography
├── vercel.json             # Vercel deployment routing & framework config
└── server.ts               # Local development & production standalone server
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm or bun

### 1. Clone the repository

```bash
git clone https://github.com/dp2005317/UNSEEN_MILES_HONEST_VISIONS.git
cd UNSEEN_MILES_HONEST_VISIONS
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your API keys inside `.env`:

```env
# Gemini API Key (Required for AI Travel Agent)
GEMINI_API_KEY="your-gemini-api-key"

# Tavily API Key (Recommended for live web search)
TAVILY_API_KEY="your-tavily-api-key"

# Google Maps API Key (For interactive map pins)
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 4. Run the development server

```bash
npm run dev
```

Visit `http://localhost:3000` to start planning your journeys!

### 5. Build & Typecheck

```bash
npm run lint      # TypeScript strict type checking
npm run build     # Production Vite build
```

---

## ☁️ Deployment

### Deploy to Vercel

The project includes pre-configured `vercel.json` and `api/index.ts` serverless routes:

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Ensure the following environment variables are added to your Vercel Project Settings:
- `GEMINI_API_KEY`
- `TAVILY_API_KEY`
- `GOOGLE_MAPS_API_KEY`
- `VITE_GOOGLE_MAPS_API_KEY`

---

## 🛡️ Security & Privacy

- **Server-Side API Secret Isolation**: `GEMINI_API_KEY` and `TAVILY_API_KEY` are only ever accessed in backend serverless code. They are never bundled into client JavaScript.
- **Git Shield**: `.gitignore` strictly protects `.env`, `.env.*`, internal caches (`.aistudio`, `.gmp_cache`), and credentials from ever being committed.
- **Client Route Guarding**: The backend normalizes and sanitizes all incoming search and booking inputs.

---

## 📄 License

MIT © [Unseen Miles](https://github.com/dp2005317/UNSEEN_MILES_HONEST_VISIONS)
