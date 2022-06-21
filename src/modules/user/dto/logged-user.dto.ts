import { Expose } from 'class-transformer';

class LoggedUserDto {
  @Expose()
  public avatar!: string;

  @Expose()
  public email!: string;

  @Expose()
  public name!: string;

  @Expose()
  public token!: string;
}

export default LoggedUserDto;

