import { useState, useEffect } from 'react';
import { AppModule } from '../types';
import { WPPost, getCategories, getPosts } from '../services/wpService';

export function useArticleList(section: AppModule) {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<WPPost | null>(null);

  useEffect(() => {
    setLoading(true);
    setSelectedPost(null);

    const fetchContent = async () => {
      try {
        const slug = section.wpCategorySlug || section.id.toLowerCase();
        const categories = await getCategories(slug);
        
        let fetchedPosts: WPPost[] = [];
        if (categories.length > 0) {
          fetchedPosts = await getPosts(categories[0].id, 1, 20);
        } else {
          fetchedPosts = await getPosts(undefined, 1, 20);
        }
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching content', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [section]);

  return { posts, loading, selectedPost, setSelectedPost };
}
