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

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(LevelEntity)
    private levelRepository: Repository<LevelEntity>,
    private readonly programService: ProgramService,
    @InjectRepository(TechnichalEntity)
    private readonly technichalRepository: Repository<TechnichalEntity>
    //private readonly technicalTypeService : TechnicalTypeService
  ) {}

  async all(): Promise<LevelEntity[]> {
    try {
      const levels = await this.levelRepository.find({select:['users'],relations:['users']});
      console.log('Levels:', levels); // Log pour debug
      return levels;
    } catch (error) {
      console.error('Error fetching levels:', error); // Log les erreurs
      throw error;
    }
  }
  // async findLevelById(id: number): Promise<LevelEntity | undefined> {
  //   const existingLevel = await this.levelRepository.findOne({ where: { id },relations:['users'] });
  //   if (!existingLevel) {
  //     throw new NotFoundException(`Level ${id} don't exist!!!`);
  //   }
  //   return this.levelRepository.findOne({ where: { id } });
  // }
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


  // async update(id: number, dto: LevelUpdateDTO): Promise<LevelI> {
  //   try {
  //     // Récupérer l'entité Level existante par son ID
  //     const existingLevel = await this.levelRepository.findOne({ where: { id } });
  
  //     // Vérifier si l'entité Level existe
  //     if (!existingLevel) {
  //       throw new NotFoundException(`Level with ID ${id} not found.`);
  //     }
  
  //     // Vérifier si un ID de programme est fourni dans le DTO
  //     if (dto.programId) {
  //       // Récupérer l'entité Program correspondante par son ID
  //       const program = await this.programService.findOneByProgram(dto.programId);
  
  //       // Vérifier si le programme correspondant existe
  //       if (!program) {
  //         throw new NotFoundException(`Program with ID ${dto.programId} not found.`);
  //       }
  
  //       // Mettre à jour la relation 'program' dans l'entité 'LevelEntity'
  //       existingLevel.program = program;

  //       // Si des technicalTypes sont fournis, les récupérer et les associer au program
  //       if (dto.technicalTypeIds && dto.technicalTypeIds.length > 0) {
  //         const technicalTypes = await this.technicalTypeService.findById(id);
  //         program.technicalTypes = technicalTypes;
  //       }
  //     }
  
  //     // Mettre à jour d'autres champs si nécessaire
  //     existingLevel.during = dto.during;
  
  //     // Enregistrer les modifications dans la base de données
  //     const updatedLevel = await this.levelRepository.save(existingLevel);
  
  //     return updatedLevel;
  //   } catch (error) {
  //     // Gérer les erreurs avec une exception InternalServerError
  //     throw new InternalServerErrorException(
  //       'Failed to update level.',
  //       error,
  //     );
  //   }
  // } 

  
  async update(id: number, dto: LevelUpdateDTO): Promise<LevelI> {
    try {
      // Récupérer l'entité Level existante par son ID
      const existingLevel = await this.levelRepository.findOne({ where: { id }, relations: ['program','typeTechnical'] });
  
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
  
        // Si des technicalTypeIds sont fournis, les récupérer et les associer au program
        if (dto.technicalIds && dto.technicalIds.length > 0) {
          const technicals = await this.technichalRepository.find({
           where:{id:In(dto.technicalIds)}
          });
          program.technicals = technicals;
        } else {
          // Si aucun technicalTypeId n'est fourni, on vide la relation
          program.technicals = [];
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
