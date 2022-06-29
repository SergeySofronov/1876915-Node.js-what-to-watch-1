export default class CommentDto {
  public comment!: string;

  public date!: string;

  public id!: string;

  public rating!: number;

  public user!: { name: string };
}
