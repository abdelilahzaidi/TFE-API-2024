import { UserStatus } from 'src/common/enums/status.enum';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { UserI } from './interface/user.interface';
import { SignUpDTO } from '../auth/dto/signup.dto';
import { UserCreateDTO } from './dto/user-create.dto';
import { UserUpdateDTO } from './dto/user-update.dto';
import * as bcrypt from 'bcrypt';
import { LevelEntity } from '../level/entity/level.entity';
import { LevelService } from '../level/level.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly levelService: LevelService
  ) {}
  //Features for users
  //List all users
  async all(): Promise<UserI[]> {
    console.log('Hello all');
    return await this.userRepository.find();
  }
  //Create user
  async create(createUser: UserCreateDTO): Promise<UserI> {
    // Générer un mot de passe aléatoire ou utiliser un mot de passe par défaut
    const defaultPassword = 'Zah14$01471983';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    try {
      const level = await this.levelService.findLevelById(createUser.level);
      const userFound = await this.userRepository.findOne({
        where: { email: createUser.email },
      });

      if (userFound) {
        throw new ConflictException('Cette adresse email existe déjà!!!');
      }

      const user = {
        ...createUser,
        password: hashedPassword,
        attributionDate: new Date(),
        level: level,
      } as UserEntity;

      const userSaved = await this.userRepository.save(user);
      return userSaved;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        "Une erreur est survenue lors de la création de l'utilisateur.",
      );
    }
  }
  // async createUser(dto: UserCreateDTO): Promise<UserI> {
  //   const hashedPassword = await bcrypt.hash('Zah14$01471983', 12);
  //   try {

  //     const level = await this.levelService.;
  //     if (!level) {
  //       console.log('42')
  //       throw new NotFoundException(`Level with ID ${dto.grade} not found.`);
  //     }

  //     const userFound = await this.userRepository.findOne({
  //       where: { email: dto.email },
  //     });
  //     if (userFound) {
  //       console.log('49')
  //       throw new ConflictException('Cette adresse e-mail est déjà utilisée.');
  //     }

  //     const user = <UserEntity>{...dto,password:hashedPassword, attributionDate : new Date(), level: level}
  //     return user

  //   } catch (error) {
  //     console.log('59')
  //     throw new InternalServerErrorException(
  //       error,
  //       "Une erreur est survenue lors de la création de l'utilisateur.",
  //     );
  //   }

  // }

  //Register a user
  async signup(signup: SignUpDTO): Promise<UserI> {
    return this.userRepository.save(signup);
  }

  //Find a user by email
  async findOneByEmail(email: string): Promise<UserI> {
    return this.userRepository.findOneBy({ email });
  }
  //Find a user by id
  async findOneById(id: number): Promise<UserI> {
    return this.userRepository.findOne({ where: { id } });
  }

  //Find a user by status
  async findOneByStatus(status: UserStatus): Promise<any> {
    return this.userRepository.findOne({ where: { status } });
  }

  //Delete a user
  async delete(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }

  //update a user

  async update(id: number, dto: UserUpdateDTO) {
    try {
      const existingUser = await this.userRepository.findOne({ where: { id } });
      console.log(existingUser)
      if (!existingUser) {
        throw new NotFoundException('User not found!');
      }

      const user = new UserEntity();

      user.first_name = dto.first_name;
      user.last_name = dto.last_name;
      user.rue = dto.rue;
      user.birthDate = dto.birthDate;
      user.attributionDate = new Date();
      user.actif = dto.actif;
      user.gsm = dto.gsm;
      user.status = dto.status;
      //user.level=dto.level;
      

      const updateResult = await this.userRepository.save(existingUser);

      console.log('Utilisateur mis à jour:', user.level,' ',dto.level);

      return updateResult;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        "Une erreur est survenue lors de la modification de l'utilisateur.",
      );
    }
  }
  async findOneByLevel(userId: number): Promise<UserI> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['level','level.program'],
    });
  }
}
