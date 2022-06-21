import 'reflect-metadata';
import { Container } from 'inversify';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { Component } from './types/component.type.js';
import { LoggerInterface } from './common/logger/logger.interface.js';
import { ConfigInterface } from './common/config/config.interface.js';
import { DatabaseInterface } from './common/database-client/database.interface.js';
import { ControllerInterface } from './common/controller/controller.interface.js';
import { ExceptionFilterInterface } from './common/errors/exception-filter.interface.js';
import { FilmServiceInterface } from './modules/film/film-service.interface.js';
import { UserServiceInterface } from './modules/user/user-service.interface.js';
import { CommentServiceInterface } from './modules/comment/comment-service.interface.js';
import { FavoritesServiceInterface } from './modules/favorites/favorites-service.interface.js';
import { FilmEntity, FilmModel } from './modules/film/film.entity.js';
import { UserEntity, UserModel } from './modules/user/user.entity.js';
import { CommentEntity, CommentModel } from './modules/comment/comment.entity.js';
import { FavoritesEntity, FavoritesModel } from './modules/favorites/favorites.entity.js';
import Application from './app/application.js';
import ConfigService from './common/config/config.service.js';
import LoggerService from './common/logger/logger.service.js';
import DatabaseService from './common/database-client/database.service.js';
import UserService from './modules/user/user.service.js';
import FilmService from './modules/film/film.service.js';
import CommentService from './modules/comment/comment.service.js';
import FilmController from './modules/film/film.controller.js';
import UserController from './modules/user/user.controller.js';
import CommentController from './modules/comment/comment.controller.js';
import ExceptionFilter from './common/errors/exception-filter.js';
import FavoritesService from './modules/favorites/favorites.service.js';
import FavoritesController from './modules/favorites/favorites.controller.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
applicationContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
applicationContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseService).inSingletonScope();

applicationContainer.bind<FilmServiceInterface>(Component.FilmServiceInterface).to(FilmService).inSingletonScope();
applicationContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService).inSingletonScope();
applicationContainer.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService).inSingletonScope();
applicationContainer.bind<FavoritesServiceInterface>(Component.FavoritesServiceInterface).to(FavoritesService).inSingletonScope();

applicationContainer.bind<ModelType<FilmEntity>>(Component.FilmModel).toConstantValue(FilmModel);
applicationContainer.bind<ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
applicationContainer.bind<ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
applicationContainer.bind<ModelType<FavoritesEntity>>(Component.FavoritesModel).toConstantValue(FavoritesModel);

applicationContainer.bind<ControllerInterface>(Component.FilmController).to(FilmController).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.UserController).to(UserController).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.CommentController).to(CommentController).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.FavoritesController).to(FavoritesController).inSingletonScope();

applicationContainer.bind<ExceptionFilterInterface>(Component.ExceptionFilter).to(ExceptionFilter).inSingletonScope();


const application = applicationContainer.get<Application>(Component.Application);
await application.init();
