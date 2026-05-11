export const apiConfig = {
  baseUrl: import.meta.env.VITE_WP_API_URL || 'https://techcrunch.com/wp-json',
  
  getBaseUrl() {
    // Allows runtime override by checking localStorage or window object if needed
    const storedUrl = localStorage.getItem('WP_API_URL');
    return storedUrl || this.baseUrl;
  },

  setBaseUrl(url: string) {
    this.baseUrl = url;
    localStorage.setItem('WP_API_URL', url);
  }
};

const cache = new Map<string, { promise: Promise<any>, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export class ApiClient {
  static async fetchWithCache<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${apiConfig.getBaseUrl()}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value);
        }
      });
    }

    const urlString = url.toString();
    const now = Date.now();
    const cached = cache.get(urlString);

    if (cached && now - cached.timestamp < CACHE_TTL) {
      return cached.promise;
    }

    const promise = fetch(urlString).then(async (response) => {
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    }).catch((error) => {
      cache.delete(urlString);
      throw error;
    });

    cache.set(urlString, { promise, timestamp: now });
    return promise;
  }

  static clearCache() {
    cache.clear();
  }
}
