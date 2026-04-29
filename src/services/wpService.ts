/// <reference types="vite/client" />

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WPModule {
  id: number;
  title: {
    rendered: string;
  };
  acf?: {
    module_id?: string;
    module_type?: 'ARTICLE_LIST' | 'SINGLE_PHOTO' | 'TEXT_LABEL' | 'SINGLE_ARTICLE';
    module_desc?: string;
    module_icon?: string;
    wp_category_slug?: string;
    image_url?: string | number | { url: string };
    image?: string | number | { url: string };
    module_size?: 'small' | 'medium' | 'large';
    article_id?: number | string | { ID: number };
  };
}

import { AppModule, DEFAULT_MODULES } from '../types';

// Fallback to a valid public demo URL if user hasn't provided one yet
// Note: Techcrunch won't have the custom CPT 'app_module'. 
const DEFAULT_WP_API_URL = import.meta.env.VITE_WP_API_URL || 'https://techcrunch.com/wp-json';

/**
 * Fetch categories matching a specific slug or all categories
 */
export async function getCategories(slug?: string): Promise<WPCategory[]> {
  try {
    const url = new URL(`${DEFAULT_WP_API_URL}/wp/v2/categories`);
    if (slug) {
      url.searchParams.append('slug', slug);
    }
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('API return error');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch WordPress categories', error);
    return [];
  }
}

/**
 * Fetch posts, optionally filtering by category ID and pagination
 */
export async function getPosts(categoryId?: number, page: number = 1, perPage: number = 10): Promise<WPPost[]> {
  try {
    const url = new URL(`${DEFAULT_WP_API_URL}/wp/v2/posts`);
    url.searchParams.append('_embed', '1'); // Fetch embedded resources (featured image, etc)
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', perPage.toString());
    if (categoryId) {
      url.searchParams.append('categories', categoryId.toString());
    }
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('API return error');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch WordPress posts', error);
    return [];
  }
}

/**
 * Fetch a specific post by its ID
 */
export async function getPost(postId: number): Promise<WPPost | null> {
  try {
    const url = new URL(`${DEFAULT_WP_API_URL}/wp/v2/posts/${postId}`);
    url.searchParams.append('_embed', '1');
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('API return error');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch WordPress post', error);
    return null;
  }
}

/**
 * Fetch Custom App Modules configured via ACF in WordPress.
 * Falls back to DEFAULT_MODULES if fetch fails (e.g., using TechCrunch fallback or no setup).
 */
export async function getAppModules(): Promise<AppModule[]> {
  try {
    const url = new URL(`${DEFAULT_WP_API_URL}/wp/v2/app_module`);
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('WP API /app_module returning error (maybe CPT not created)');
    }
    const raw: WPModule[] = await response.json();
    
    if (!raw || raw.length === 0) {
      console.warn('No modules returned from WP, using defaults.');
      return DEFAULT_MODULES;
    }

    const modulesContent = await Promise.all(raw.map(async m => {
      // Decode HTML entities safely or use title directly
      const parser = new DOMParser();
      const decodedTitle = parser.parseFromString(m.title.rendered, 'text/html').documentElement.textContent || m.title.rendered;

      const rawImg = m.acf?.image_url || m.acf?.image;
      let parsedImageUrl: string | undefined;
      if (typeof rawImg === 'string') {
        parsedImageUrl = rawImg;
      } else if (typeof rawImg === 'object' && rawImg !== null && 'url' in rawImg) {
        parsedImageUrl = rawImg.url as string;
      } else if (typeof rawImg === 'number') {
        try {
          const mediaUrl = new URL(`${DEFAULT_WP_API_URL}/wp/v2/media/${rawImg}`);
          const mediaRes = await fetch(mediaUrl.toString());
          if (mediaRes.ok) {
            const mediaData = await mediaRes.json();
            parsedImageUrl = mediaData.source_url;
          }
        } catch (e) {
          console.warn(`Failed to fetch media ID ${rawImg}`, e);
        }
      }

let parsedArticleId: number | undefined;
      const rawArticleId = m.acf?.article_id;
      if (typeof rawArticleId === 'number') {
        parsedArticleId = rawArticleId;
      } else if (typeof rawArticleId === 'string') {
        parsedArticleId = parseInt(rawArticleId, 10);
      } else if (typeof rawArticleId === 'object' && rawArticleId !== null && 'ID' in rawArticleId) {
        parsedArticleId = rawArticleId.ID;
      }

      return {
        id: m.acf?.module_id || `M-${m.id}`,
        type: m.acf?.module_type || 'ARTICLE_LIST',
        title: decodedTitle,
        desc: m.acf?.module_desc || '',
        iconName: m.acf?.module_icon || 'Box',
        wpCategorySlug: m.acf?.wp_category_slug || '',
        imageUrl: parsedImageUrl || undefined,
        size: m.acf?.module_size || 'small',
        articleId: parsedArticleId
      };
    }));

    return modulesContent;

  } catch (error) {
    console.warn('Failed to fetch app modules, using default fallback.', error);
    return DEFAULT_MODULES;
  }
}
