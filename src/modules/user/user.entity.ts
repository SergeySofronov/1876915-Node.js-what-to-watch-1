import 'reflect-metadata';
import typegoose, { getModelForClass } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses.js';
import { User } from '../../types/user.type';
import { createSHA256 } from '../../utils/common.js';

const { prop, modelOptions } = typegoose;


interface UserEntity extends Base { }

// декоратор изменяет название коллекции с userEntities на users
@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

class UserEntity extends TimeStamps implements User {
  constructor(data: User) {
    super();

    this.name = data.name;
    this.email = data.email;
    this.avatar = data.avatar;
  }

  @prop({ unique: true, required: true })
  public email!: string;

  @prop({ required: true, default: '' })
  public name!: string;

  @prop({ required: true, default: '' })
  public avatar!: string;

  @prop({ required: true, default: '' })
  public password!: string;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

const UserModel = getModelForClass(UserEntity);

export { UserEntity, UserModel };
