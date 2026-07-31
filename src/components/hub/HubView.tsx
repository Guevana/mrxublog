import { useMemo, useRef, useState, useCallback, useEffect, TouchEvent as ReactTouchEvent } from 'react';
import { motion, useMotionValue, useAnimationControls, AnimatePresence, animate as animateMV } from 'motion/react';
import { Terminal, LocateFixed, Hand, MousePointerClick } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppModule } from '../../types';
import { LoadingView } from '../shared/LoadingViews';
import { SectionCard } from './cards/SectionCard';
import { useAppModules } from '../../hooks/useAppModules';

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

// Canvas geometry — the draggable world the cards live in.
const CANVAS = 4000;
const HALF = CANVAS / 2;
const MIN_SCALE = 0.35;
const MAX_SCALE = 1.6;
const START_SCALE = 0.85;

const dragConstraints = { left: -HALF, right: HALF, top: -HALF, bottom: HALF };

export function HubViewContainer() {
  const { modules, loading } = useAppModules();

  if (loading) return <LoadingView />;
  return <HubView modules={modules} />;
}

function HubView({ modules }: { modules: AppModule[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [instanceId] = useState(() => Math.random().toString(36).slice(2, 9));

  // Zoom + pan state (motion values so spring/camera animation is smooth).
  const scale = useMotionValue(START_SCALE);
  const controls = useAnimationControls();
  const [showGuide, setShowGuide] = useState(() => {
    try {
      return !localStorage.getItem('hub_guided');
    } catch {
      return true;
    }
  });
  const [isZoomedOut, setIsZoomedOut] = useState(false);

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

  // Reset camera to center at the given zoom level.
  const resetView = useCallback((targetScale?: number) => {
    const s = targetScale ?? scale.get();
    // Pan x/y via controls; zoom via the standalone scale motion value.
    controls.start({ x: 0, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } });
    animateMV(scale, s, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    const fitsAll = s <= 0.6;
    setIsZoomedOut(fitsAll);
    if (fitsAll && showGuide) {
      try { localStorage.setItem('hub_guided', 'true'); } catch { /* ignore */ }
    }
  }, [controls, scale, showGuide]);

  // Zoom a step (wheel / buttons).
  const zoomBy = useCallback((delta: number) => {
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale.get() * delta));
    resetView(next);
  }, [resetView, scale]);

  // Mouse wheel zoom (while hovering the hub).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomBy(e.deltaY > 0 ? 0.88 : 1.13);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomBy]);

  // Pinch-to-zoom on touch devices.
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const onTouchStart = useCallback((e: ReactTouchEvent) => {
    if (e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      pinch.current = { dist: d, scale: scale.get() };
    }
  }, [scale]);
  const onTouchMove = useCallback((e: ReactTouchEvent) => {
    if (e.touches.length === 2 && pinch.current) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const ratio = d / pinch.current.dist;
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinch.current.scale * ratio));
      scale.set(next);
    }
  }, [scale]);
  const onTouchEnd = useCallback(() => {
    pinch.current = null;
    setIsZoomedOut(scale.get() <= 0.6);
  }, [scale]);

  return (
    <motion.div
      key={`hub-${instanceId}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full relative cursor-grab active:cursor-grabbing outline-none pointer-events-auto overflow-hidden block"
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <motion.div
        key={`hub-canvas-${instanceId}`}
        drag
        dragConstraints={dragConstraints}
        dragElastic={0.12}
        initial={false}
        animate={controls}
        style={{ scale }}
        className="w-[4000px] h-[4000px] absolute top-1/2 left-1/2 outline-none"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          <g transform={`translate(${HALF}, ${HALF})`}>
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
            COMPONENT CONTROL <br /> SECTION
          </p>
        </div>

        {layoutNodes.map((node, i) => {
          // Depth parallax: cards farther from CORE recede slightly
          // (lower opacity + smaller) for a subtle 3D feel.
          const depth = Math.min(0.25, Math.max(0, (node.radius - 300) / 1200));
          const depthOpacity = 1 - depth * 0.35;
          const depthScale = 1 - depth * 0.18;
          return (
            <motion.div
              key={node.id}
              className="absolute top-1/2 left-1/2 z-20 hover:z-50 focus-within:z-50 pointer-events-auto"
              initial={{ x: "-50%", y: "-50%", opacity: 0 }}
              animate={{ x: `calc(-50% + ${node.x}px)`, y: `calc(-50% + ${node.y}px)`, opacity: depthOpacity, scale: depthScale }}
              transition={{ delay: 0.05 * i, type: 'spring', stiffness: 60 }}
              whileHover={{ scale: depthScale * 1.06 }}
              whileTap={{ scale: depthScale * 0.96 }}
            >
              <SectionCard item={node} onSelect={handleSelect} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Camera controls — top-right, above the canvas */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={() => zoomBy(1.25)}
          title="Zoom in"
          className="w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm hover:bg-orange-50 hover:border-orange-200 text-gray-600 hover:text-orange-500 transition-colors text-base font-bold"
        >
          +
        </button>
        <button
          onClick={() => zoomBy(0.8)}
          title="Zoom out"
          className="w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm hover:bg-orange-50 hover:border-orange-200 text-gray-600 hover:text-orange-500 transition-colors text-base font-bold"
        >
          −
        </button>
        <button
          onClick={() => resetView(START_SCALE)}
          title="Reset view"
          className="w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm hover:bg-orange-50 hover:border-orange-200 text-gray-600 hover:text-orange-500 transition-colors"
        >
          <LocateFixed className="w-4 h-4" />
        </button>
      </div>

      {/* First-visit hint */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-3 bg-[#111]/90 text-white px-5 py-3 text-[10px] tracking-[0.25em] uppercase">
              <Hand className="w-4 h-4 text-orange-400" />
              <span>Drag to explore</span>
              <MousePointerClick className="w-4 h-4 text-orange-400" />
              <span>Click a node</span>
            </div>
            <div className="text-[9px] tracking-[0.3em] text-gray-500 uppercase">scroll / pinch to zoom</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
