import { inject, injectable } from 'inversify';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';
import { FavoritesEntity } from './favorites.entity.js';
import { FavoritesServiceInterface } from './favorites-service.interface.js';
import SetFavoritesDto from './dto/set-favorites.dto.js';

@injectable()
class FavoritesService implements FavoritesServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.FavoritesModel) private readonly favoritesModel: ModelType<FavoritesEntity>
  ) { }

  public async setFavoriteFilm(dto: SetFavoritesDto, isFavorite: boolean): Promise<DocumentType<FavoritesEntity> | null> {
    const filmId = dto.filmId;
    const userId = dto.userId;
    if (isFavorite) {
      const favorite = await this.favoritesModel.findOne({ filmId, userId }).exec();
      if (!favorite) {
        this.logger.info(`New favorite film added: ${filmId}`);
        return this.favoritesModel.create(dto);
      }
      return favorite;
    }

    return this.favoritesModel.findOneAndDelete({ filmId }).exec();
  }
}

export default FavoritesService;
