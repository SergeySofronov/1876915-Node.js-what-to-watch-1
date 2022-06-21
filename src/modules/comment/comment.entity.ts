import typegoose, { getModelForClass, defaultClasses, Ref } from '@typegoose/typegoose';
import { FilmEntity } from '../film/film.entity.js';
import { UserEntity } from '../user/user.entity.js';
const { prop, modelOptions } = typegoose;


interface CommentEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})

class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, trim: true })
  public comment!: string;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true, default: new Date().toISOString() })
  public date!: string;

  @prop({ required: true, ref: UserEntity })
  public userId!: Ref<UserEntity>;

  @prop({ required: true, ref: FilmEntity })
  public filmId!: Ref<FilmEntity>;
}

const CommentModel = getModelForClass(CommentEntity);

export { CommentEntity, CommentModel };
