import { Expose, Type } from 'class-transformer';
import UserDto from '../../user/dto/user.dto.js';

class ShortedFilmDto {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public publicationDate!: string;

  @Expose()
  public genre!: string;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public posterImage!: string;

  @Expose({ name: 'userId' })
  @Type(() => UserDto)
  public userId!: string;
}

export default ShortedFilmDto;
