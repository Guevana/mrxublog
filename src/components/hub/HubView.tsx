import { useMemo, useRef, useState, useCallback, useEffect, TouchEvent as ReactTouchEvent } from 'react';
import { motion, useMotionValue, useAnimationControls, AnimatePresence, animate as animateMV, useTransform } from 'motion/react';
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
  // Independent pan tracker for background parallax (canvas pans via controls,
  // so we accumulate deltas here to drive reverse-moving backdrop layers).
  // Two grids at different speeds produce a real parallax depth: the near,
  // larger grid slides faster; the far, finer grid crawls slower.
  const parallaxPan = useMotionValue({ x: 0, y: 0 });
  const farX = useTransform(parallaxPan, p => p.x * 0.035);
  const farY = useTransform(parallaxPan, p => p.y * 0.035);
  const midX = useTransform(parallaxPan, p => p.x * 0.09);
  const midY = useTransform(parallaxPan, p => p.y * 0.09);
  const nearX = useTransform(parallaxPan, p => p.x * 0.16);
  const nearY = useTransform(parallaxPan, p => p.y * 0.16);
  const [showGuide, setShowGuide] = useState(() => {
    try {
      return !localStorage.getItem('hub_guided');
    } catch {
      return true;
    }
  });
  const [isZoomedOut, setIsZoomedOut] = useState(false);
  const [guideExiting, setGuideExiting] = useState(false);
  const guideTimer = useRef<number | null>(null);

  // Clean up any pending guide-dismiss timer on unmount.
  useEffect(() => () => {
    if (guideTimer.current !== null) window.clearTimeout(guideTimer.current);
  }, []);

  // Mark the guide as seen (fade out) 1s after first camera move (drag or zoom).
  const dismissGuide = useCallback(() => {
    if (guideTimer.current !== null) return; // already scheduled
    guideTimer.current = window.setTimeout(() => {
      setGuideExiting(true);
      try { localStorage.setItem('hub_guided', 'true'); } catch { /* ignore */ }
      guideTimer.current = null;
    }, 1000);
  }, []);

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
      // Nearly-zero jitter: keeps crisp concentric orbits while avoiding a
      // sterile, perfectly-aligned look.
      const angleOffset = (pseudoRandom(idx) - 0.5) * 0.04;
      const angle = baseAngle + angleShift + angleOffset;
      const baseRadius = 320 + currentRing * 260;
      const radiusOffset = (pseudoRandom(idx * 2) - 0.5) * 8;
      const radius = baseRadius + radiusOffset;

      return {
        ...module,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        radius,
      };
    });
  }, [modules]);

  const handleSelect = (module: AppModule) => {
    if (module.type === 'TEXT_LABEL') return;
    navigate(`/module/${module.id}`);
  };

  // Reset camera to center at the given zoom level (only used by reset button).
  const resetView = useCallback((targetScale?: number) => {
    const s = targetScale ?? scale.get();
    // Pan x/y via controls; zoom via the standalone scale motion value.
    controls.start({ x: 0, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } });
    parallaxPan.set({ x: 0, y: 0 });
    animateMV(scale, s, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    const fitsAll = s <= 0.6;
    setIsZoomedOut(fitsAll);
    if (fitsAll && showGuide) {
      dismissGuide();
    }
  }, [controls, scale, showGuide, dismissGuide, parallaxPan]);

  // Accumulate real pan deltas to drive the parallax backdrop backwards.
  const onDragPan = useCallback((_e: unknown, info: { delta: { x: number; y: number } }) => {
    const cur = parallaxPan.get();
    parallaxPan.set({ x: cur.x + info.delta.x, y: cur.y + info.delta.y });
  }, [parallaxPan]);

  // Zoom a step (wheel / buttons) — keeps the current pan position, only
  // scales. Does NOT snap back to CORE.
  const zoomBy = useCallback((delta: number) => {
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale.get() * delta));
    animateMV(scale, next, { duration: 0.25, ease: [0.22, 1, 0.36, 1] });
    setIsZoomedOut(next <= 0.6);
    if (showGuide && guideTimer.current === null) dismissGuide();
  }, [scale, showGuide, dismissGuide]);

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
      if (showGuide && guideTimer.current === null) dismissGuide();
    }
  }, [scale, showGuide, dismissGuide]);
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
        onDragStart={() => dismissGuide()}
        onDrag={onDragPan}
        style={{ scale, marginLeft: "-2000px", marginTop: "-2000px" }}
        className="w-[4000px] h-[4000px] absolute top-1/2 left-1/2 z-[1] outline-none"
      >
        {/* Connectors run from CORE to each card center. They're rendered
            before the opaque cards in the canvas, so the card bodies cover
            them — the line only shows in the gaps between cards. */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          <g transform={`translate(${HALF}, ${HALF})`}>
            {layoutNodes.map((node, i) => {
              return (
                <motion.line
                  key={`line-${node.id}`}
                  x1="0" y1="0"
                  x2={node.x}
                  y2={node.y}
                  stroke="#ff6600"
                  strokeWidth={1.25}
                  strokeLinecap="round"
                  strokeDasharray="6 6"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.45 }}
                  transition={{ duration: 0.6, delay: 0.25 + 0.05 * i, ease: "easeOut" }}
                />
              );
            })}
          </g>
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm border border-gray-300 shadow-sm z-10 w-64 h-64">
          {/* Fine rotating tick ring — a precision instrument, not a glow blob */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -inset-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 120, ease: "linear", repeat: Infinity }}
            >
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {Array.from({ length: 60 }).map((_, i) => {
                  const major = i % 5 === 0;
                  const a = (i / 60) * Math.PI * 2;
                  const r1 = major ? 92 : 96;
                  const r2 = 100;
                  const x1 = 100 + Math.cos(a) * r1;
                  const y1 = 100 + Math.sin(a) * r1;
                  const x2 = 100 + Math.cos(a) * r2;
                  const y2 = 100 + Math.sin(a) * r2;
                  return (
                    <line
                      key={i}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={major ? "#ff6600" : "#bbb"}
                      strokeWidth={major ? 1.4 : 0.7}
                      opacity={major ? 0.8 : 0.5}
                    />
                  );
                })}
              </svg>
            </motion.div>
          </div>
          {/* Soft, subtle radial vignette — grounding, not glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 45%, rgba(255,102,0,0.05) 0%, rgba(255,102,0,0) 55%, rgba(245,245,245,0.6) 100%)",
            }}
          />

          {/* Gentle breathing of the core content */}
          <motion.div
            animate={{ scale: [1, 1.015, 1] }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
            className="relative flex flex-col items-center justify-center"
          >
            <Terminal className="w-12 h-12 mb-6 text-gray-800" />
            <h1 className="text-2xl font-black tracking-[0.2em] mb-2 text-[#111]">CORE</h1>
            <p className="text-[9px] tracking-[0.3em] text-gray-500 uppercase text-center">
              COMPONENT CONTROL <br /> SECTION
            </p>
          </motion.div>

          {/* corner ticks (keep) */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-orange-500"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-orange-500"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-gray-400"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-gray-400"></div>
        </div>

        {layoutNodes.map((node, i) => {
          // Depth cue: cards farther from CORE recede (lower opacity + smaller),
          // hover snaps them forward. Pure opacity/scale — GPU-composited, so
          // the converge entrance stays smooth.
          const depth = Math.min(0.25, Math.max(0, ((node.radius || 0) - 300) / 1200));
          const depthOpacity = 1 - depth * 0.45;
          const depthScale = 1 - depth * 0.16;
          const left = HALF + node.x;
          const top = HALF + node.y;
          // Star-converge entrance: each node flies in from beyond its final
          // orbit (outward along its radius). Only transform + opacity animate,
          // so it stays smooth instead of repainting every frame.
          const flyDir = Math.atan2(node.y, node.x);
          const flyDist = 140 + (node.radius || 0) * 0.5;
          const flyX = Math.cos(flyDir) * flyDist;
          const flyY = Math.sin(flyDir) * flyDist;
          return (
            <motion.div
              key={node.id}
              className="absolute z-20 hover:z-50 focus-within:z-50 pointer-events-auto will-change-transform"
              initial={{ left, top, x: flyX, y: flyY, opacity: 0, scale: 0.7 }}
              animate={{ left, top, x: 0, y: 0, opacity: depthOpacity, scale: depthScale }}
              transition={{
                duration: 0.7,
                delay: 0.25 + 0.06 * i,
                ease: [0.22, 1, 0.36, 1],
                left: { duration: 0 },
                top: { duration: 0 },
                opacity: { duration: 0.4, delay: 0.25 + 0.06 * i },
              }}
              whileHover={{ scale: depthScale * 1.07, opacity: 1 }}
              whileTap={{ scale: depthScale * 0.96 }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <SectionCard item={node} onSelect={handleSelect} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Parallax backdrop — two grids at different speeds + blur produce a
          real sense of depth as the camera pans (near moves fast, far crawls). */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Far: tiny, slow, near-invisible */}
        <motion.div
          className="absolute -inset-x-40 -inset-y-40"
          style={{
            x: farX,
            y: farY,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(17,17,17,0.06) 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
        {/* Middle: medium grid */}
        <motion.div
          className="absolute -inset-x-40 -inset-y-40"
          style={{
            x: midX,
            y: midY,
            backgroundImage:
              "linear-gradient(to right, rgba(17,17,17,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.045) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* Near: larger grid, faster, slight blur to sell closeness */}
        <motion.div
          className="absolute -inset-x-40 -inset-y-40 blur-[0.5px]"
          style={{
            x: nearX,
            y: nearY,
            backgroundImage:
              "linear-gradient(to right, rgba(17,17,17,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.06) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
          }}
        />
      </div>

      {/* Camera controls — top-right, below the hamburger menu in the header */}
      <div className="absolute top-20 right-4 md:top-24 md:right-6 z-30 flex flex-col gap-2 pointer-events-auto">
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
        {showGuide && !guideExiting && (
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
