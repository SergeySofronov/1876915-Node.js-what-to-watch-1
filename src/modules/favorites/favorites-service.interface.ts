import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { FavoritesEntity } from './favorites.entity.js';
import SetFavoritesDto from './dto/set-favorites.dto.js';

interface FavoritesServiceInterface {
  setFavoriteFilm(dto: SetFavoritesDto, isFavorite: boolean): Promise<DocumentType<FavoritesEntity> | null>;
}

export { FavoritesServiceInterface };
