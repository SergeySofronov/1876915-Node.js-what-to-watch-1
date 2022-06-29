import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ValidityMessage as VM } from '../../../utils/common.js';
import { UserValidity as UV } from '../user.constant.js';

class UpdateUserDto {
  @IsOptional()
  @MinLength(UV.NameMinLength, { message: VM.minValueMessage })
  @MaxLength(UV.NameMaxLength, { message: VM.maxValueMessage })
  public name?: string;

  @IsEmail({}, { message: 'Field \u00AB$property\u00BB must be a valid email address' })
  public email?: string;

  public avatar?: string;
}

export default UpdateUserDto;
