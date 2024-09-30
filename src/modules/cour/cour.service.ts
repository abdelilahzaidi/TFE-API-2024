import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LieuService } from '../lieu/lieu.service';
import { CourEntity } from './entity/cour.entity';
import { CreateCourDTO } from './dto/cour-create.dto';

@Injectable()
export class CourService {
    constructor(
        @InjectRepository(CourEntity)
        private courRepository: Repository<CourEntity>,
        private lieuService : LieuService
      ) {}
    
      async all(): Promise<CourEntity[]> {
        return await this.courRepository.find({relations:['lieu']});
      }

      async createCour(dto: CreateCourDTO): Promise<CourEntity> {
        try {
            
            const lieu = await this.lieuService.findLieuById(dto.lieuId); 
            console.log('lieu',lieu)
            const cour = new CourEntity();
            cour.objectifDuCour=dto.objectifDuCour
            cour.lieu=lieu      
     

            const savedCour = await this.courRepository.save(cour);

            console.log('in service', savedCour);
            return savedCour;
        } catch (error) {
          throw new InternalServerErrorException(
            error,

            "Une erreur est survenue lors de la création du cour.",

          );
        }
    }    
      async findCourById(id: number): Promise<CourEntity | undefined> {
        return this.courRepository.findOne({ where: { id } });
      }
}
