const Component = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  FilmServiceInterface: Symbol.for('FilmServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  FilmModel: Symbol.for('FilmModel'),
  FilmController: Symbol.for('FilmController'),
  UserController: Symbol.for('UserController'),
  CommentController: Symbol.for('CommentController'),
  ExceptionFilter: Symbol.for('ExceptionFilter')
} as const;

export { Component };
