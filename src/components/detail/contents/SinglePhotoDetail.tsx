import { AppModule } from '../../../types';
import { useSinglePhoto } from '../../../hooks/useSinglePhoto';
import { LoadingDetailView } from '../../shared/LoadingViews';
import { PostDetailView } from './PostDetailView';

export function SinglePhotoDetail({ section }: { section: AppModule }) {
  const { selectedPost } = useSinglePhoto(section);

  if (!selectedPost) return <LoadingDetailView title="Retrieving Image..." />;

  return <PostDetailView post={selectedPost} section={section} />;
}
