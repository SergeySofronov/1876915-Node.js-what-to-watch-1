import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { createJWT, fillDTO } from '../../utils/common.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { StatusCodes } from 'http-status-codes';
import { JWT_ALGORITHM } from './user.constant.js';
import { FileExtensions } from '../../types/file-extensions.js';
import { LoggerInterface } from '../../common/logger/logger.interface';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { UserServiceInterface } from './user-service.interface.js';
import HttpError from '../../common/errors/http-error.js';
import Controller from '../../common/controller/controller.js';
import UserDto from './dto/user.dto.js';
import CreateUserDto from './dto/create-user.dto.js';
import LoginUserDto from './dto/login-user.dto.js';
import LoggedUserDto from './dto/logged-user.dto.js';
import ValidateDtoMiddleware from '../../middlewares/validate-dto.middleware.js';
import ValidateObjectIdMiddleware from '../../middlewares/validate-objectid.middleware.js';
import UploadFileMiddleware from '../../middlewares/upload-file.middleware.js';
import PrivateRouteMiddleware from '../../middlewares/private-route.middleware.js';


@injectable()
class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController...');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.createUser, middlewares: [new ValidateDtoMiddleware(CreateUserDto)] });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login, middlewares: [new ValidateDtoMiddleware(LoginUserDto)] });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.checkAuth, middlewares: [new PrivateRouteMiddleware()] });
    this.addRoute({ path: '/logout', method: HttpMethod.Delete, handler: this.logout, middlewares: [new PrivateRouteMiddleware()] });
    this.addRoute({ path: '/:userId/avatar', method: HttpMethod.Post, handler: this.uploadAvatar, middlewares: [new ValidateObjectIdMiddleware('userId'), new PrivateRouteMiddleware(), new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar')] });
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `File extension must be : ${FileExtensions}`,
        'UserController'
      );
    }

    this.created(res, { filepath: req.file?.path });
  }

  public async login(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User is not registered',
        'UserController'
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      { email: user.email, userId: user.id, name: user.name, avatar: user.avatar }
    );

    this.ok(res, fillDTO(LoggedUserDto, { ...user.toObject(), token }));
  }

  public async checkAuth(req: Request, res: Response): Promise<void> {
    this.ok(res, fillDTO(LoggedUserDto, req.user));
  }

  public async logout(req: Request, res: Response): Promise<void> {
    this.noContent(res, req.user);
  }

  public async createUser(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response): Promise<void> {

    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» already exists.`,
        'UserController'
      );
    }

    const newUser = await this.userService.create(body, this.configService.get('SALT'));
    console.log('Created');
    this.created(res, fillDTO(UserDto, newUser));
  }
}

export default UserController;
