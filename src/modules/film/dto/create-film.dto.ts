import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { FilmGenreType } from '../../../types/film-genre.enum.js';
import { ValidityMessage as VM } from '../../../utils/common.js';
import { FilmValidity as FV } from '../film.constant.js';

// В декораторах @IsString(), @IsInt() и т.п. нет необходимости, т.к. другие
// декораторы могут включать подобные проверки по умолчанию (например, @IsString() и @MinLength/MaxLength)

class CreateFilmDto {
  @MinLength(FV.TitleMinLength, { message: VM.minValueMessage })
  @MaxLength(FV.TitleMaxLength, { message: VM.maxValueMessage })
  public title!: string;

  @MinLength(FV.DescriptionMinLength, { message: VM.minValueMessage })
  @MaxLength(FV.DescriptionMaxLength, { message: VM.maxValueMessage })
  public description!: string;

  @IsDateString({}, { message: 'Field \u00AB$property\u00BB must be a valid ISO date' })
  public publicationDate!: string;

  @IsEnum(FilmGenreType, { message: `Allowed genre types: ${Object.values(FilmGenreType)}` })
  public genre!: FilmGenreType;

  @IsString({ message: VM.isStringMessage })
  @IsNotEmpty({ message: VM.isNotEmptyMessage })
  public released!: string;

  @IsInt({ message: 'Field \u00AB$property\u00BB must be an integer' })
  @Min(FV.RatingMin, { message: VM.minValueMessage })
  @Max(FV.RatingMax, { message: VM.maxValueMessage })
  public rating!: number;

  @IsString({ message: VM.isStringMessage })
  @IsNotEmpty({ message: VM.isNotEmptyMessage })
  public previewVideoLink!: string;

  @IsString({ message: VM.isStringMessage })
  @IsNotEmpty({ message: VM.isNotEmptyMessage })
  public videoLink!: string;

  @IsArray({ message: 'Field \u00AB$property\u00BB must be an array' })
  @IsNotEmpty({ each: true, message: VM.isNotEmptyMessage })
  @ArrayNotEmpty()
  public starring!: string[];

  @MinLength(FV.DirectorMinLength, { message: VM.minValueMessage })
  @MaxLength(FV.DescriptionMaxLength, { message: VM.maxValueMessage })
  public director!: string;

  @IsInt({ message: 'Field \u00AB$property\u00BB must be an integer' })
  public runtime!: number;

  @IsString({ message: VM.isStringMessage })
  @IsNotEmpty({ message: VM.isNotEmptyMessage })
  public posterImage!: string;

  @IsString({ message: VM.isStringMessage })
  @IsNotEmpty({ message: VM.isNotEmptyMessage })
  public backgroundImage!: string;

  @IsString({ message: VM.isStringMessage })
  @IsNotEmpty({ message: VM.isNotEmptyMessage })
  public backgroundColor!: string;

  public userId!: string;
}

export default CreateFilmDto;

