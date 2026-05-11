import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { AppModule } from '../../../types';
import { WPPost } from '../../../services/wpService';
import { LazyImage } from '../../shared/LazyImage';

export function PostDetailView({ post, section, onClose }: { post: WPPost; section: AppModule; onClose?: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full bg-white/95 backdrop-blur-md p-8 border border-gray-200 relative min-h-[500px] flex flex-col max-h-[70vh] overflow-hidden">
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 transition-colors z-10 border border-transparent hover:border-gray-200">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      )}
      <div className="overflow-y-auto pr-4 customize-scrollbar flex-1">
         <div className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mb-4">
           Record ID: {post.id} | {format(new Date(post.date), 'yyyy.MM.dd')}
         </div>
         <h2 className="text-3xl font-black tracking-widest uppercase mb-10 border-b border-gray-200 pb-6 text-gray-900" dangerouslySetInnerHTML={{ __html: section.type === 'SINGLE_PHOTO' ? section.title : post.title.rendered }} />
         
         {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
           <LazyImage 
             src={post._embedded['wp:featuredmedia'][0].source_url} 
             alt="Featured" 
             containerClassName={`w-full bg-gray-100 overflow-hidden ${section.type === 'SINGLE_PHOTO' ? 'h-auto max-h-[60vh] min-h-[30vh]' : 'h-64 mb-8 border border-gray-200'}`}
             className={`w-full h-full ${section.type === 'SINGLE_PHOTO' ? 'object-contain' : 'object-cover'}`}
           />
         )}

         {section.type !== 'SINGLE_PHOTO' && (
           <div className="prose prose-sm md:prose-base prose-gray max-w-none tracking-wide" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
         )}
      </div>
    </motion.div>
  );
}
