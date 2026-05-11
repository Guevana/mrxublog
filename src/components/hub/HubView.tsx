import { useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppModule } from '../../types';
import { LoadingView } from '../shared/LoadingViews';
import { SectionCard } from './cards/SectionCard';
import { useAppModules } from '../../hooks/useAppModules';

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

export function HubViewContainer() {
  const { modules, loading } = useAppModules();

  if (loading) return <LoadingView />;
  return <HubView modules={modules} />;
}

function HubView({ modules }: { modules: AppModule[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const layoutNodes = useMemo(() => {
    let currentRing = 0;
    let itemsInRing = 5;
    let itemsPlaced = 0;

    return modules.map((module, idx) => {
      if (idx >= itemsPlaced + itemsInRing) {
        itemsPlaced += itemsInRing;
        currentRing++;
        itemsInRing = (currentRing + 1) * 5;
      }
      
      const indexInRing = idx - itemsPlaced;
      const totalInThisRing = Math.min(itemsInRing, modules.length - itemsPlaced);
      const baseAngle = (indexInRing / totalInThisRing) * Math.PI * 2;
      const angleShift = (currentRing % 2 === 1) ? (Math.PI / totalInThisRing) : 0;
      const angleOffset = (pseudoRandom(idx) - 0.5) * 0.3; 
      const angle = baseAngle + angleShift + angleOffset;
      const baseRadius = 320 + currentRing * 260;
      const radiusOffset = (pseudoRandom(idx * 2) - 0.5) * 60;
      const radius = baseRadius + radiusOffset;

      return {
        ...module,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    });
  }, [modules]);

  const handleSelect = (module: AppModule) => {
    if (module.type === 'TEXT_LABEL') return;
    navigate(`/module/${module.id}`);
  };

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
        key="hub-canvas"
        drag 
        dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
        dragElastic={0.1}
        className="w-[4000px] h-[4000px] absolute top-1/2 left-1/2 outline-none"
        style={{ marginLeft: "-2000px", marginTop: "-2000px", touchAction: 'none' }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          <g transform="translate(2000, 2000)">
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

        {layoutNodes.map((node, i) => (
          <motion.div 
            key={node.id}
            className="absolute top-1/2 left-1/2 z-20 hover:z-50 focus-within:z-50 pointer-events-auto"
            initial={{ x: "-50%", y: "-50%", opacity: 0 }}
            animate={{ x: `calc(-50% + ${node.x}px)`, y: `calc(-50% + ${node.y}px)`, opacity: 1 }}
            transition={{ delay: 0.05 * i, type: 'spring', stiffness: 60 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SectionCard item={node} onSelect={handleSelect} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
