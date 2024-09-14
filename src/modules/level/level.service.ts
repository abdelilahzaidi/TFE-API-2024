import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, In, Repository } from 'typeorm';
import { LevelEntity } from './entity/level.entity';
import { LevelUpdateDTO } from './dto/level-update.dto';
import { ProgramService } from '../program/program.service';
import { ProgramI } from '../program/interface/program.interface';
import { LevelI } from './interface/level.interface';
import { TechnicalTypeService } from '../technical-type/technical-type.service';
import { TechnichalTypeEntity } from '../technical-type/entity/technical-type.entity';
import { TechnichalEntity } from '../technichal/entity/technichal.entity';
import { LevelEnum } from '../../common/enums/grade.enum';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(LevelEntity)
    private levelRepository: Repository<LevelEntity>,
    private readonly programService: ProgramService,
    @InjectRepository(TechnichalEntity)
    private readonly technichalRepository: Repository<TechnichalEntity>,
    //private readonly technicalTypeService : TechnicalTypeService
  ) {}

  async all(): Promise<LevelEntity[]> {
    try {
      const levels = await this.levelRepository.find({
        select: ['users'],
        relations: ['users'],
      });
      console.log('Levels:', levels);
      return levels;
    } catch (error) {
      console.error('Error fetching levels:', error);
      throw error;
    }
  }
  async findLevelById(id: number): Promise<LevelEntity | undefined> {
    const existingLevel = await this.levelRepository.findOne({
      where: { id },
      relations: ['users'], // Charge les utilisateurs associés
    });

    if (!existingLevel) {
      throw new NotFoundException(`Level ${id} doesn't exist!!!`);
    }

    return existingLevel;
  }
  async update(id: number, dto: LevelUpdateDTO): Promise<LevelI> {
    try {
      const existingLevel = await this.levelRepository.findOne({
        where: { id },
        relations: ['program', 'typeTechnical'],
      });

      if (!existingLevel) {
        throw new NotFoundException(`Level with ID ${id} not found.`);
      }

      if (dto.programId) {
        const program = await this.programService.findOneByProgram(
          dto.programId,
        );

        if (!program) {
          throw new NotFoundException(
            `Program with ID ${dto.programId} not found.`,
          );
        }

        if (dto.technicalIds && dto.technicalIds.length > 0) {
          const technicals = await this.technichalRepository.find({
            where: { id: In(dto.technicalIds) },
          });
          program.technicals = technicals;
        } else {
          program.technicals = [];
        }

        existingLevel.program = program;
      }
      
      existingLevel.during = dto.during;

      const updatedLevel = await this.levelRepository.save(existingLevel);

      return updatedLevel;
    } catch (error) {
      console.error('Error during level update:', error); // Log plus détaillé
      throw new InternalServerErrorException('Failed to update level.', error.message);
    }
  }
}
