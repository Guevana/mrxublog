import { useState, useEffect } from 'react';
import { AppModule } from '../types';
import { WPPost, getPost } from '../services/wpService';

export function useSingleArticle(section: AppModule) {
  const [selectedPost, setSelectedPost] = useState<WPPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (section.articleId) {
       const fetchSingleArticle = async () => {
         try {
           const post = await getPost(section.articleId!);
           if (post) setSelectedPost(post);
         } catch (err) {
           console.error('Error fetching article', err);
         } finally {
           setLoading(false);
         }
       };
       fetchSingleArticle();
    } else {
       setLoading(false); // No ID specified
    }
  }, [section]);

  return { selectedPost, loading };
}
