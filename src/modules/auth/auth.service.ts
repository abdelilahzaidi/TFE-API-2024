import { UserI } from '../user/interface/user.interface';
import { UserService } from './../user/user.service';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { SignUpDTO } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private userService : UserService,
        private jwtService 
    ){}

    async signup(signUpDto: SignUpDTO): Promise<UserI> {
        // Vérifier si les champs requis sont présents dans le DTO
        if (!signUpDto.first_name || !signUpDto.email || !signUpDto.password || !signUpDto.password_confirm) {
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
            attributionDate: new Date()
          });
    
          return user;
        } catch (error) {
          // Gérer les erreurs lors du hachage du mot de passe
          throw new InternalServerErrorException('Error creating user.');
        }
      }
}
