import { MAX_ALBUMS_NUMBER } from './constants';

export const rotateToLeft = (input: string[]) => {
  if (!input || input.length <= 1) return input;

  return input.slice(1, input.length).concat(input[0]);
};

export const getAlbumNames = (albums: any[]) => {
  const albumNames = albums.map((album) => album.collectionName).sort();
  const wantedAlbums = [...new Set([...albumNames])];

  if (!wantedAlbums.length) return [];

  if (wantedAlbums.length > MAX_ALBUMS_NUMBER)
    return wantedAlbums.splice(0, MAX_ALBUMS_NUMBER);

  return wantedAlbums;
};
