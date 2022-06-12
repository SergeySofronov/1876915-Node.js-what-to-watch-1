const DEFAULT_COMMENT_COUNT = 50;

enum CommentValidity {
  CommentMinLength = 2,
  CommentMaxLength = 1024,
  RatingMin = 1,
  RatingMax = 10
}

export {
  DEFAULT_COMMENT_COUNT,
  CommentValidity
};
