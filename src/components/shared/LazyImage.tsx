import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon } from 'lucide-react';

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  containerClassName = '',
  iconClassName = 'w-8 h-8',
}: { 
  src?: string | null; 
  alt?: string; 
  className?: string;
  containerClassName?: string;
  iconClassName?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;
    setIsLoaded(false);
    setHasError(false);

    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
  }, [src]);

  if (!src || hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${containerClassName}`}>
        <ImageIcon className={`text-gray-400 ${iconClassName}`} />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200" />
      )}
      {/* Skeleton overlay scanning effect while loading */}
      {!isLoaded && (
        <motion.div 
          className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      )}
      <motion.img 
        src={src} 
        alt={alt || ''} 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.05 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full h-full ${className}`} 
      />
    </div>
  );
}
