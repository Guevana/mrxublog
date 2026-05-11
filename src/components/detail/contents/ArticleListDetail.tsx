import { motion } from 'motion/react';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';
import { AppModule } from '../../../types';
import { useArticleList } from '../../../hooks/useArticleList';
import { PostDetailView } from './PostDetailView';
import { LazyImage } from '../../shared/LazyImage';

export function ArticleListDetail({ section }: { section: AppModule }) {
  const { posts, loading, selectedPost, setSelectedPost } = useArticleList(section);

  if (selectedPost) {
    return <PostDetailView post={selectedPost} section={section} onClose={() => setSelectedPost(null)} />;
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="w-full bg-white/80 backdrop-blur-md p-6 md:p-8 border border-gray-200 relative h-[60vh] flex flex-col">
       <div className="absolute top-0 right-0 p-3 text-[9px] text-gray-400 tracking-widest text-right bg-gray-50 border-l border-b border-gray-200 z-10">
          DATA RETRIEVAL <br />
          {section.id}-ARCHIVE
        </div>
       <h3 className="text-xl font-bold tracking-[0.2em] uppercase mb-6 text-gray-900 border-b border-gray-200 pb-4">
         Database Records
       </h3>
       
       <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2 customize-scrollbar relative">
         {loading ? (
             <div className="absolute inset-0 flex items-center justify-center text-[10px] tracking-widest uppercase text-gray-400 font-bold">
               Syncing with Central DB...
             </div>
         ) : posts.length === 0 ? (
             <div className="absolute inset-0 flex items-center justify-center text-[10px] tracking-widest uppercase text-gray-400 font-bold">
               No records found.
             </div>
         ) : (
           posts.map((post, i) => (
             <motion.div key={post.id} onClick={() => setSelectedPost(post)} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + (i * 0.05) }} className="flex flex-col md:flex-row gap-6 p-4 border border-gray-100 hover:border-orange-500 bg-white hover:bg-orange-50/30 transition-all group cursor-pointer relative flex-shrink-0">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-orange-500 transition-colors"></div>
               <div className="w-16 h-16 bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 group-hover:border-orange-200 transition-colors overflow-hidden">
                 {post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                    <LazyImage 
                      src={post._embedded['wp:featuredmedia'][0].source_url} 
                      className="w-full h-full object-cover opacity-80 mix-blend-multiply" 
                      containerClassName="w-full h-full"
                      iconClassName="w-4 h-4 text-gray-300"
                    />
                 ) : (
                    <FileText className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
                 )}
               </div>
               <div className="flex flex-col justify-center flex-1">
                 <div className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mb-1 flex items-center gap-4">
                   <span>Record {post.id}.{section.id}</span>
                   <span className="text-orange-500 font-mono">{format(new Date(post.date), 'yyyy.MM.dd')}</span>
                 </div>
                 <div className="text-sm font-bold tracking-widest uppercase text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-1" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                 <div className="text-[11px] text-gray-500 mt-2 line-clamp-2 tracking-wide" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
               </div>
             </motion.div>
           ))
         )}
       </div>
    </motion.div>
  );
}
