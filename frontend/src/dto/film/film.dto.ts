import LoggedUserDto from '../user/logged-user.dto';

export default class FilmDto {
  public id!: string;

  public title!: string;

  public description!: string;

  public publicationDate!: string;

  public genre!: string;

  public released!: string;

  public rating!: number;

  public previewVideoLink!: string;

  public videoLink!: string;

  public starring!: string[];

  public director!: string;

  public runtime!: number;

  public commentsCount!: number;

  public posterImage!: string;

  public backgroundImage!: string;

  public backgroundColor!: string;

  public isFavorite!: boolean;

  public user!: LoggedUserDto;
}
