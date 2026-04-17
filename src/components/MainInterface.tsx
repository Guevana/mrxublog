import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, User, Briefcase, Image as ImageIcon, Mail, ArrowLeft, Terminal } from 'lucide-react';

type Section = 'ABT' | 'ART' | 'PRJ' | 'GLR' | 'CNT';

const SECTIONS = [
  { id: 'ABT', title: 'ABOUT SECTION', desc: 'PERSONAL INFORMATION & BACKGROUND', icon: User },
  { id: 'ART', title: 'ARTICLES SECTION', desc: 'TECHNICAL & CREATIVE WRITINGS', icon: FileText },
  { id: 'PRJ', title: 'PROJECTS SECTION', desc: 'DEVELOPMENT & RESEARCH INITIATIVES', icon: Briefcase },
  { id: 'GLR', title: 'GALLERY SECTION', desc: 'VISUAL ARTS & PHOTOGRAPHY', icon: ImageIcon },
  { id: 'CNT', title: 'CONTACT SECTION', desc: 'COMMUNICATION CHANNELS', icon: Mail },
];

/** 
 * Deterministic pseudo-random number generator 
 * to ensure persistent scattered positions.
 */
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

export function MainInterface() {
  const [viewState, setViewState] = useState<'HUB' | 'LOADING' | 'DETAIL'>('HUB');
  const [activeSection, setActiveSection] = useState<string>('');

  const handleSelect = (id: string) => {
    setActiveSection(id);
    setViewState('LOADING');
    setTimeout(() => {
      setViewState('DETAIL');
    }, 900); // Wait for load to complete
  };

  const handleBack = () => {
    setViewState('HUB');
    setActiveSection('');
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
            <HubView key="hub" onSelect={handleSelect} />
          )}
          {viewState === 'LOADING' && (
            <LoadingView key="loading" />
          )}
          {viewState === 'DETAIL' && (
            <div key="detail" className="w-full h-full flex flex-col pointer-events-auto px-6 md:px-16 overflow-y-auto pt-24 pb-12">
              <DetailView sectionId={activeSection} onBack={handleBack} />
            </div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </motion.div>
  );
}

function HubView({ onSelect }: { onSelect: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate stable random points in a circular pattern around the core
  const layoutNodes = useMemo(() => {
    return SECTIONS.map((section, idx) => {
      // 0 to 2*PI, distributed smoothly with slight random variation
      const baseAngle = (idx / SECTIONS.length) * Math.PI * 2;
      const angleOffset = (pseudoRandom(idx) - 0.5) * 0.8; 
      const angle = baseAngle + angleOffset;
      
      // Radius scattered between 280 and 480
      const radius = 280 + pseudoRandom(idx * 2) * 200;

      return {
        ...section,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    });
  }, []);

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

function SectionCard({ item, onSelect }: any) {
  return (
    <div
      onClick={() => onSelect(item.id)}
      className="group relative bg-white/60 backdrop-blur-md border border-gray-200 w-56 h-32 block overflow-hidden shadow-sm cursor-pointer hover:shadow-orange-500/10 hover:shadow-lg transition-shadow duration-300"
      style={{ isolation: 'isolate' }}
    >
      {/* Base Content (Default color) */}
      <div className="absolute inset-0 p-6 flex flex-col items-start bg-transparent transition-transform duration-300 ease-linear group-hover:scale-[1.03] z-10">
        <div className="absolute top-0 right-0 w-10 h-10 bg-gray-50 flex items-center justify-center border-l border-b border-gray-200">
           <item.icon className="w-4 h-4 text-gray-400" />
        </div>
        <div className="text-4xl font-black tracking-tighter mb-3 text-gray-900">
          {item.id}
        </div>
        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">
          {item.title}
        </div>
      </div>

      {/* Duplicate Inverted Content clipped by width acting as scanline */}
      {/* It grows its width from 0% to 100% masking the inner elements cleanly */}
      <div className="absolute top-0 left-0 h-full bg-orange-500 z-20 overflow-hidden w-0 transition-[width] duration-[400ms] ease-linear group-hover:w-full">
        <div className="w-56 h-32 p-6 flex flex-col items-start relative transition-transform duration-300 ease-linear group-hover:scale-[1.03]">
          <div className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center border-l border-b border-orange-400">
             <item.icon className="w-4 h-4 text-white" />
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

function DetailView({ sectionId, onBack }: { sectionId: string; onBack: () => void }) {
  const section = SECTIONS.find(s => s.id === sectionId);

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
        className="absolute -top-6 left-0 flex items-center gap-3 text-[10px] font-bold tracking-widest text-gray-500 hover:text-orange-500 transition-colors uppercase group"
      >
        <span className="w-8 h-[1px] bg-gray-400 group-hover:bg-orange-500 transition-colors"></span>
        <ArrowLeft className="w-4 h-4" /> Return to Hub
      </button>

      <div className="w-full md:w-1/3 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-8 md:pb-0 md:pr-12 relative mt-12 md:mt-0">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
          <div className="flex items-end gap-2 mb-4">
            <h2 className="text-8xl md:text-9xl font-black tracking-tighter text-gray-900 leading-none">{section?.id}</h2>
            <div className="text-xs font-bold tracking-widest text-orange-500 mb-2">INF</div>
          </div>
          
          <div className="w-16 h-1 bg-orange-500 mb-6"></div>
          <h3 className="text-sm md:text-base font-bold tracking-[0.2em] text-gray-800 uppercase mb-3">{section?.title}</h3>
          <p className="text-[11px] md:text-xs text-gray-500 max-w-xs leading-relaxed uppercase tracking-widest">{section?.desc}</p>

          <div className="mt-16 flex flex-col gap-6">
            <div className="flex flex-col gap-1 border-l-2 border-green-500 pl-3">
              <span className="text-[9px] text-gray-400 tracking-widest uppercase">System Status</span>
              <span className="text-[11px] font-bold tracking-widest text-gray-800 uppercase">Stable / Active</span>
            </div>
            <div className="flex flex-col gap-1 border-l-2 border-gray-300 pl-3">
              <span className="text-[9px] text-gray-400 tracking-widest uppercase">Clearance Level</span>
              <span className="text-[11px] font-bold tracking-widest text-gray-800 uppercase">Public Access</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="w-full md:w-2/3 flex flex-col justify-center relative">
        <DetailContent sectionId={sectionId} />
      </div>
    </motion.div>
  );
}

function DetailContent({ sectionId }: { sectionId: string }) {
  if (sectionId === 'ABT') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-col md:flex-row gap-8 items-start w-full bg-white/80 backdrop-blur-md p-6 md:p-10 border border-gray-200 relative group">
        <div className="w-full md:w-56 aspect-[3/4] bg-gray-100 flex items-center justify-center border border-gray-200 relative overflow-hidden flex-shrink-0">
           <img src="https://picsum.photos/seed/rhine/400/600?grayscale" className="object-cover w-full h-full opacity-80 mix-blend-multiply transition-transform duration-700 group-hover:scale-105" alt="Profile" />
           <div className="absolute inset-0 bg-orange-500/10 mix-blend-overlay"></div>
           
           <div className="absolute bottom-2 left-2 flex flex-col gap-1">
              <div className="w-8 h-px bg-white/80"></div>
              <div className="text-[8px] tracking-[0.2em] text-white/80 font-mono">SCANNED</div>
           </div>
           <div className="absolute top-2 right-2 w-2 h-2 border border-white/50"></div>
        </div>
        
        <div className="flex-1 flex flex-col pt-2">
          <div className="text-[10px] text-orange-500 font-bold tracking-[0.2em] uppercase mb-2">Director / Lead</div>
          <h3 className="text-3xl font-black tracking-widest uppercase mb-6 border-b border-gray-200 pb-4 text-gray-900">John Doe</h3>
          
          <div className="grid grid-cols-2 gap-6 text-xs tracking-[0.1em] uppercase text-gray-600 mb-8 border-b border-gray-100 pb-6">
            <div className="flex flex-col gap-1"><span className="text-[9px] text-gray-400">SPECIALIZATION</span><span className="font-bold text-gray-800">Advanced Interfaces</span></div>
            <div className="flex flex-col gap-1"><span className="text-[9px] text-gray-400">AFFILIATION</span><span className="font-bold text-gray-800">Personal LLC.</span></div>
            <div className="flex flex-col gap-1"><span className="text-[9px] text-gray-400">EXPERIENCE</span><span className="font-bold text-gray-800">&gt; 10 Years Data</span></div>
            <div className="flex flex-col gap-1"><span className="text-[9px] text-gray-400">STATUS</span><span className="font-bold text-green-600">Active Duty</span></div>
          </div>

          <p className="text-[13px] text-gray-600 leading-relaxed font-normal tracking-wide">
            An expert in crafting robust, highly technical web architectures and immersive frontend experiences. Proven track record of turning complex operational requirements into streamlined, user-centric interfaces.
          </p>
        </div>
      </motion.div>
    );
  }

  // Placeholder for others
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="w-full bg-white/80 backdrop-blur-md p-8 border border-gray-200 relative min-h-[400px] flex flex-col">
       <div className="absolute top-0 right-0 p-3 text-[9px] text-gray-400 tracking-widest text-right bg-gray-50 border-l border-b border-gray-200">
          DATA RETRIEVAL <br />
          {sectionId}-ARCHIVE
        </div>
       <h3 className="text-xl font-bold tracking-[0.2em] uppercase mb-8 text-gray-900 border-b border-gray-200 pb-4">
         Database Records
       </h3>
       <div className="flex flex-col gap-4 flex-1">
         {[1, 2, 3].map((i) => (
           <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (i * 0.1) }} className="flex flex-col md:flex-row gap-6 p-4 border border-gray-100 hover:border-orange-500 bg-white hover:bg-orange-50/30 transition-all group cursor-pointer relative">
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-orange-500 transition-colors"></div>
             <div className="w-16 h-16 bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 group-hover:border-orange-200 transition-colors">
               <FileText className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
             </div>
             <div className="flex flex-col justify-center">
               <div className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mb-1">
                 Record 00{i}.{sectionId} 
                 <span className="inline-block ml-4 text-orange-500 font-mono">2026.04.17</span>
               </div>
               <div className="text-sm font-bold tracking-widest uppercase text-gray-800 group-hover:text-orange-600 transition-colors">
                 Classified {sectionId} Entry Protocol
               </div>
               <p className="text-[11px] text-gray-500 mt-2 line-clamp-1 tracking-wide">
                 Detailed analysis and synthesis of information gathered during recent operational phases. Decrypting protocol...
               </p>
             </div>
           </motion.div>
         ))}
       </div>
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
