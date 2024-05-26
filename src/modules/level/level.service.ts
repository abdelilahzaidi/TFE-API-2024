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


  async update(id: number, dto: LevelUpdateDTO): Promise<LevelEntity> {
    try {
      // Récupérer l'entité Level existante par son ID
      const existingLevel = await this.levelRepository.findOne({ where: { id } });
  
      // Vérifier si l'entité Level existe
      if (!existingLevel) {
        throw new NotFoundException(`Level with ID ${id} not found.`);
      }
  
      // Vérifier si un ID de programme est fourni dans le DTO
      if (dto.programId) {
        // Récupérer l'entité Program correspondante par son ID
        const program = await this.programService.findOneByProgram(dto.programId);
  
        // Vérifier si le programme correspondant existe
        if (!program) {
          throw new NotFoundException(`Program with ID ${dto.programId} not found.`);
        }
  
        // Mettre à jour la relation 'program' dans l'entité 'LevelEntity'
        existingLevel.program = program;
      }
  
      // Mettre à jour d'autres champs si nécessaire
      existingLevel.during = dto.during;
  
      // Enregistrer les modifications dans la base de données
      const updatedLevel = await this.levelRepository.save(existingLevel);
  
      return updatedLevel;
    } catch (error) {
      // Gérer les erreurs avec une exception InternalServerError
      throw new InternalServerErrorException(
        'Failed to update level.',
        error,
      );
    }
  }
  

  
}
