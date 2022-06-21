import typegoose, { getModelForClass, Ref, defaultClasses } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { FilmEntity } from '../film/film.entity.js';

const { prop, modelOptions } = typegoose;

export interface FavoritesEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'favorites'
  }
})
export class FavoritesEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, ref: UserEntity })
  public userId!: Ref<UserEntity>;

  @prop({ required: true, ref: FilmEntity })
  public filmId!: Ref<FilmEntity>;
}

export const FavoritesModel = getModelForClass(FavoritesEntity);
