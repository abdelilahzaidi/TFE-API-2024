import { UserI } from '../user/interface/user.interface';
import { UserService } from './../user/user.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDTO } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import JwtFeature from 'src/common/jwt/jwtFeature.utils';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDTO): Promise<UserI> {
    
    if (
      !signUpDto.first_name ||
      !signUpDto.last_name ||
      !signUpDto.email ||
      !signUpDto.password ||
      !signUpDto.password_confirm ||
      !signUpDto.actif ||
      !signUpDto.attributionDate ||
      !signUpDto.commune ||
      !signUpDto.rue ||
      !signUpDto.ville ||
      !signUpDto.status ||
      !signUpDto.gender ||
      !signUpDto.gsm
    ) {
      throw new BadRequestException('All fields are required!');
    }

    
    if (signUpDto.password !== signUpDto.password_confirm) {
      throw new BadRequestException('Passwords do not match!');
    }

    
    const existingUser = await this.userService.findOneByEmail(signUpDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists!');
    }

    

    try {
      
      const hashedPassword = await bcrypt.hash(signUpDto.password, 12);

      
      const user = await this.userService.signup({
        ...signUpDto,
        password: hashedPassword,
        attributionDate: new Date(),
      });

      return user;
    } catch (error) {
      
      throw new InternalServerErrorException(error, 'Error creating user.');
    }
  }

  //Login user
  async login(dto: LoginDTO): Promise<{ token: string; user: UserI }> {
    const { email, password } = dto;

    const user = await this.userService.findOneByEmail(email);
    console.log('before', user);
    if (!user) {
      throw new UnauthorizedException('Invalid email adress or password.');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    console.log('Paswword', isPasswordMatched);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email adress or password');
    }

    const token = await JwtFeature.assignJwtToken(user.id, this.jwtService);
    console.log("Details taoken : ",token);

    return { token, user };
  }
}
