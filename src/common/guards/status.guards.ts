import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "src/modules/user/user.service";
import { STATUS_KEY } from "../decorators/status.decorator";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class StatusGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const requiredStatus = this.reflector.getAllAndOverride(STATUS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredStatus) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const tokenParts = request.headers.authorization?.split(' ') || [];

    if (tokenParts.length <= 0 || tokenParts[0] !== 'Bearer') {
      return false;
    }

    let decoded: any = jwt.verify(tokenParts[1], '14101983');

    const data: any = await this.userService.findUserStatusByUserId(decoded.id);
    return requiredStatus.some((status) => status === data);
  }
}