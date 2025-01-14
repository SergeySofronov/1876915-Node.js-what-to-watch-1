import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { User } from '../../types/user.type';
import { createSHA256 } from '../../utils/common.js';

const { prop, modelOptions } = typegoose;


interface UserEntity extends defaultClasses.Base { }

// декоратор изменяет название коллекции с userEntities на users
@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.name = data.name;
    this.email = data.email;
    this.avatar = data.avatar;
  }

  @prop({ required: true, trim: true, unique: true })
  public email!: string;

  @prop({ required: true, trim: true, default: '' })
  public name!: string;

  @prop({ required: true, trim: true, default: '' })
  public avatar!: string;

  @prop({ required: true, trim: true, default: '' })
  public password!: string;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

const UserModel = getModelForClass(UserEntity);

export { UserEntity, UserModel };
