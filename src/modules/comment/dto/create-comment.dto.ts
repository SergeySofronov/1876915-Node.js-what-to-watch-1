import { IsInt, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ValidityMessage as VM } from '../../../utils/common.js';
import { CommentValidity as CV } from '../comment.constant.js';

class CreateCommentDto {
  @MinLength(CV.CommentMinLength, { message: VM.minValueMessage })
  @MaxLength(CV.CommentMaxLength, { message: VM.maxValueMessage })
  public comment!: string;

  @IsInt({ message: 'Field \u00AB$property\u00BB must be an integer' })
  @Min(CV.RatingMin, { message: VM.minValueMessage })
  @Max(CV.RatingMax, { message: VM.maxValueMessage })
  public rating!: number;

  public userId!: string;

  public filmId?: string;
}

export default CreateCommentDto;
