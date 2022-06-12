import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { ValidityMessage as VM } from '../../../utils/common.js';
import { UserValidity as UV } from '../user.constant.js';

class LoginUserDto {
  @IsEmail({}, { message: 'Field \u00AB$property\u00BB must be a valid email address' })
  public email!: string;

  @MinLength(UV.PasswordMinLength, { message: VM.minValueMessage })
  @MaxLength(UV.PasswordMaxLength, { message: VM.maxValueMessage })
  public password!: string;
}

export default LoginUserDto;
