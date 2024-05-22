import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramEntity } from './entity/program.entity';
import { ProgramI } from './interface/program.interface';

@Injectable()
export class ProgramService {
    constructor(
        @InjectRepository(ProgramEntity)
        private readonly programRepository: Repository<ProgramEntity>, 
    ){}
    async all(): Promise<ProgramI[]> {
        return await this.programRepository.find();
      }
}
