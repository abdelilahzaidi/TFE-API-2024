import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechnichalEntity } from './entity/technichal.entity';
import { In, Repository } from 'typeorm';
import { TechnichalTypeEntity } from '../technical-type/entity/technical-type.entity';
import { ITechnichal } from './interface/technical.interface';
import { CreateTechnicalDto } from './dto/create-technical.dto';
import { TechnichalUpdateDTO } from './dto/Update-technical.dto';
import { ProgramEntity } from '../program/entity/program.entity';

@Injectable()
export class TechnichalService {
  constructor(
    @InjectRepository(TechnichalEntity)
    private readonly technichalRepository: Repository<TechnichalEntity>,
    @InjectRepository(TechnichalTypeEntity)
    private readonly technichalTypeRepository: Repository<TechnichalTypeEntity>,
    @InjectRepository(ProgramEntity)
    private readonly programRepository: Repository<ProgramEntity>,
  ) {}

  async all(): Promise<ITechnichal[]> {
    return await this.technichalRepository.find({
      relations: ['technichalType'],
    });
  }

  async findById(id: number): Promise<ITechnichal> {
    try {
      const technical = await this.technichalRepository.findOne({
        where: { id },
      });

      if (!technical) {
        const message = `La technique avec l'ID ${id} n'existe pas !`;
        throw new BadRequestException(message);
      }

      return technical;
    } catch (error) {
      console.error(
        'Erreur lors de la récupération de la technique:',
        error.message,
      );
      throw error;
    }
  }

  async findAllByIds(ids: number[]): Promise<ITechnichal[]> {
    return await this.technichalRepository
      .createQueryBuilder('technical')
      .whereInIds(ids)
      .getMany();
  }
  async addTechnichal(): Promise<any> {}

  async createTechnichal(
    createTechnicalDto: CreateTechnicalDto,
  ): Promise<ITechnichal> {
    const { nom, description, technicalTypeId, programIds } =
      createTechnicalDto;

    const newTechnichal = new TechnichalEntity();
    newTechnichal.nom = nom;
    newTechnichal.description = description;

  

    // Assigner le type technique s'il est fourni
    if (technicalTypeId) {
      const technichalType = await this.technichalTypeRepository
        .createQueryBuilder('technichalType')
        .where('technichalType.id = :technichalTypeId', { technicalTypeId })
        .getOne();

      if (!technichalType) {
        throw new Error('Technichal Type not found');
      }

      newTechnichal.technichalType = technichalType;
      console.log('Id', technicalTypeId);
    }

    // Gestion des programs associés
    if (programIds && programIds.length > 0) {
      const programs = await this.programRepository
        .createQueryBuilder('program')
        .whereInIds(programIds)
        .getMany();

      if (programs.length !== programIds.length) {
        throw new Error('One or more Program IDs not found');
      }

      newTechnichal.programs = programs;
    }

    return await this.technichalRepository.save(newTechnichal);
  }

  // async updateTechnichal(
  //   technichalId: number,                   // L'ID de la technique à mettre à jour
  //   updateTechnicalDto: TechnichalUpdateDTO,  // DTO pour les nouvelles données
  // ): Promise<ITechnichal> {
  //   const { nom, description, technichalTypeId, programIds } = updateTechnicalDto;

  //   // Récupérer la technique à partir de son ID
  //   const existingTechnichal = await this.technichalRepository.findOne({
  //     where: { id: technichalId },
  //     relations: ['technichalType', 'programs'], // Charger également les relations avec les programmes
  //   });

  //   if (!existingTechnichal) {
  //     throw new Error(`Technique avec l'ID ${technichalId} non trouvée.`);
  //   }

  //   // Mettre à jour les champs si des valeurs sont fournies
  //   if (nom) {
  //     existingTechnichal.nom = nom;
  //   }

  //   if (description) {
  //     existingTechnichal.description = description;
  //   }

  //   // Gestion de la mise à jour du type de technique
  //   if (technichalTypeId) {
  //     // Vérifier et mettre à jour le type de technique si fourni
  //     const technichalType = await this.technichalTypeRepository
  //       .createQueryBuilder('technichalType')
  //       .where('technichalType.id = :technichalTypeId', { technichalTypeId })
  //       .getOne();

  //     if (!technichalType) {
  //       throw new Error(`Le type de technique avec l'ID ${technichalTypeId} n'existe pas.`);
  //     }

  //     existingTechnichal.technichalType = technichalType;
  //   }

  //   // Gestion de la mise à jour des programmes associés
  //   if (programIds && programIds.length > 0) {
  //     // Recherche des programmes associés à partir des IDs
  //     const programs = await this.programRepository
  //       .createQueryBuilder('program')
  //       .whereInIds(programIds)
  //       .getMany();

  //     if (programs.length !== programIds.length) {
  //       throw new Error('Un ou plusieurs Programmes avec les IDs fournis n\'existent pas.');
  //     }

  //     // Mettre à jour la relation entre la technique et les programmes
  //     existingTechnichal.programs = programs;
  //   }

  //   // Sauvegarder la technique mise à jour avec les nouvelles relations et données
  //   return await this.technichalRepository.save(existingTechnichal);
  // }

  async updateTechnichals(
    id: number,
    updateTechnichalDto: TechnichalUpdateDTO,
  ): Promise<TechnichalEntity> {
    const technichal = await this.technichalRepository.findOne({
      where: { id },
    });

    if (!technichal) {
      throw new NotFoundException(`Technichal with ID ${id} not found`);
    }

    const { nom, description, technicalTypeId, programIds } =
      updateTechnichalDto;

    // Mettre à jour les champs simples
    if (nom) technichal.nom = nom;
    if (description) technichal.description = description;

    // Mettre à jour la relation technicalType
    if (technicalTypeId) {
      const technicalType = await this.technichalTypeRepository.findOne({
        where: { id: technicalTypeId },
      });
      if (!technicalType) {
        throw new NotFoundException(
          `TechnicalType with ID ${technicalTypeId} not found`,
        );
      }
      technichal.technichalType = technicalType; // Assignation correcte de l'entité
    }

    // Mettre à jour la relation programs
    if (programIds && programIds.length > 0) {
      const programs = await this.programRepository.findByIds(programIds); // Récupération des entités
      if (programs.length !== programIds.length) {
        throw new NotFoundException(`One or more programs not found`);
      }
      technichal.programs = programs; // Assignation correcte des entités
    }

    return this.technichalRepository.save(technichal);
  }
}
