import { AppModule } from '../../types';
import { SinglePhotoDetail } from './contents/SinglePhotoDetail';
import { SingleArticleDetail } from './contents/SingleArticleDetail';
import { ArticleListDetail } from './contents/ArticleListDetail';

export function DetailContent({ section }: { section: AppModule }) {
  if (section.type === 'SINGLE_PHOTO') return <SinglePhotoDetail section={section} />;
  if (section.type === 'SINGLE_ARTICLE') return <SingleArticleDetail section={section} />;
  return <ArticleListDetail section={section} />;
}
