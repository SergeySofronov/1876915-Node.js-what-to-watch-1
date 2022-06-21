const Component = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  FilmServiceInterface: Symbol.for('FilmServiceInterface'),
  CommentServiceInterface: Symbol.for('CommentServiceInterface'),
  FavoritesServiceInterface: Symbol.for('FavoritesServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  FilmModel: Symbol.for('FilmModel'),
  CommentModel: Symbol.for('CommentModel'),
  FavoritesModel: Symbol.for('FavoritesModel'),
  FilmController: Symbol.for('FilmController'),
  UserController: Symbol.for('UserController'),
  CommentController: Symbol.for('CommentController'),
  FavoritesController: Symbol.for('FavoritesController'),
  ExceptionFilter: Symbol.for('ExceptionFilter')
} as const;

export { Component };
