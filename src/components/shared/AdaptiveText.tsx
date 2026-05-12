import { useRef, useLayoutEffect, useState, ReactNode, CSSProperties } from 'react';

interface AdaptiveTextProps {
  children: string;
  minFontSize?: number;
  maxFontSize: number;
  className?: string;
  style?: CSSProperties;
}

export function AdaptiveText({ children, minFontSize = 6, maxFontSize, className = '', style = {} }: AdaptiveTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useLayoutEffect(() => {
    const resizeText = () => {
      const container = containerRef.current;
      const text = textRef.current;
      if (!container || !text) return;

      // Temporarily set to max to measure natural size
      text.style.fontSize = `${maxFontSize}px`;
      
      let bestFit = maxFontSize;
      
      // We only shrink if it overflows horizontally or vertically (if container has explicit height)
      if (text.scrollWidth > container.clientWidth || (container.clientHeight > 0 && text.scrollHeight > container.clientHeight)) {
         let low = minFontSize;
         let high = maxFontSize;
         
         while (low <= high) {
           const mid = Math.floor((low + high) / 2);
           text.style.fontSize = `${mid}px`;
   
           if (text.scrollWidth <= container.clientWidth && (container.clientHeight === 0 || text.scrollHeight <= container.clientHeight)) {
             bestFit = mid;
             low = mid + 1;
           } else {
             high = mid - 1;
           }
         }
      }

      setFontSize(bestFit);
      text.style.fontSize = `${bestFit}px`;
    };

    resizeText();

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(resizeText);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [children, minFontSize, maxFontSize]);

  return (
    <div ref={containerRef} className={`w-full overflow-hidden flex items-start ${className}`} style={style}>
      <span ref={textRef} className="block whitespace-pre-wrap break-words w-full" style={{ fontSize: `${fontSize}px`, lineHeight: 1.2 }}>
        {children}
      </span>
    </div>
  );
}

