import { Expose } from 'class-transformer';

class ShortedFilmDto {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public publicationDate!: string;

  @Expose()
  public genre!: string;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public posterImage!: string;

  @Expose()
  public userId!: string;
}

export default ShortedFilmDto;
