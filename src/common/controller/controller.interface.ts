import { RouteInterface } from '../../types/route.interface.js';
import { Response, Router } from 'express';

interface ControllerInterface {
  readonly router: Router;
  addRoute(route: RouteInterface): void;
  send<T>(res: Response, statusCode: number, data: T): void;
}

export { ControllerInterface };
