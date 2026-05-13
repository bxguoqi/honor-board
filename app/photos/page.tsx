import { getPhotos } from '@/lib/notion';
import PhotosClient from './PhotosClient';

export default async function PhotosPage() {
  const photos = await getPhotos();
  return <PhotosClient photos={photos} />;
}
