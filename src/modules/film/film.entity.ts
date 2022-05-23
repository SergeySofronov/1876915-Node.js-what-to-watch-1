import typegoose, { getModelForClass, Ref, defaultClasses } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { FilmGenreType } from '../../types/film-genre.enum.js';

const { prop, modelOptions } = typegoose;

export interface FilmEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'films'
  }
})
export class FilmEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title!: string;

  @prop({ trim: true })
  public description!: string;

  @prop({ required: true })
  public publicationDate!: string;

  @prop({
    type: () => String,
    enum: FilmGenreType,
    required: true
  })
  public genre!: string;

  @prop({ required: true })
  public released!: string;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true })
  public previewVideoLink!: string;

  @prop({ required: true })
  public videoLink!: string;

  @prop({ required: true, _id: false })
  public starring!: string[];

  @prop({ required: true })
  public director!: string;

  @prop({ required: true })
  public runtime!: number;

  @prop({ required: true, default: 0 })
  public commentsCount!: number;

  @prop({ required: true })
  public posterImage!: string;

  @prop({ required: true })
  public backgroundImage!: string;

  @prop({ required: true })
  public backgroundColor!: string;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;
}

export const FilmModel = getModelForClass(FilmEntity);
