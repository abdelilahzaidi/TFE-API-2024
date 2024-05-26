import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramEntity } from './entity/program.entity';
import { ProgramI } from './interface/program.interface';
import { LevelI } from '../level/interface/level.interface';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(ProgramEntity)
    private readonly programRepository: Repository<ProgramI>,
  ) {}
  async all(): Promise<ProgramI[]> {
    return await this.programRepository.find();
  }
  async findOneByProgram(id: number): Promise<ProgramI> {
    console.log(id)
    return await this.programRepository.findOne({
      where: { id: id }
    });
  }
  
}
