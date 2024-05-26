import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { TechnichalTypeEntity } from './entity/technical-type.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TechnicalTypeService {
    constructor(
        @InjectRepository(TechnichalTypeEntity)
        private readonly technicalTypeRepository : Repository<TechnichalTypeEntity>
    ){}
    async all():Promise<any>{
        return await this.technicalTypeRepository.find()
    }
}
