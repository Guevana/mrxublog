import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { AppModule } from '../../../types';
import { getCategories, getPosts } from '../../../services/wpService';
import { getPhotoWidthClasses } from './utils';
import { LazyImage } from '../../shared/LazyImage';

export function SinglePhotoCard({ item, onSelect }: { item: AppModule; onSelect: (item: AppModule) => void }) {
  const IconComponent = (LucideIcons as any)[item.iconName] || LucideIcons.Box;
  const [bgImage, setBgImage] = useState<string | null>(item.imageUrl || null);

  useEffect(() => {
      if (item.imageUrl) {
         setBgImage(item.imageUrl);
         return;
      }

      const fetchPhoto = async () => {
          try {
              const cats = await getCategories(item.wpCategorySlug || 'gallery');
              let catId;
              if (cats.length > 0) catId = cats[0].id;
              
              const posts = await getPosts(catId, 1, 1);
              if (posts.length > 0) {
                 const url = posts[0]._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                 if (url) setBgImage(url);
              }
          } catch (e) {console.warn('Cannot show the photo', e);}
      };
      fetchPhoto();
  }, [item.wpCategorySlug, item.imageUrl]);

  return (
    <div onClick={() => onSelect(item)} className={`group relative bg-gray-900 border border-gray-300 block overflow-hidden shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-end min-h-[160px] ${getPhotoWidthClasses(item.size)}`}>
       {bgImage ? (
         <LazyImage src={bgImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none block" containerClassName="absolute inset-0" iconClassName="w-4 h-4" />
       ) : (
         <div className="absolute inset-0 bg-gray-800" />
       )}
       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
       
       <div className="absolute inset-0 p-4 flex flex-col items-start justify-end z-10 pointer-events-none">
          <div className="flex items-center gap-2 mb-1 w-full">
             <IconComponent className={`w-3 h-3 flex-shrink-0 ${!item.color ? 'text-orange-400' : ''}`} style={item.color ? { color: item.color } : {}} />
             <div className="text-[12px] font-black tracking-widest uppercase text-white drop-shadow-md truncate">
               {item.title}
             </div>
          </div>
          <div className="text-[8px] font-bold tracking-[0.2em] uppercase text-gray-300 drop-shadow-sm line-clamp-1 w-full">
             {item.desc}
          </div>
       </div>
    </div>
  );
}
