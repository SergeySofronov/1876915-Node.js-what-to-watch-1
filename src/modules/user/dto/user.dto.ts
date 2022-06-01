import { Expose } from 'class-transformer';

class UserDto {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatar!: string;
}

export default UserDto;
