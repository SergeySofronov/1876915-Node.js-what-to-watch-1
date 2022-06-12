import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { FilmGenreType } from '../../../types/film-genre.enum.js';
import { ValidityMessage as VM } from '../../../utils/common.js';
import { FilmValidity as FV } from '../film.constant.js';

class EditFilmDto {
  @IsOptional()
  @MinLength(FV.TitleMinLength, { message: VM.minValueMessage })
  @MaxLength(FV.TitleMaxLength, { message: VM.maxValueMessage })
  public title!: string;

  @IsOptional()
  @MinLength(FV.DescriptionMinLength, { message: VM.minValueMessage })
  @MaxLength(FV.DescriptionMaxLength, { message: VM.maxValueMessage })
  public description!: string;

  @IsOptional()
  @IsDateString({}, { message: 'Field \u00AB$property\u00BB must be a valid ISO date' })
  public publicationDate!: string;

  @IsOptional()
  @IsEnum(FilmGenreType, { message: `Allowed genre types: ${Object.values(FilmGenreType)}` })
  public genre!: FilmGenreType;

  @IsOptional()
  @IsString({ message: VM.isStringMessage })
  @IsNotEmpty({ message: VM.isNotEmptyMessage })
  public released!: string;

  @IsOptional()
  @IsInt({ message: 'Field \u00AB$property\u00BB must be an integer' })
  @Min(FV.RatingMin, { message: VM.minValueMessage })
  @Max(FV.RatingMax, { message: VM.maxValueMessage })
  public rating!: number;

  @IsOptional()
  @IsString({ message: VM.isStringMessage })
  @IsNotEmpty({ message: VM.isNotEmptyMessage })
  public previewVideoLink!: string;

  @IsOptional()
  @IsString({ message: VM.isStringMessage })
  @IsNotEmpty({ message: VM.isNotEmptyMessage })
  public videoLink!: string;

  @IsOptional()
  @IsArray({ message: 'Field \u00AB$property\u00BB must be an array' })
  @IsNotEmpty({ each: true, message: VM.isNotEmptyMessage })
  @ArrayNotEmpty()
  public starring!: string[];

  @IsOptional()
  @MinLength(FV.DirectorMinLength, { message: VM.minValueMessage })
  @MaxLength(FV.DescriptionMaxLength, { message: VM.maxValueMessage })
  public director!: string;

  @IsOptional()
  @IsInt({ message: 'Field \u00AB$property\u00BB must be an integer' })
  public runtime!: number;

  @IsOptional()
  @IsString({ message: VM.isStringMessage })
  @IsNotEmpty({ message: VM.isNotEmptyMessage })
  public posterImage!: string;

  @IsOptional()
  @IsString({ message: VM.isStringMessage })
  @IsNotEmpty({ message: VM.isNotEmptyMessage })
  public backgroundImage!: string;

  @IsOptional()
  @IsString({ message: VM.isStringMessage })
  @IsNotEmpty({ message: VM.isNotEmptyMessage })
  public backgroundColor!: string;
}

export default EditFilmDto;
