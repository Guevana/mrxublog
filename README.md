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

## 🔌 WordPress Backend Configuration Guide

To fully utilize this front-end with your own data, your WordPress backend needs specific configurations, particularly a Custom Post Type (CPT) and some custom fields.

### 1. Create the `app_module` Custom Post Type
You need to register a custom post type named `app_module`. Ensure that **"Show in REST API"** is enabled (set `'show_in_rest' => true` in PHP or toggle it ON in plugins like CPT UI).

### 2. Configure Custom Fields (ACF Recommended)
Using a plugin like [Advanced Custom Fields (ACF)](https://www.advancedcustomfields.com/) or similar, add the following fields to the `app_module` post type. **Make sure these fields are also exposed in the REST API.**

*   `app_module_type` (Select): `SINGLE_PHOTO`, `SINGLE_ARTICLE`, `ARTICLE_LIST`
*   `app_module_size` (Select): `small`, `medium`, `large`, `wide`, `tall`, `hero`
*   `app_module_x` (Number): X-coordinate for the Hub layout (e.g., `-200`, `150`)
*   `app_module_y` (Number): Y-coordinate for the Hub layout.
*   `app_module_icon` (Text): Lucide Icon name (e.g., `Image`, `FileText`, `Camera`).
*   `app_module_image` (Image/URL): The background/hero image. Can also use the native WP Featured Media.
*   `wp_category_slug` (Text): Required for `ARTICLE_LIST` type to fetch related posts.
*   `wp_post_id` (Number): Required for `SINGLE_ARTICLE` or `SINGLE_PHOTO` type to link out to a specific WP Post.

### 3. CORS Configuration
If your WordPress is hosted on a different domain than this React app, ensure your WordPress allows Cross-Origin Resource Sharing (CORS). You can add this to your theme's `functions.php`:

```php
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        return $value;
    });
}, 15);
```
*(Note: For production, replace `*` with your actual frontend domain URL for better security).*

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
