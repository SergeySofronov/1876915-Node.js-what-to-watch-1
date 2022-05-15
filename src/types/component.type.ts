const Component = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  FilmServiceInterface: Symbol.for('FilmServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  FilmModel: Symbol.for('FilmModel')
} as const;

export { Component };
