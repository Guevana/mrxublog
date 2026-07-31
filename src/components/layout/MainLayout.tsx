import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User, ExternalLink } from 'lucide-react';
import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import React from 'react';

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }}
      className="fixed inset-0 bg-[#f5f5f5] text-[#111] font-sans bg-grid selection:bg-orange-500 selection:text-white"
    >
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          {outlet && React.cloneElement(outlet, { key: location.pathname })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        )}
      </AnimatePresence>

      <Footer />
    </motion.div>
  );
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="absolute top-0 left-0 w-full p-6 md:p-8 flex justify-between items-start z-20 pointer-events-none">
      <div className="flex flex-col gap-1.5">
        <div className="text-[10px] md:text-[10px] tracking-[0.2em] text-gray-600 uppercase mt-2">Synthesize Information</div>
        <div className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-gray-800 uppercase mt-1">ANALYSIS OS</div>
      </div>
      <button 
        onClick={onMenuClick}
        className="pointer-events-auto p-2 bg-white/80 backdrop-blur-md border border-gray-200 hover:bg-orange-50 hover:border-orange-200 group transition-colors shadow-sm"
      >
        <Menu className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" />
      </button>
    </header>
  );
}

function Sidebar({ onClose }: { onClose: () => void }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const aboutLinks = [
    { title: 'Github主页 / Github', url: 'https://github.com/Guevana' }
  ];

  const friendLinks = [
    { title: 'KMS的乌托邦', url: 'https://www.h2d954063.nyat.app:43086/pixel-blog/' }
  ];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 pointer-events-auto"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0, transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }}
        exit={{ x: '100%', transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: 0.1 } }}
        className="fixed top-0 right-0 h-full w-[300px] md:w-[400px] bg-orange-500 z-50 pointer-events-none shadow-2xl"
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0, transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: 0.1 } }}
        exit={{ x: '100%', transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }}
        className="fixed top-0 right-0 h-full w-[300px] md:w-[400px] bg-white border-l border-gray-200 z-50 pointer-events-auto shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-6 md:p-8 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 relative z-10">
          <div className="font-bold tracking-[0.2em] uppercase text-gray-800 text-sm">Navigation</div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 hover:text-orange-500 transition-colors border border-transparent hover:border-gray-300">
            <X className="w-5 h-5 text-gray-500 transition-colors" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8 relative z-10">
          <div className="flex flex-col gap-6">
            <h3 className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase border-b border-gray-100 pb-2">System Directives</h3>
            
            <div className="flex flex-col">
              <button onClick={() => toggleSection('about')} className="flex items-center gap-4 group p-2 -m-2 hover:bg-gray-50 transition-colors w-full text-left">
                <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center group-hover:border-orange-500 transition-colors group-hover:shadow-sm relative overflow-hidden">
                  <User className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition-colors relative z-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-widest text-gray-800 group-hover:text-orange-600 transition-colors">关于我</span>
                  <span className="text-[9px] text-gray-400 tracking-widest uppercase mt-0.5">About Me</span>
                </div>
              </button>
              <AnimatePresence>
                {expandedSection === 'about' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 pb-2 pl-12 flex flex-col gap-3 border-l-2 border-gray-200 ml-3">
                      {aboutLinks.map((link, idx) => (
                        <a key={idx} href={link.url} className="text-xs tracking-widest font-bold text-gray-500 hover:text-orange-500 transition-colors block py-0.5">
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col">
               <button onClick={() => toggleSection('friends')} className="flex items-center gap-4 group p-2 -m-2 hover:bg-gray-50 transition-colors w-full text-left">
                <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center group-hover:border-orange-500 transition-colors group-hover:shadow-sm relative overflow-hidden">
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition-colors relative z-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-widest text-gray-800 group-hover:text-orange-600 transition-colors">友情链接</span>
                  <span className="text-[9px] text-gray-400 tracking-widest uppercase mt-0.5">Friendly Links</span>
                </div>
              </button>
              <AnimatePresence>
                {expandedSection === 'friends' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 pb-2 pl-12 flex flex-col gap-3 border-l-2 border-gray-200 ml-3">
                      {friendLinks.map((link, idx) => (
                        <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs tracking-widest font-bold text-gray-500 hover:text-orange-500 transition-colors block py-0.5">
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="p-6 md:p-8 border-t border-gray-200 bg-gray-50/50 relative z-10">
          <div className="text-[9px] tracking-[0.2em] text-gray-400 uppercase text-center">
            SYSTEM VERSION: 26.04<br/>
            STATUS: ONLINE
          </div>
        </div>
      </motion.div>
    </>
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
      <a href="https://beian.miit.gov.cn/" className="text-gray-400 hover:text-orange-500 transition-colors">
        备案号:渝ICP备2024044754号-1
        </a>
      <div className="flex flex-col items-end gap-1">
        <div className="w-32 h-px bg-gray-300 mb-1"></div>
        <span className="text-gray-400">MONITORING SYSTEMS ... ONLINE</span>
      </div>
    </footer>
  );
}
