import * as LucideIcons from 'lucide-react';
import { AppModule } from '../../../types';
import { textLabelSizeClasses } from './utils';

export function TextLabelCard({ item }: { item: AppModule }) {
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
