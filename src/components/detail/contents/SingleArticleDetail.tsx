import { AppModule } from '../../../types';
import { useSingleArticle } from '../../../hooks/useSingleArticle';
import { LoadingDetailView, EmptyDetailView } from '../../shared/LoadingViews';
import { PostDetailView } from './PostDetailView';

export function SingleArticleDetail({ section }: { section: AppModule }) {
  const { selectedPost, loading } = useSingleArticle(section);

  if (loading) return <LoadingDetailView title="Syncing with DB..." />;
  if (!selectedPost) return <EmptyDetailView title="No matching record." />;

  return <PostDetailView post={selectedPost} section={section} />;
}
