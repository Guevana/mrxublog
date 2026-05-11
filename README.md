# Headless WP React Hub App

A modern, high-performance web application serving as a highly interactive front-end for a Headless WordPress backend. It features a dynamic multi-node layout (Hub), animated transitions, and custom renderers for different content types (Single Photo, Single Article, Article List). 

## 🚀 Key Features

*   **Dynamic Data Modules:** Native integration with Headless WordPress resolving a custom `app_module` post type and standard `posts`/`categories`.
*   **Advanced State Management:** Global state powered by **Zustand**, driving application lifecycle and module pre-fetching.
*   **Smart Data Fetching:** Built-in API Client featuring request deduplication and TTL memory caching to drastically reduce backend load.
*   **Progressive UI:** Custom `LazyImage` rendering with skeleton loading states, fallback icons, and smooth reveal animations.
*   **Immersive Interactions:** Powered by `motion/react`, featuring complex spring-physics node layouts, seamless route transitions, and hover-triggered micro-interactions.
*   **Brutalism-Inspired Design:** Clean, typographic-driven user interface with distinct geometric boundaries and high-contrast elements.

## 🛠 Tech Stack

*   **Framework:** React 18+ (Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + Lucide React (Icons)
*   **Animations:** Motion (`motion/react`)
*   **State Management:** Zustand
*   **Routing:** React Router v6
*   **Backend:** WordPress REST API

## 📂 Architecture Overview

The application follows a modular, scalable directory structure:

```text
src/
├── components/
│   ├── detail/          # Detail view containers & specific renderers
│   ├── hub/             # Main dashboard (Hub) and nested cards
│   ├── layout/          # Global layout wrappers
│   └── shared/          # Reusable components (e.g. , LazyImage, LoadingViews)
├── hooks/               # Custom React hooks (useAppModules, useSinglePhoto, etc.)
├── services/            # API integration & business logic
│   ├── apiClient.ts     # Request deduplication and caching engine
│   └── wpService.ts     # Specific WordPress REST API endpoints
├── store/               # Global state
│   └── appStore.ts      # Zustand global store configuration
├── types.ts             # Shared TypeScript interfaces for WP schema
├── main.tsx             # Application entry point
└── App.tsx              # Root component & Route definitions
```

## 🧠 Data Flow & Caching

With the introduction of the isolated `ApiClient` layer:
1. Components utilize custom domain hooks (`useAppModules`, `useArticleList`).
2. Domain hooks defer to `appStore` (Zustand) for global persistent state, or call `wpService` directly for ephemeral data.
3. `wpService` routes all requests through `ApiClient.fetchWithCache()`.
4. `ApiClient` maintains a fast in-memory map. Redundant requests firing simultaneously share the same Promise. Resolved data stays warm for a 5-minute TTL.

## ⚙️ Environment Configuration

Ensure your environment defines the target WordPress instance. Rename or create a `.env` file at the root.

```env
# URL to your WordPress REST API endpoint
VITE_WP_API_URL=https://your-wp-domain.com/wp-json
```
*(Defaults to the TechCrunch public API for demonstration purposes if omitted, though custom post types will fall back to mocked local data).*

## 🏃 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📝 Design Philosophy

Every UI element is built without reliance on native browser defaults. Spacing, typography (Inter/JetBrains Mono), and visual hierarchies are strictly controlled through Tailwind utility classes to ensure a unified "Tech/Editorial Dashboard" vibe.
