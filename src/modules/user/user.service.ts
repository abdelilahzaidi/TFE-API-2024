
import { UserStatus } from 'src/common/enums/status.enum';
import {
  ConflictException,
  HttpException,
  HttpStatus,
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
import { SeanceUserEntity } from '../seance-user/entity/seance-user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly levelService: LevelService,
    @InjectRepository(SeanceUserEntity)
    private readonly userSeanceRepository : Repository<SeanceUserEntity>,
  ) {}
  
  //List all users
  async all(): Promise<UserI[]> {
    console.log('Hello all');
    return await this.userRepository.find({select:['id','first_name','last_name','gender','birthDate','attributionDate','rue','commune','ville','actif','gsm','email','status','level', ],relations:['level','level.program','level.program.technicals']});
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
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['level', 'level.program'], // Incluez 'level.program' pour charger également ProgramEntity
      });
  
      if (!user) {
        throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé !`);
      }
  
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Une erreur est survenue lors de la récupération de l'utilisateur avec l'ID ${id}.`,
        error.message,
      );
    }
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
      // Vérifier si l'utilisateur existe
      const existingUser = await this.userRepository.findOne({ where: { id }, relations: ['level'] });
      if (!existingUser) {
        throw new NotFoundException('Utilisateur non trouvé !');
      }
  
      // Hacher le mot de passe si fourni
      if (dto.password) {
        existingUser.password = await bcrypt.hash(dto.password, 12);
      }
  
      // Mettre à jour le niveau si fourni
      if (dto.level) {
        const level = await this.levelService.findLevelById(dto.level);
        if (!level) {
          throw new NotFoundException(`Le niveau ${dto.level} n'existe pas !`);
        }
        existingUser.level = level;
      }
  
      // Mettre à jour les autres propriétés de l'utilisateur existant
      existingUser.first_name = dto.first_name ?? existingUser.first_name;
      existingUser.last_name = dto.last_name ?? existingUser.last_name;
      existingUser.gender = dto.gender ?? existingUser.gender;
      existingUser.email = dto.email ?? existingUser.email;
      existingUser.rue = dto.rue ?? existingUser.rue;
      existingUser.commune = dto.commune ?? existingUser.commune;
      existingUser.ville = dto.ville ?? existingUser.ville;
      existingUser.birthDate = dto.birthDate ?? existingUser.birthDate;
      existingUser.attributionDate = new Date(); // Mettre à jour la date d'attribution
      existingUser.actif = dto.actif ?? existingUser.actif;
      existingUser.gsm = dto.gsm ?? existingUser.gsm;
      existingUser.status = dto.status ?? existingUser.status;
  
      // Sauvegarder l'utilisateur mis à jour dans la base de données
      const updateResult = await this.userRepository.save(existingUser);
  
      console.log('Utilisateur mis à jour:', updateResult);
  
      return updateResult;
    } catch (error) {
      throw new InternalServerErrorException(
        "Une erreur est survenue lors de la modification de l'utilisateur.",
        error.message,
      );
    }
  }
  
  
  async findOneByLevel(userId: number): Promise<UserI> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['level','level.program','level.program.technicals'],
    });
  }

  async findUserStatusByUserId(id: any) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('No user found by Id', HttpStatus.NOT_FOUND);
    }

    return user.status;
  }

  async updatePresenceSeance(id: number, estPresent: boolean): Promise<void> {
    try {
      
      const seanceUser = await this.userSeanceRepository.findOne({ where: { id } });
      
  
      if (!seanceUser) {
        throw new HttpException('No SeanceUser found by Id', HttpStatus.NOT_FOUND);
      }
      
    
      seanceUser.presence = estPresent;
      
      
      await this.userSeanceRepository.save(seanceUser);
    } catch (error) {
     
      throw new HttpException('Error updating SeanceUser presence', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  
}
