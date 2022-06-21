import {Expose, Type} from 'class-transformer';
import UserDto from '../../user/dto/user.dto.js';

class CommentDto {
  @Expose()
  public comment!: string;

  @Expose()
  public date!: string;

  @Expose()
  public id!: string; //commentId, не filmId или userId!

  @Expose()
  public rating!: number;

  @Expose({ name: 'userId'})
  @Type(() => UserDto)
  public user!: UserDto;
}

export default CommentDto;
