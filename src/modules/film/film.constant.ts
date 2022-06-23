const DEFAULT_FILM_COUNT = 60;
const SIMILAR_FILM_COUNT = 4;

enum FilmValidity {
  TitleMinLength = 2,
  TitleMaxLength = 100,
  DescriptionMinLength = 20,
  DescriptionMaxLength = 1024,
  DirectorMinLength = 2,
  DirectorMaxLength = 50,
  RatingMin = 1,
  RatingMax = 10
}

export {
  DEFAULT_FILM_COUNT,
  SIMILAR_FILM_COUNT,
  FilmValidity
};
