import { AppModule } from '../../../types';
import { textLabelSizeClasses } from './utils';
import { AdaptiveText } from '../../shared/AdaptiveText';
import { DynamicIcon } from '../../shared/DynamicIcon';

export function TextLabelCard({ item }: { item: AppModule }) {
  return (
    <div className={`bg-white/60 backdrop-blur-md border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center group cursor-default ${textLabelSizeClasses(item.size)}`}>
       <DynamicIcon name={item.iconName} className="w-5 h-5 text-gray-400 mb-2 flex-shrink-0" />
       
       <div className="w-full border-b border-gray-200 pb-2 mb-2 flex justify-center text-gray-500">
          <AdaptiveText maxFontSize={10} className="font-bold tracking-[0.2em] uppercase text-center justify-center">
            {item.title}
          </AdaptiveText>
       </div>
       
       <div className="w-full flex-1 flex flex-col justify-start text-gray-600">
          <AdaptiveText maxFontSize={9} className="tracking-widest leading-relaxed uppercase text-center justify-center">
             {item.desc || ''}
          </AdaptiveText>
       </div>
    </div>
  );
}
