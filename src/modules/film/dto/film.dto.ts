import { Expose, Type } from 'class-transformer';
import { EntityFilter as F } from '../../../types/entity-filter.type.js';
import UserDto from '../../user/dto/user.dto.js';

const full = `${F.FILM_FULL}`, short = `${F.FILM_SHORT}`;

class FilmDto {
  @Expose({ groups: [full, short] })
  public id!: string;

  @Expose({ groups: [full, short] })
  public title!: string;

  @Expose({ groups: [full] })
  public description!: string;

  @Expose({ groups: [full, short] })
  public publicationDate!: string;

  @Expose({ groups: [full, short] })
  public genre!: string;

  @Expose({ groups: [full] })
  public released!: string;

  @Expose({ groups: [full] })
  public rating!: number;

  @Expose({ groups: [full, short] })
  public previewVideoLink!: string;

  @Expose({ groups: [full] })
  public videoLink!: string;

  @Expose({ groups: [full] })
  public starring!: string[];

  @Expose({ groups: [full] })
  public director!: string;

  @Expose({ groups: [full] })
  public runtime!: number;

  @Expose({ groups: [full] })
  public commentsCount!: number;

  @Expose({ groups: [full, short] })
  public posterImage!: string;

  @Expose({ groups: [full] })
  public backgroundImage!: string;

  @Expose({ groups: [full] })
  public backgroundColor!: string;

  @Expose({ name: 'userId', groups: [full, short] })
  @Type(() => UserDto)
  public user!: string;

  @Expose({ groups: [full] })
  public isFavorite!: boolean;
}

export default FilmDto;
