import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
const { prop, modelOptions } = typegoose;


interface CommentEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})

class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public comment!: string;
}

const CommentModel = getModelForClass(CommentEntity);

export { CommentEntity, CommentModel };
