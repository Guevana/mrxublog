import { useState, useMemo, useRef, useEffect, FC } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, User, Briefcase, Image as ImageIcon, Mail, ArrowLeft, Terminal, X, Box } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getCategories, getPosts, getPost, WPPost, getAppModules } from '../services/wpService';
import { format } from 'date-fns';
import { AppModule } from '../types';

export function MainInterface() {
  const [viewState, setViewState] = useState<'HUB' | 'LOADING' | 'DETAIL'>('HUB');
  const [activeSection, setActiveSection] = useState<AppModule | null>(null);
  const [modules, setModules] = useState<AppModule[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);

  useEffect(() => {
    const fetchMods = async () => {
      setLoadingModules(true);
      const mods = await getAppModules();
      setModules(mods);
      setLoadingModules(false);
    };
    fetchMods();
  }, []);

  const handleSelect = (module: AppModule) => {
    if (module.type === 'TEXT_LABEL') return;
    setActiveSection(module);
    setViewState('LOADING');
    setTimeout(() => {
      setViewState('DETAIL');
    }, 900); // Wait for load to complete
  };

  const handleBack = () => {
    setViewState('HUB');
    setActiveSection(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }}
      className="fixed inset-0 bg-[#f5f5f5] text-[#111] font-sans bg-grid selection:bg-orange-500 selection:text-white"
    >
      {/* Background abstract lines */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[100vw] max-h-[800px] bg-gray-200 -z-10 rotate-45 hidden md:block pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[100vw] max-h-[800px] bg-gray-200 -z-10 -rotate-45 hidden md:block pointer-events-none"></div>

      <Header />
      
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          {viewState === 'HUB' && (
            loadingModules ? <LoadingView key="loading_mods" /> : <HubView key="hub" modules={modules} onSelect={handleSelect} />
          )}
          {viewState === 'LOADING' && (
            <LoadingView key="loading" />
          )}
          {viewState === 'DETAIL' && activeSection && (
            <div key="detail" className="w-full h-full flex flex-col pointer-events-auto px-6 md:px-16 overflow-y-auto pt-24 pb-12">
              <DetailView section={activeSection} onBack={handleBack} />
            </div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </motion.div>
  );
}

/** 
 * Deterministic pseudo-random number generator 
 * to ensure persistent scattered positions.
 */
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

interface HubViewProps {
  modules: AppModule[];
  onSelect: (module: AppModule) => void;
}

const HubView: FC<HubViewProps> = ({ modules, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate stable random points in a circular pattern around the core
  const layoutNodes = useMemo(() => {
    return modules.map((module, idx) => {
      // 0 to 2*PI, distributed smoothly with slight random variation
      const baseAngle = (idx / modules.length) * Math.PI * 2;
      const angleOffset = (pseudoRandom(idx) - 0.5) * 0.8; 
      const angle = baseAngle + angleOffset;
      
      // Radius scattered between 280 and 480
      const radius = 280 + pseudoRandom(idx * 2) * 200;

      return {
        ...module,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    });
  }, [modules]);

  return (
    <motion.div 
      key="hub"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full relative cursor-grab active:cursor-grabbing outline-none pointer-events-auto overflow-hidden block"
      ref={containerRef}
    >
      <motion.div 
        drag 
        dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
        dragElastic={0.1}
        className="w-[4000px] h-[4000px] absolute top-1/2 left-1/2 outline-none"
        style={{ marginLeft: "-2000px", marginTop: "-2000px", touchAction: 'none' }} // Replaces flex-center and initial x/y
      >
        {/* Draw subtle connection lines to center */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          <g transform="translate(2000, 2000)"> {/* Centered in the 4000x4000 canvas */}
            {layoutNodes.map(node => (
              <line 
                key={`line-${node.id}`} 
                x1="0" y1="0" 
                x2={node.x} 
                y2={node.y} 
                stroke="#ccc" 
                strokeDasharray="4 4"
                strokeWidth={1}
                opacity={0.6}
              />
            ))}
          </g>
        </svg>

        {/* CORE node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm border border-gray-300 shadow-sm z-10 w-64 h-64 pointer-events-auto">
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-orange-500"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-orange-500"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-gray-400"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-gray-400"></div>
          <Terminal className="w-12 h-12 mb-6 text-gray-800" />
          <h1 className="text-2xl font-black tracking-[0.2em] mb-2 text-[#111]">CORE</h1>
          <p className="text-[9px] tracking-[0.3em] text-gray-500 uppercase text-center">
            COMPONENT CONTROL <br/> SECTION
          </p>
        </div>

        {/* Scattered Nodes */}
        {layoutNodes.map((node, i) => (
          <motion.div 
            key={node.id}
            className="absolute top-1/2 left-1/2 z-20 pointer-events-auto"
            initial={{ x: "-50%", y: "-50%", opacity: 0 }}
            animate={{ x: `calc(-50% + ${node.x}px)`, y: `calc(-50% + ${node.y}px)`, opacity: 1 }}
            transition={{ delay: 0.05 * i, type: 'spring', stiffness: 60 }}
          >
            <SectionCard item={node} onSelect={onSelect} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// --- Hub View Components ---
function SectionCard({ item, onSelect }: { item: AppModule; onSelect: (item: AppModule) => void }) {
  if (item.type === 'TEXT_LABEL') return <TextLabelCard item={item} />;
  if (item.type === 'SINGLE_PHOTO') return <SinglePhotoCard item={item} onSelect={onSelect} />;
  return <DefaultActionCard item={item} onSelect={onSelect} />;
}

const getSizeClasses = (size?: string) => {
  switch (size) {
    case 'medium': return 'w-72 h-40';
    case 'large': return 'w-96 h-56';
    case 'small':
    default: return 'w-56 h-32';
  }
};

const textLabelSizeClasses = (size?: string) => {
  switch (size) {
    case 'medium': return 'w-72 p-8';
    case 'large': return 'w-96 p-10';
    case 'small':
    default: return 'w-56 p-6';
  }
};

const getPhotoWidthClasses = (size?: string) => {
  switch (size) {
    case 'medium': return 'w-72';
    case 'large': return 'w-96';
    case 'small':
    default: return 'w-56';
  }
};

function TextLabelCard({ item }: { item: AppModule }) {
  const IconComponent = (LucideIcons as any)[item.iconName] || LucideIcons.Box;
  return (
    <div className={`bg-white/60 backdrop-blur-md border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center group cursor-default ${textLabelSizeClasses(item.size)}`}>
       <IconComponent className="w-5 h-5 text-gray-400 mb-3" />
       <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-2 border-b border-gray-200 pb-2 w-full break-all">
          {item.title}
       </div>
       <div className="text-[9px] tracking-widest leading-relaxed text-gray-600 uppercase break-all">
          {item.desc}
       </div>
    </div>
  );
}

function SinglePhotoCard({ item, onSelect }: { item: AppModule; onSelect: (item: AppModule) => void }) {
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
    <div onClick={() => onSelect(item)} className={`group relative bg-gray-900 border border-gray-300 block overflow-hidden shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-end ${getPhotoWidthClasses(item.size)}`}>
       {bgImage ? (
         <img src={bgImage} className="w-full h-auto object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none block" alt="" />
       ) : (
         <div className="w-full aspect-[4/3] bg-gray-800" />
       )}
       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
       
       <div className="absolute inset-0 p-4 flex flex-col items-start justify-end z-10 pointer-events-none">
          <div className="flex items-center gap-2 mb-1 w-full">
             <IconComponent className="w-3 h-3 text-orange-400 flex-shrink-0" />
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

function DefaultActionCard({ item, onSelect }: { item: AppModule; onSelect: (item: AppModule) => void }) {
  const IconComponent = (LucideIcons as any)[item.iconName] || LucideIcons.Box;
  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative bg-white/60 backdrop-blur-md border border-gray-200 block overflow-hidden shadow-sm cursor-pointer hover:shadow-orange-500/10 hover:shadow-lg transition-shadow duration-300 ${getSizeClasses(item.size)}`}
      style={{ isolation: 'isolate' }}
    >
      {/* Base Content (Default color) */}
      <div className="absolute inset-0 p-6 flex flex-col items-start bg-transparent transition-transform duration-300 ease-linear group-hover:scale-[1.03] z-10">
        <div className="absolute top-0 right-0 w-10 h-10 bg-gray-50 flex items-center justify-center border-l border-b border-gray-200">
           <IconComponent className="w-4 h-4 text-gray-400" />
        </div>
        <div className="text-4xl font-black tracking-tighter mb-3 text-gray-900">
          {item.id}
        </div>
        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">
          {item.title}
        </div>
      </div>

      {/* Duplicate Inverted Content clipped by width acting as scanline */}
      <div className="absolute top-0 left-0 h-full bg-orange-500 z-20 overflow-hidden w-0 transition-[width] duration-[400ms] ease-linear group-hover:w-full">
        <div className={`p-6 flex flex-col items-start relative transition-transform duration-300 ease-linear group-hover:scale-[1.03] ${getSizeClasses(item.size)}`}>
          <div className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center border-l border-b border-orange-400">
             <IconComponent className="w-4 h-4 text-white" />
          </div>
          <div className="text-4xl font-black tracking-tighter mb-3 text-white">
            {item.id}
          </div>
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-orange-100">
            {item.title}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center pointer-events-none"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="text-xs md:text-sm tracking-[0.4em] font-bold text-gray-800 uppercase">
          Synthesizing Data
        </div>
        <div className="w-64 h-[2px] bg-gray-300 overflow-hidden relative">
          <motion.div 
            className="h-full bg-orange-500 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: "circInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function DetailView({ section, onBack }: { section: AppModule; onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-12 relative py-8 min-h-[60vh] items-center"
    >
      <button 
        onClick={onBack} 
        className="absolute -top-6 left-0 flex items-center gap-3 text-[10px] font-bold tracking-widest text-gray-500 hover:text-orange-500 transition-colors uppercase group z-10"
      >
        <span className="w-8 h-[1px] bg-gray-400 group-hover:bg-orange-500 transition-colors"></span>
        <ArrowLeft className="w-4 h-4" /> Return to Hub
      </button>

      <div className="w-full md:w-1/3 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-8 md:pb-0 md:pr-12 relative mt-12 md:mt-0">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
          <div className="flex items-end gap-2 mb-4">
            <h2 className="text-8xl md:text-9xl font-black tracking-tighter text-gray-900 leading-none break-all line-clamp-1">{section.id}</h2>
            <div className="text-xs font-bold tracking-widest text-orange-500 mb-2">INF</div>
          </div>
          
          <div className="w-16 h-1 bg-orange-500 mb-6"></div>
          <h3 className="text-sm md:text-base font-bold tracking-[0.2em] text-gray-800 uppercase mb-3 break-all">{section.title}</h3>
          <p className="text-[11px] md:text-xs text-gray-500 max-w-xs leading-relaxed uppercase tracking-widest break-all">{section.desc}</p>

          <div className="mt-16 flex flex-col gap-6">
            <div className="flex flex-col gap-1 border-l-2 border-green-500 pl-3">
              <span className="text-[9px] text-gray-400 tracking-widest uppercase">System Status</span>
              <span className="text-[11px] font-bold tracking-widest text-gray-800 uppercase">Stable / Active</span>
            </div>
            <div className="flex flex-col gap-1 border-l-2 border-orange-400 pl-3">
              <span className="text-[9px] text-gray-400 tracking-widest uppercase">Module Type</span>
              <span className="text-[11px] font-bold tracking-widest text-gray-800 uppercase">{section.type.replace('_', ' ')}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="w-full md:w-2/3 flex flex-col justify-center relative">
        <DetailContent section={section} />
      </div>
    </motion.div>
  );
}

// --- Detail View Components ---
function DetailContent({ section }: { section: AppModule }) {
  if (section.type === 'SINGLE_PHOTO') return <SinglePhotoDetail section={section} />;
  if (section.type === 'SINGLE_ARTICLE') return <SingleArticleDetail section={section} />;
  return <ArticleListDetail section={section} />;
}

// Single Photo
function SinglePhotoDetail({ section }: { section: AppModule }) {
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

  if (!selectedPost) return <LoadingDetailView title="Retrieving Image..." />;

  return <PostDetailView post={selectedPost} section={section} />;
}

// Single Article
function SingleArticleDetail({ section }: { section: AppModule }) {
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

  if (loading) return <LoadingDetailView title="Syncing with DB..." />;
  if (!selectedPost) return <EmptyDetailView title="No matching record." />;

  return <PostDetailView post={selectedPost} section={section} />;
}

// Article List
function ArticleListDetail({ section }: { section: AppModule }) {
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
                    <img src={post._embedded['wp:featuredmedia'][0].source_url} className="w-full h-full object-cover opacity-80 mix-blend-multiply" alt=""/>
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

// Shared Post Detail Component
function PostDetailView({ post, section, onClose }: { post: WPPost; section: AppModule; onClose?: () => void }) {
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
           <div className={`w-full bg-gray-100 overflow-hidden ${section.type === 'SINGLE_PHOTO' ? 'h-auto max-h-[60vh]' : 'h-64 mb-8 border border-gray-200'}`}>
             <img src={post._embedded['wp:featuredmedia'][0].source_url} alt="Featured" className={`w-full h-full ${section.type === 'SINGLE_PHOTO' ? 'object-contain' : 'object-cover'}`} />
           </div>
         )}

         {section.type !== 'SINGLE_PHOTO' && (
           <div className="prose prose-sm md:prose-base prose-gray max-w-none tracking-wide" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
         )}
      </div>
    </motion.div>
  );
}

// Shared simple states
function LoadingDetailView({ title }: { title: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full bg-white/80 backdrop-blur-md p-6 h-[60vh] flex items-center justify-center border border-gray-200 text-[10px] tracking-widest uppercase text-gray-400 font-bold">
       {title}
    </motion.div>
  );
}

function EmptyDetailView({ title }: { title: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full bg-white/80 backdrop-blur-md p-6 h-[60vh] flex items-center justify-center border border-gray-200 text-[10px] tracking-widest uppercase text-gray-400 font-bold">
       {title}
    </motion.div>
  );
}

function Header() {
  return (
    <header className="absolute top-0 left-0 w-full p-6 md:p-8 flex justify-between items-start z-20 pointer-events-none">
      <div className="flex flex-col gap-1.5">
        <div className="text-[10px] md:text-[10px] tracking-[0.2em] text-gray-600 uppercase mt-2">Synthesize Information</div>
        <div className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-gray-800 uppercase mt-1">ANALYSIS OS</div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-end gap-4 z-20 pointer-events-none text-[9px] tracking-[0.2em] text-gray-500 uppercase">
      <div className="flex flex-wrap gap-4 items-center">
        <span className="text-gray-800 font-bold">VERSION. 26.04</span>
        <span className="hidden md:inline">|</span>
        <span className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
           Secure Connection Active
        </span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="w-32 h-px bg-gray-300 mb-1"></div>
        <span className="text-gray-400">MONITORING SYSTEMS ... ONLINE</span>
      </div>
    </footer>
  );
}
