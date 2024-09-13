import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { TechnichalTypeEntity } from './entity/technical-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TechnichalEntity } from '../technichal/entity/technichal.entity';
import { TechnichalService } from '../technichal/technichal.service';

@Injectable()
export class TechnicalTypeService {
    constructor(
        @InjectRepository(TechnichalTypeEntity)
        private readonly technicalTypeRepository : Repository<TechnichalTypeEntity>,
        private readonly technichalService: TechnichalService,
    ){}
    async all(): Promise<any> {
        return await this.technicalTypeRepository.find({
          select: ['id', 'type'],
          relations: ['technichals'],
        });
      }
    async findById(id:number):Promise<any>{
        return await this.technicalTypeRepository.findOne({where:{id}})
    }
    async associateTechnichalToType(technichalId: number, typeId: number): Promise<void> {
        const technichal = await this.technichalService.findById(technichalId);
        const type = await this.technicalTypeRepository.findOne({ where: { id: typeId }, relations: ['technichals'] });
    
        if (!technichal || !type) {
          throw new Error('Technichal or Type not found');
        }
    
        // Associer le technichal au type
        type.technichals.push(technichal);
        await this.technicalTypeRepository.save(type);
      }
    
}
