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

// Fallback to a valid public demo URL if user hasn't provided one yet
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
