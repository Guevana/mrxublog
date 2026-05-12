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

To fully utilize this front-end with your own data, your WordPress backend needs specific configurations, particularly a Custom Post Type (CPT) and specific ACF (Advanced Custom Fields) definitions to drive the Hub application.

### 1. Configure the `.env` URL
Set your API location in the `.env` file (e.g. `VITE_WP_API_URL=https://your-wp-domain.com/wp-json`). This is routed through `apiClient.ts`.

### 2. Create the `app_module` Custom Post Type
You need to register a custom post type named `app_module`. Ensure that **"Show in REST API"** is enabled (set `'show_in_rest' => true` in PHP or toggle it ON in plugins like CPT UI).

### 3. Configure Custom Fields (ACF Required)
Using the [Advanced Custom Fields (ACF)](https://www.advancedcustomfields.com/) plugin, create a Field Group and assign it to the `app_module` Post Type. **Make sure "Show in REST API" is enabled for the Field Group!** The frontend expects these nested under the `acf` object in the REST response.

Add the following fields inside the ACF Field Group. **The field names must match exactly:**

*   **`module_id`** (Text, Optional): A custom string ID for the module. Falls back to generating one via WP Post ID (`M-{id}`) if empty.
*   **`module_type`** (Select): Drives the UI component used to render the card.
    *   *Choices:* `ARTICLE_LIST`, `SINGLE_PHOTO`, `TEXT_LABEL`, `SINGLE_ARTICLE` (Defaults to `ARTICLE_LIST`)
*   **`module_desc`** (Text, Optional): A short description/subtitle shown on the card.
*   **`module_icon`** (Text, Optional): [Lucide Icon](https://lucide.dev/icons/) name (e.g., `Box`, `Image`, `FileText`, `Camera`). Defaults to `Box`.
*   **`module_size`** (Select): Determines the CSS grid span/flex sizing of the card.
    *   *Choices:* `small`, `medium`, `large` (Defaults to `small`)
*   **`module_color`** or **`color`** (Text/Color Picker, Optional): Specifies a custom color theme or background color for the module card.
*   **`wp_category_slug`** (Text, Optional): Required for the `ARTICLE_LIST` module type. Finds and fetches standard WordPress posts belonging to this category slug.
*   **`article_id`** (Number/Post Object, Optional): Required for `SINGLE_ARTICLE` or `SINGLE_PHOTO` to link out to a specific standard WordPress Post ID. Setup accepts raw numbers/strings or ACF Post Objects.
*   **`image_url`** or **`image`** (Image/URL, Optional): Background/hero image for the card. The app intelligently handles:
    *   Direct URL format (String)
    *   ACF Image Object (extracts the `url` property)
    *   ACF Image ID (Number - specifically fetches the source URL via the WP Media REST API endpoint `/wp/v2/media/{id}`)

### 4. CORS Configuration
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
