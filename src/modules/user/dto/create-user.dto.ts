import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ValidityMessage as VM } from '../../../utils/common.js';
import { UserValidity as UV } from '../user.constant.js';

class CreateUserDto {
  @MinLength(UV.NameMinLength, { message: VM.minValueMessage })
  @MaxLength(UV.NameMaxLength, { message: VM.maxValueMessage })
  public name!: string;

  @IsEmail({}, { message: 'Field \u00AB$property\u00BB must be a valid email address' })
  public email!: string;

  @IsString({ message: VM.isStringMessage })
  @IsNotEmpty({ message: VM.isNotEmptyMessage })
  public avatar!: string;

  @MinLength(UV.PasswordMinLength, { message: VM.minValueMessage })
  @MaxLength(UV.PasswordMaxLength, { message: VM.maxValueMessage })
  public password!: string;
}

export default CreateUserDto;
