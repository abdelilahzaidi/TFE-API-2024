import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LevelEntity } from './entity/level.entity';
import { LevelUpdateDTO } from './dto/level-update.dto';
import { ProgramService } from '../program/program.service';
import { ProgramI } from '../program/interface/program.interface';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(LevelEntity)
    private levelRepository: Repository<LevelEntity>,
    private readonly programService: ProgramService,
  ) {}

  async all(): Promise<LevelEntity[]> {
    try {
      const levels = await this.levelRepository.find();
      console.log('Levels:', levels); // Log pour debug
      return levels;
    } catch (error) {
      console.error('Error fetching levels:', error); // Log les erreurs
      throw error;
    }
  }
  async findLevelById(id: number): Promise<LevelEntity | undefined> {
    const existingLevel = await this.levelRepository.findOne({ where: { id } });
    if (!existingLevel) {
      throw new NotFoundException(`Level ${id} don't exist!!!`);
    }
    return this.levelRepository.findOne({ where: { id } });
  }
  //update a level

  // async update(id: number, dto: LevelUpdateDTO): Promise<any> {
  //   const level= new LevelEntity()
  //   level.id=dto.programId
  //   console.log({level})
  //   return level
  // }

  async update(id: number, dto: LevelUpdateDTO): Promise<LevelEntity> {
    try {
      const existingLevel = await this.levelRepository.findOne({where:{id}});
      if (!existingLevel) {
        throw new NotFoundException(`Level with ID ${id} not found.`);
      }

      if (dto.programId) {
        const program = await this.programService.findOneByProgram(dto.programId);
        if (!program) {
          throw new NotFoundException(`Program with ID ${dto.programId} not found.`);
        }        

        // Mettez à jour la relation 'program' dans l'entité 'LevelEntity'
        existingLevel.program = program;
      }

      const updatedLevel = await this.levelRepository.save(existingLevel);

      return updatedLevel;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update level.',
        error,
      );
    }
  }

  
}
