import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';

@Module({
  imports:[
    PassportModule.register({
      defaultStrategy :'jwt'
    }),
    JwtModule.register({
      secret:'14101983',
          signOptions : {expiresIn:'1d'}
    }),
   forwardRef(()=>UserModule)
  ],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
  exports:[AuthService,JwtStrategy,PassportModule]
})
export class AuthModule {}
