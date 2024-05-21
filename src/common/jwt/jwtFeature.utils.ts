import { JwtService } from "@nestjs/jwt";

export default class JwtFeature {
    static async assignJwtToken(
      userId: number,
      jwtService: JwtService,
    ): Promise<string> {
      const payload = { id: userId };
      const token = await jwtService.sign(payload);
      return token;
    }
  }