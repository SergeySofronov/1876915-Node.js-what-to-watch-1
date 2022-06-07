import { Expose, Type } from 'class-transformer';
import UserDto from '../../user/dto/user.dto.js';

class DetailedFilmDto {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public publicationDate!: string;

  @Expose()
  public genre!: string;

  @Expose()
  public released!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public videoLink!: string;

  @Expose()
  public starring!: string[];

  @Expose()
  public director!: string;

  @Expose()
  public runtime!: number;

  @Expose()
  public commentsCount!: number;

  @Expose()
  public posterImage!: string;

  @Expose()
  public backgroundImage!: string;

  @Expose()
  public backgroundColor!: string;

  @Expose({ name: 'userId'})
  @Type(() => UserDto)
  public userId!: string;
}

export default DetailedFilmDto;
