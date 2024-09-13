import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signup.dto';
import { UserI } from '../user/interface/user.interface';
import { LoginDTO } from './dto/login.dto';
import { SignInDTO, UserInDTO, signInMapper, userInMapper } from './dto/auth.dto';
import { UserEntity } from '../user/entity/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /*Register a new user*/
  @Post('register')
  async signUp(@Body() signUpDTO: SignUpDTO): Promise<UserI> {
    return this.authService.signup(signUpDTO);
  }

  //Signin a new user
  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<SignInDTO> {
    const { token, user } = await this.authService.login(loginDTO);

    return signInMapper(token, user);
  }

  //Get current user
  @Get('user')
  @UseGuards(AuthGuard())
  async profil(@CurrentUser() user: UserEntity): Promise<UserInDTO> {
    console.log('curent user', user);
    return await userInMapper(user);
  }
}
