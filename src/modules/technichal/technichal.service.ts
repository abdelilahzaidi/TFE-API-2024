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

  // async findAllByIds(ids: number[]): Promise<any[]> {
  //   return await this.technichalRepository.findBy({ id: In(ids) });
  // }
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
  
    // Créer une nouvelle instance de Technichal
    const newTechnichal = new TechnichalEntity();
    newTechnichal.nom = nom;
    newTechnichal.description = description;
  
    // Utiliser un JOIN pour récupérer le technichalType associé
    console.log('Before', technichalTypeId);
  
    if (technichalTypeId) {
      // Trouver le technichalType correspondant à l'ID fourni
      const technichalType = await this.technichalTypeRepository
        .createQueryBuilder('technichalType')
        .where('technichalType.id = :technichalTypeId', { technichalTypeId })
        .getOne();
  
      // Vérifier si le technichalType a bien été trouvé
      if (!technichalType) {
        throw new Error('Technichal Type not found');
      }
  
      // Assigner directement l'objet technichalType au nouvel objet Technichal
      newTechnichal.technichalType = technichalType;
  
      console.log('Id', technichalTypeId);
    }
  
    // Sauvegarder la nouvelle technique dans la base de données
    return await this.technichalRepository.save(newTechnichal);
  }
  
}  

