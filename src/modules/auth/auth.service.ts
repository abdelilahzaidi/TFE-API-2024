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
    // Vérifier si les champs requis sont présents dans le DTO
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

    // Vérifier si les mots de passe correspondent
    if (signUpDto.password !== signUpDto.password_confirm) {
      throw new BadRequestException('Passwords do not match!');
    }

    // Vérifier si l'email existe déjà dans la base de données
    const existingUser = await this.userService.findOneByEmail(signUpDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists!');
    }

    // Ajouter ici une logique de validation d'email supplémentaire si nécessaire
    // Par exemple, vous pouvez vérifier le format de l'email, s'il est valide

    try {
      // Générer un hash de mot de passe sécurisé
      const hashedPassword = await bcrypt.hash(signUpDto.password, 12);

      // Créer l'utilisateur avec le mot de passe haché
      const user = await this.userService.signup({
        ...signUpDto,
        password: hashedPassword,
        attributionDate: new Date(),
      });

      return user;
    } catch (error) {
      // Gérer les erreurs lors du hachage du mot de passe
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
