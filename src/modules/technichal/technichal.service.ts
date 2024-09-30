import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechnichalEntity } from './entity/technichal.entity';
import { In, Repository } from 'typeorm';
import { TechnichalTypeEntity } from '../technical-type/entity/technical-type.entity';
import { ITechnichal } from './interface/technical.interface';
import { CreateTechnicalDto } from './dto/create-technical.dto';

@Injectable()
export class TechnichalService {
  constructor(
    @InjectRepository(TechnichalEntity)
    private readonly technichalRepository: Repository<TechnichalEntity>,
    @InjectRepository(TechnichalTypeEntity)
    private readonly technichalTypeRepository: Repository<TechnichalTypeEntity>,
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
    const { nom, description, technichalTypeId, programIds } = createTechnicalDto;
  
  
    const newTechnichal = new TechnichalEntity();
    newTechnichal.nom = nom;
    newTechnichal.description = description;
  
 
    console.log('Before', technichalTypeId);
  
    if (technichalTypeId) {
     
      const technichalType = await this.technichalTypeRepository
        .createQueryBuilder('technichalType')
        .where('technichalType.id = :technichalTypeId', { technichalTypeId })
        .getOne();
  
    
      if (!technichalType) {
        throw new Error('Technichal Type not found');
      }
  
     
      newTechnichal.technichalType = technichalType;
  
      console.log('Id', technichalTypeId);
    }
  
   
    return await this.technichalRepository.save(newTechnichal);
  }
  
}  

