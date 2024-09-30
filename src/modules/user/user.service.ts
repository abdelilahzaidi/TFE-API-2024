
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
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { MessageEntity } from '../message/entity/message.entity';
import { SentMessages } from './interface/user-sent-message.interface';
import { classToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(

    @InjectRepository(MessageEntity)
    private readonly messageRepository : Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly levelService: LevelService,
    @InjectRepository(SeanceUserEntity)
    private readonly userSeanceRepository : Repository<SeanceUserEntity>,
    private mailService: MailService,
    private jwtService: JwtService,
    
  ) {} 




// List all users 
async all(): Promise<UserI[]> {
  console.log('Hello all');
  try {
   
    return await this.userRepository.find({
      select: [
        'id', 'first_name', 'last_name', 'gender', 'birthDate', 'attributionDate',
        'rue', 'commune', 'ville', 'actif', 'gsm', 'email', 'status',      
      ]
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; 
  }
}

  //Find a user by id
  async findOneById(id: number): Promise<UserI> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },        
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



    //Find a user by level
    async findOneByLevel(id: number): Promise<UserI> {
      try {
        const user = await this.userRepository.findOne({
          where: { id },
          relations: ['level', 'level.program.technicals'], 
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


// List all users by level
async allByLevel(): Promise<UserI[]> {
  console.log('Hello all');
  try {
   
    return await this.userRepository.find({
      select: [
        'id', 'first_name', 'last_name', 'gender', 'birthDate', 'attributionDate',
        'rue', 'commune', 'ville', 'actif', 'gsm', 'email', 'status', 'level',
        
      ],
      relations: [
        'level', 
        'level.program', 
        'level.program.technicals', 
      ]
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; 
  }
}


async getUserWithMessages(userId: number): Promise<Record<string, any> | undefined> {
  const user = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.sentMessages', 'sentMessages')
    .leftJoinAndSelect('sentMessages.receivers', 'receivers')
    .where('user.id = :userId', { userId })
    .getOne();

  if (user) {
    user.sentMessages.forEach(message => {
      if (message.receivers) {
        message.receivers.forEach(receiver => {
          delete receiver.password;
        });
      }
    });
    return classToPlain(user);
  }

  return undefined;
}

  //Create user
  async create(createUser: UserCreateDTO): Promise<UserI> {
   
    
    const defaultPassword =process.env.DEFAULT_USER_PASSWORD || 'ZaidiAbdelilah1983';
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
  
  


    
  async findOneByProgram(userId: number): Promise<UserI> {
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

  //Reset Part

  async requestResetPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
  
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
  
    const payload = { email: user.email };
    const token = this.jwtService.sign(payload, { secret: "14101983", expiresIn: '1h' });
  
    const resetLink = `http://localhost:3001/user/reset-password?token=${token}`;
  
    await this.mailService.sendResetPasswordEmail(user.email, resetLink);
  }
  

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      const user = await this.userRepository.findOne({ where: { email: payload.email } });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await this.userRepository.save(user);
    } catch (e) {
      console.log('error ',e)
      throw new Error('Jeton invalide ou expiré');
    }
  }

  async findUserByMessageId(id: number): Promise<MessageEntity[]> {
    const messages = await this.messageRepository.find({
      where: { id },
      relations: ['receivers', 'sender'],
    });

    if (!messages.length) {
      throw new NotFoundException(`No messages found for user with id ${id}`);
    }

    return messages;
  } 

  async findMessageByUserById(id: number): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.receivedMessages', 'receivedMessage')
      .leftJoinAndSelect('receivedMessage.receivers', 'receiver')
      .where('user.id = :id', { id })
      .select([
        'user.id', 'user.first_name', 'user.last_name','user.email', 
        'receivedMessage.id', 'receivedMessage.titre', 
        'receiver.id', 'receiver.first_name', 'receiver.last_name', 'receiver.email' 
      ])
      .getOne();
  
    if (!user) {
      throw new NotFoundException(`No messages found for user with id ${id}`);
    }
  
    return user;
  }
  
  


  //Message par emetteur

  async findSentMessagesByUserId(id: number): Promise<SentMessages> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['sentMessages.sender', 'sentMessages.receivers'],
    });
  
    if (!user) {
      throw new NotFoundException(`No user found with id ${id}`);
    }
  
    const sentMessages: SentMessages = {
      sender: {
        firstName: user.first_name,
        lastName: user.last_name,
      },
      sentMessages: user.sentMessages.map(message => ({
        id: message.id,
        titre:message.titre,
        content: message.contenu, 
        dateHeureEnvoie : message.dateHeureEnvoie,
        receivers: message.receivers.map(receiver => ({
          firstName: receiver.first_name,
          lastName: receiver.last_name,
        })),
      })),
    };
  
    return sentMessages;
  }
  
  
}
