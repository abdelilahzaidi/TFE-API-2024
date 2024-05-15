import {
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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  //Features for users
  //List all users
  async all(): Promise<UserI[]> {
    console.log('Hello all');
    return await this.userRepository.find();
  }
  //create a user
  async create(createUser: UserCreateDTO): Promise<UserI> {
    return this.userRepository.save(createUser);
  }
  //Register a user
  async signup(signup: SignUpDTO): Promise<UserI> {
    return this.userRepository.save(signup);
  }

  //Find a user by email
  async findOneByEmail(email: string): Promise<UserI> {
    return this.userRepository.findOneBy({ email });
  }
  //Find a user by email
  async findOneById(id: number): Promise<UserI> {
    return this.userRepository.findOne({ where: { id } });
  }

  //Delete a user
  async delete(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }

  //update a user

  async update(id: number, dto: UserUpdateDTO) {
    try {
      const existingUser = await this.userRepository.findOne({where:{id}});
      if (!existingUser) {
        throw new NotFoundException('User not found!');
      }

      existingUser.first_name = dto.first_name;
      existingUser.last_name = dto.last_name;
      existingUser.email = dto.email;
      existingUser.gender = dto.gender;
      existingUser.rue = dto.rue;
      existingUser.commune = dto.commune;
      existingUser.ville = dto.ville;
      existingUser.birthDate = dto.birthDate;
      existingUser.attributionDate = new Date();
      existingUser.actif = dto.actif;
      existingUser.gsm = dto.gsm;
      existingUser.status = dto.status;

      const updateResult = await this.userRepository.save(existingUser);

      console.log('Utilisateur mis à jour:', existingUser);

      return updateResult;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        "Une erreur est survenue lors de la modification de l'utilisateur.",
      );
    }
  }
}
