# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on port 3000 (host 0.0.0.0)
npm run build     # Production build via Vite
npm run preview   # Preview production build
npm run lint      # Type-check with tsc --noEmit (no ESLint configured)
npm run clean     # Remove dist/
deploy.bat        # Windows script: build → SSH backup → SCP upload to VPS
```

There are no tests in this project.

## Architecture

This is a **headless WordPress front-end** SPA — React 19 + Vite 6 + TypeScript + Tailwind CSS 4. It reads content from a WordPress REST API (custom `app_module` post type + standard posts/categories) and renders an animated orbital hub with drill-down detail views.

### Routing (React Router v7)

```
/                  → MainLayout (shell with header/sidebar/footer)
  /                → HubView (index route — orbital module cards)
  /module/:id      → DetailView (content by module type)
  *                → redirect to /
```

A login gate wraps the entire router: `LoginSequence` renders until `isLoggedIn` flips to `true` (persisted in `localStorage.hasVisited`).

### Data Flow (3-layer)

1. **`ApiClient`** (`src/services/apiClient.ts`) — static `fetchWithCache<T>()` with in-memory Map cache. Concurrent requests to the same URL share one Promise. 5-minute TTL. Cache evicted on error.
2. **`wpService`** (`src/services/wpService.ts`) — typed WordPress REST functions (`getCategories`, `getPosts`, `getPost`, `getAppModules`). `getAppModules` parses ACF fields (image as URL/object/ID, article_id as number/string/object) and falls back to `DEFAULT_MODULES` on error.
3. **Custom hooks** (`src/hooks/`) — React hooks that wire WP data into components (`useAppModules`, `useArticleList`, `useModuleDetail`, `useSingleArticle`, `useSinglePhoto`).

### State Management (Zustand)

Single store in `src/store/appStore.ts`:

- `isLoggedIn` / `login()` — gate state, hydrated from `localStorage`
- `modules` / `fetchModules()` — idempotent fetch of `AppModule[]` from WP, called once globally
- No persistence middleware; component-level ephemeral state stays in hooks via `useState`/`useEffect`

### Module Type Rendering

The `AppModule.type` field (from WordPress ACF) determines which card/component renders:

| Type | Hub Card | Detail Content |
|---|---|---|
| `ARTICLE_LIST` | `DefaultActionCard` | `ArticleListDetail` → click to `PostDetailView` |
| `SINGLE_ARTICLE` | `DefaultActionCard` | `SingleArticleDetail` → `PostDetailView` |
| `SINGLE_PHOTO` | `SinglePhotoCard` | `SinglePhotoDetail` |
| `TEXT_LABEL` | `TextLabelCard` (static, no click) | — |

### Path Alias

`@/` maps to the project root (configured in both `vite.config.ts` and `tsconfig.json`). Imports look like `@/src/components/...`.

### Environment Variables

- `VITE_WP_API_URL` — WordPress REST API base URL (defaults to TechCrunch API if unset)
- `GEMINI_API_KEY` — injected at build time via `vite.config.ts` `define`
- `.env.development` and `.env.production` both point to `https://api.mrxublog.cn/wp-json`

### WordPress Backend Dependency

The app expects a WordPress instance with:
- A custom post type `app_module` (with `show_in_rest: true`)
- ACF fields on `app_module`: `module_id`, `module_type`, `module_desc`, `module_icon`, `module_size`, `wp_category_slug`, `article_id`, `image_url`/`image`
- Standard posts and categories for content
- CORS headers if WP is on a different domain
