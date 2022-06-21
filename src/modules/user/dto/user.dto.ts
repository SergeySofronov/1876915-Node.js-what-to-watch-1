import { Expose } from 'class-transformer';
import { EntityFilter as F } from '../../../types/entity-filter.type.js';

const full = `${F.USER_FULL}`, short = `${F.USER_FOR_COMMENT}`;

class UserDto {
  @Expose({groups:[full]})
  public id!: string;

  @Expose({groups:[full, short]})
  public name!: string;

  @Expose({groups:[full]})
  public email!: string;

  @Expose({groups:[full]})
  public avatar!: string;
}

export default UserDto;
