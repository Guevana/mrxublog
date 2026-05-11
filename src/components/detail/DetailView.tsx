import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppModule } from '../../types';
import { LoadingView, EmptyDetailView } from '../shared/LoadingViews';
import { useModuleDetail } from '../../hooks/useModuleDetail';
import { DetailContent } from './DetailContent';

export function DetailViewContainer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { section, loading } = useModuleDetail(id);

  if (loading) return <LoadingView />;
  if (!section) return <div className="pointer-events-auto p-8"><EmptyDetailView title="Module not found." /></div>;

  return (
    <div className="w-full h-full flex flex-col pointer-events-auto px-6 md:px-16 overflow-y-auto pt-24 pb-12 z-10">
      <DetailView section={section} onBack={() => navigate('/')} />
    </div>
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
