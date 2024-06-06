import { Body, ConflictException, Injectable, InternalServerErrorException, Param, Logger } from '@nestjs/common';
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
        @InjectRepository(SeanceEntity) private readonly seanceRepository :Repository<SeanceEntity>,
        //  private readonly dateCourService : DateCourService,
        // private readonly courService : CourService,
        // private readonly horaireService : HoraireService,
        // @InjectRepository(UserEntity)
        // private readonly userRepository : Repository<UserEntity>
        
        ){}


        // async getAllSeances(): Promise<SeanceEntity[]> {
        //     return this.seanceRepository.find();
        // }

    async getAllSeances(): Promise<SeanceEntity[]> {
        return this.seanceRepository.find({ relations:["horaire","cour","dateCour"]});
    }


    async getAllFuturSeances(): Promise<SeanceEntity[]> {
      return await this.seanceRepository.createQueryBuilder('s').leftJoinAndSelect('s.dateCour','dc').where('dc.dateCour > :today',{today:new Date()}).getMany();
  }

  

  async findOneById(id: number): Promise<SeanceEntity> {
    return this.seanceRepository.findOne({where:{id}, relations:["horaire"]});
}

    // async createSeance(dto: SeanceCreateDTO): Promise<SeanceEntity | null>  {
    //     try {
    //       this.logger.debug(`${JSON.stringify(dto)}`)
    //       const dateCour = await this.dateCourService.findDateCourById(dto.idDateCour)
    //       if (dateCour) {
    //         throw new ConflictException('Cette date de Cour existe déjà.');
    //       }

    //       const cour = await this.courService.findCourById(dto.idCour)

    //        const horaire = await this.horaireService.findHoraireById(dto.idHoraire)
    //       if (!horaire) {
    //         throw new ConflictException('Cet horaire existe déjà.');
    //       }          
    
    //       const seance = new SeanceEntity();
    //       seance.cour = cour;
    //       seance.horaire=horaire;
    //       seance.dateCour=dateCour
    
    //       const savedSeance = await this.seanceRepository.save(seance);
    
    //       console.log('in service', savedSeance);
    //       return savedSeance;
    //     } catch (error) {
    //       throw new InternalServerErrorException(
    //         error,
    //         'Une erreur est survenue lors de la création de la seance.',
    //       );
    //     }
    //   }

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
    
    //     return this.seanceRepository.save(seance);

    //   }    

}
