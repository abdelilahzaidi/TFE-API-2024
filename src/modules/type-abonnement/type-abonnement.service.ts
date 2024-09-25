import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeAbonnementEntity } from './entity/type-abonnement';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TypeAbonnementService {
  constructor(
    @InjectRepository(TypeAbonnementEntity)
    private readonly typeAbonnementRepository: Repository<TypeAbonnementEntity>,
  ) {}

  async all(): Promise<any[]> {
    return await this.typeAbonnementRepository.find();
  }
  async findUsersByType(id: number): Promise<any> {
    const typeAbonnement = await this.typeAbonnementRepository.findOne({
      where: { id },

      relations: ['abonnements.user'],
    });

    if (!typeAbonnement) {
      throw new Error(`Type d'abonnement avec ID ${id} non trouvé.`);
    }

    const abonnements = typeAbonnement.abonnements;
    const users = abonnements.map((abonnement) => ({
      first_name: abonnement.user.first_name,
      last_name: abonnement.user.last_name,
      email: abonnement.user.email,
    }));

    return { typeAbonnement, users };
  }
  async deleteType(id: number): Promise<any> {
    const type = await this.typeAbonnementRepository.find({
      where: { id },
    });
    const result = await this.typeAbonnementRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`type abonnement with ID ${id} not found`);
    }
    if (!type) {
      throw new NotFoundException(`type abonnement with ID ${id} not found`);
    }

    // Return a success message
    return `Type abonnement ${type} is deleted!!!`;
  }
}
