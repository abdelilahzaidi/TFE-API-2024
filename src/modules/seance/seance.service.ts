import {
  Body,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Param,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { SeanceEntity } from './entity/seance.entity';
import { CourService } from '../cour/cour.service';
import { DateCourService } from '../date-cour/date-cour.service';
import { SeanceCreateDTO } from '../user/dto/seance-create.dto';
import { HoraireService } from '../horaire/horaire.service';

@Injectable()
export class SeanceService {
  private readonly logger = new Logger(SeanceService.name);
  constructor(
    @InjectRepository(SeanceEntity)
    private readonly seanceRepository: Repository<SeanceEntity>,
    private readonly dateCourService: DateCourService,
    private readonly courService: CourService,
    private readonly horaireService: HoraireService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // async getAllSeances(): Promise<SeanceEntity[]> {
  //     return this.seanceRepository.find();
  // }

  async getAllSeances(): Promise<SeanceEntity[]> {
    return this.seanceRepository.find({
      relations: ['horaire', 'cour', 'dateCour','cour.lieu'],
    });
  }

  async getAllFuturSeances(): Promise<SeanceEntity[]> {
    return await this.seanceRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.dateCour', 'dc')
      .where('dc.dateCour > :today', { today: new Date() })
      .getMany();
  }

  async findOneById(id: number): Promise<SeanceEntity> {
    return this.seanceRepository.findOne({
      where: { id },
      relations: ['horaire'],
    });
  }
  
  async findSeanceUserById(id: number): Promise<SeanceEntity[] | undefined> {
    return await this.seanceRepository.find({
      where: { id },
      relations: ['seanceUsers','users'],
    });
  }
// async createSeance(dto: SeanceCreateDTO): Promise<SeanceEntity | null> {
//   try {
//     this.logger.debug(`${JSON.stringify(dto)}`);

//     const dateCour = await this.dateCourService.findDateCourById(dto.idDateCour);
//     // if (dateCour) {
//     //   throw new ConflictException('Cette date de Cour existe déjà.');
//     // }

//     const cour = await this.courService.findCourById(dto.idCour);
//     // if (!cour) {
//     //   throw new NotFoundException('Cours non trouvé.');
//     // }

//     const horaire = await this.horaireService.findHoraireById(dto.idHoraire);
//     // if (!horaire) {
//     //   throw new ConflictException('Cet horaire existe déjà.');
//     // }

//     const seance = new SeanceEntity();
//     seance.cour = cour;
//     seance.horaire = horaire;
//     seance.dateCour = dateCour;

//     const savedSeance = await this.seanceRepository.save(seance);

//     this.logger.debug('Séance créée avec succès:', savedSeance);
//     return savedSeance;

//   } catch (error) {
//     throw new InternalServerErrorException(
//       error,
//       'Une erreur est survenue lors de la création de la séance.',
//     );
//   }
// }


  //   async insertParticipantAction(
  //     @Param('id') id: number,
  // @Body() { userIds }: any,
  //   ){
  //     const seance = await this.seanceRepository.findOne({where:{id}});
  //     const users=await this.userRepository.find({ where: { id: In(userIds) } });

  //     if (!seance.seanceUsers) {
  //       seance.seanceUsers = [];
  //     }
  //     seance.seanceUsers.push(...users);
  //     const seanceUser =await this.seanceRepository.save(seance);
  //     console.log('seanceUser',seanceUser)
  //     return seanceUser

  //   }

  //   async findSeanceById(id: number): Promise<SeanceEntity | undefined> {
  //     return this.seanceRepository.findOne({ where: { id } });
  //   }

  //   async saveSeance(seance: SeanceEntity): Promise<SeanceEntity> {
  //     return this.seanceRepository.save(seance);
  //   }

  async createSeance(dto: SeanceCreateDTO): Promise<SeanceEntity | null> {
    try {
      this.logger.debug(`Creating seance with DTO: ${JSON.stringify(dto)}`);
  
      const dateCour = await this.dateCourService.findDateCourById(dto.idDateCour);
      this.logger.debug(`DateCour found: ${JSON.stringify(dateCour)}`);
      if (!dateCour) {
        throw new NotFoundException('Date de cours non trouvée.');
      }
  
      const cour = await this.courService.findCourById(dto.idCour);
      this.logger.debug(`Cour found: ${JSON.stringify(cour)}`);
      if (!cour) {
        throw new NotFoundException('Cours non trouvé.');
      }
  
      const horaire = await this.horaireService.findHoraireById(dto.idHoraire);
      this.logger.debug(`Horaire found: ${JSON.stringify(horaire)}`);
      if (!horaire) {
        throw new NotFoundException('Horaire non trouvé.');
      }
  
      const seance = new SeanceEntity();
      seance.cour = cour;
      seance.horaire = horaire;
      seance.dateCour = dateCour;
  
      const savedSeance = await this.seanceRepository.save(seance);
      this.logger.debug(`Seance saved: ${JSON.stringify(savedSeance)}`);
  
      return savedSeance;
  
    } catch (error) {
      this.logger.error('Error creating seance:', error);
      throw new InternalServerErrorException(
        error,
        'Une erreur est survenue lors de la création de la séance.',
      );
    }
  }
  

  async findSeanceById(id: number): Promise<SeanceEntity | undefined> {
    return this.seanceRepository.findOne({
      where: { id },
      relations: ['seanceUsers'],
    });
  }

  async saveSeance(seance: SeanceEntity): Promise<SeanceEntity> {
    return this.seanceRepository.save(seance);
  }

  async insertParticipantAction(
    id: number,
    userIds: number[],
  ): Promise<SeanceEntity> {
    const seance = await this.findSeanceById(id);
    if (!seance) {
      throw new NotFoundException('Séance non trouvée');
    }

    const users = await this.userRepository.find({
      where: { id: In(userIds) },
    });
    if (!users.length) {
      throw new NotFoundException('Utilisateurs non trouvés');
    }

    if (!seance.users) {
      seance.users = [];
    }
    seance.users.push(...users);

    return this.saveSeance(seance);
  }
}
