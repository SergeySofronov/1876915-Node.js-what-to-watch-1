import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../utils/common.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { StatusCodes } from 'http-status-codes';
import { LoggerInterface } from '../../common/logger/logger.interface';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { UserServiceInterface } from './user-service.interface.js';
import Controller from '../../common/controller/controller.js';
import UserDto from './dto/user.dto.js';
import CreateUserDto from './dto/create-user.dto.js';
import HttpError from '../../common/errors/http-error.js';


@injectable()
class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController...');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.createUser });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.checkAuth });
    this.addRoute({ path: '/logout', method: HttpMethod.Get, handler: this.logout });
  }

  public async login(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'not implemented', 'UserController');
  }

  public async checkAuth(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'not implemented', 'UserController');
  }

  public async logout(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'not implemented', 'UserController');
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
    this.send(res, StatusCodes.CREATED, fillDTO(UserDto, newUser));
  }
}

export default UserController;
