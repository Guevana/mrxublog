import { useState, useEffect } from 'react';
import { AppModule } from '../types';
import { WPPost, getCategories, getPosts } from '../services/wpService';

export function useSinglePhoto(section: AppModule) {
  const [selectedPost, setSelectedPost] = useState<WPPost | null>(null);

  useEffect(() => {
    if (section.imageUrl) {
        setSelectedPost({
            id: parseInt(section.id.replace(/\D/g, '') || '1'),
            date: new Date().toISOString(),
            slug: section.id.toLowerCase(),
            title: { rendered: section.title },
            content: { rendered: `<p>${section.desc}</p>` },
            excerpt: { rendered: section.desc },
            _embedded: {
              'wp:featuredmedia': [{ source_url: section.imageUrl }]
            }
        } as unknown as WPPost);
        return;
    }

    const fetchContent = async () => {
      try {
        const slug = section.wpCategorySlug || section.id.toLowerCase();
        const categories = await getCategories(slug);
        if (categories.length > 0) {
          const posts = await getPosts(categories[0].id, 1, 1);
          if (posts.length > 0) setSelectedPost(posts[0]);
        }
      } catch (err) {
        console.error('Error fetching photo content', err);
      }
    };
    fetchContent();
  }, [section]);

  return { selectedPost };
}
