import { CSSProperties } from 'react';
import * as LucideIcons from 'lucide-react';
import { AppModule } from '../../../types';
import { getSizeClasses } from './utils';
import { AdaptiveText } from '../../shared/AdaptiveText';

export function DefaultActionCard({ item, onSelect }: { item: AppModule; onSelect: (item: AppModule) => void }) {
  const IconComponent = (LucideIcons as any)[item.iconName] || LucideIcons.Box;
  
  const customBgStyle = item.color ? { backgroundColor: item.color } : {};
  const customBorderColorStyle = item.color ? { borderColor: item.color } : {};
  const customShadowStyle = item.color ? { 
    boxShadow: `0 10px 15px -3px ${item.color}40, 0 4px 6px -4px ${item.color}40`,
  } as CSSProperties : {};

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative bg-white/60 backdrop-blur-md border border-gray-200 block overflow-hidden shadow-sm cursor-pointer ${!item.color ? 'hover:shadow-orange-500/10 hover:shadow-lg' : 'hover:-translate-y-1'} transition-all duration-300 ${getSizeClasses(item.size)}`}
      style={{ isolation: 'isolate', ...(item.color ? customShadowStyle : {}) }}
    >
      <div className="absolute inset-0 p-6 flex flex-col items-start bg-transparent transition-transform duration-300 ease-linear group-hover:scale-[1.03] z-10">
        <div className="absolute top-0 right-0 w-10 h-10 bg-gray-50 flex items-center justify-center border-l border-b border-gray-200">
           <IconComponent className="w-4 h-4 text-gray-400" />
        </div>
        <div className="mb-3 text-gray-900 w-full pr-8">
           <AdaptiveText maxFontSize={36} className="font-black tracking-tighter w-full">{item.id}</AdaptiveText>
        </div>
        <div className="w-full flex-1">
           <AdaptiveText maxFontSize={10} className="font-bold tracking-[0.2em] uppercase text-gray-500 w-full">{item.title}</AdaptiveText>
        </div>
      </div>

      <div className={`absolute top-0 left-0 h-full ${!item.color ? 'bg-orange-500' : ''} z-20 overflow-hidden w-0 transition-[width] duration-[400ms] ease-linear group-hover:w-full`} style={customBgStyle}>
        <div className={`p-6 flex flex-col items-start relative transition-transform duration-300 ease-linear group-hover:scale-[1.03] ${getSizeClasses(item.size)}`}>
          <div className={`absolute top-0 right-0 w-10 h-10 flex items-center justify-center border-l border-b ${!item.color ? 'border-orange-400' : ''}`} style={customBorderColorStyle}>
             <IconComponent className="w-4 h-4 text-white" />
          </div>
          <div className="mb-3 text-white w-full pr-8">
             <AdaptiveText maxFontSize={36} className="font-black tracking-tighter w-full">{item.id}</AdaptiveText>
          </div>
          <div className="w-full flex-1">
             <AdaptiveText maxFontSize={10} className={`font-bold tracking-[0.2em] uppercase w-full ${!item.color ? 'text-orange-100' : 'text-white/90'}`}>{item.title}</AdaptiveText>
          </div>
        </div>
      </div>
    </div>
  );
}
