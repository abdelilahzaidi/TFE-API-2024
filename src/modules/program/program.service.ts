import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramEntity } from './entity/program.entity';
import { ProgramI } from './interface/program.interface';
import { LevelI } from '../level/interface/level.interface';
import { TechnichalEntity } from '../technichal/entity/technichal.entity';
import { TechnichalService } from '../technichal/technichal.service';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(ProgramEntity)
    private readonly programRepository: Repository<ProgramI>,
    // @InjectRepository(TechnichalEntity)
    // private readonly technichalRepository: Repository<TechnichalEntity>,
    private readonly technichalService: TechnichalService,
  ) {}
  // async all(): Promise<ProgramI[]> {
  //   return await this.programRepository.find({relations:['technicals']});
  // }

  async all(): Promise<ProgramI[]> {
    const programs = await this.programRepository.find({
      select: ['technicals'],
      relations: ['technicals'],
    });

    return programs.map((program) => ({
      id: program.id,
      title: program.title,
      grade: program.grade,
      technicals: program.technicals,
    }));
  }
  async findOneByProgram(id: number): Promise<ProgramI> {
    console.log(id);
    return await this.programRepository.findOne({
      where: { id: id },
      relations: ['grade', 'technicals'],
    });
  }

  // async updateProgramTechnicals(programId: number, technicalIds: number[]): Promise<ProgramEntity> {
  //   // Récupérer le programme par son ID
  //   const program = await this.programRepository.findOne({ where: { id: programId }, relations: ['technicals'] });
  //   if (!program) {
  //     throw new Error('Program not found');
  //   }

  //   // Récupérer les technicals par leurs IDs
  //   const technicals = await this.technichalService.findAllByIds(technicalIds);
  //   if (technicals.length !== technicalIds.length) {
  //     throw new Error('Some technicals not found');
  //   }

  //   // Mettre à jour les relations
  //   program.technicals = technicals;

  //   // Enregistrer les modifications
  //   return await this.programRepository.save(program);
  // }

  async updateProgramTechnicals(
    programId: number,
    technicalIds: number[],
  ): Promise<ProgramEntity> {
    try {
      // Récupérer le programme par son ID
      const program = await this.programRepository.findOne({
        where: { id: programId },
        relations: ['technicals'],
      });
      if (!program) {
        throw new BadRequestException(
          `Le programme avec l'ID ${programId} n'existe pas !`,
        );
      }

      // Récupérer les techniques par leurs IDs
      console.log('IDs des techniques :', technicalIds);
      const technicals =
        await this.technichalService.findAllByIds(technicalIds);
      console.log('Techniques trouvées :', technicals);
      const foundTechnicalIds = technicals.map((t) => t.id);

      if (technicals.length !== technicalIds.length) {
        const missingIds = technicalIds.filter(
          (id) => !foundTechnicalIds.includes(id),
        );
        throw new BadRequestException(
          `Certaines techniques introuvables : ${missingIds.join(', ')}`,
        );
      }

      // Mettre à jour les relations
      program.technicals = technicals;

      // Enregistrer les modifications
      return await this.programRepository.save(program);
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour des techniques du programme:',
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la mise à jour des techniques du programme',
      );
    }
  }
}
