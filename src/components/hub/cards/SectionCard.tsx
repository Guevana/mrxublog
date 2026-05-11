import { AppModule } from '../../../types';
import { TextLabelCard } from './TextLabelCard';
import { SinglePhotoCard } from './SinglePhotoCard';
import { DefaultActionCard } from './DefaultActionCard';

export function SectionCard({ item, onSelect }: { item: AppModule; onSelect: (item: AppModule) => void }) {
  if (item.type === 'TEXT_LABEL') return <TextLabelCard item={item} />;
  if (item.type === 'SINGLE_PHOTO') return <SinglePhotoCard item={item} onSelect={onSelect} />;
  return <DefaultActionCard item={item} onSelect={onSelect} />;
}
