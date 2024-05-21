import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UserService } from "src/modules/user/user.service";
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRETORKEY,
    });
  }

  async validate(payload) {
    const { id } = payload;

    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new UnauthorizedException('Login first to access this resource.');
    }

    return user;
  }
}